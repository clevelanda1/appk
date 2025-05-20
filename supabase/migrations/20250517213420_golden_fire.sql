/*
  # Database Schema for Apple Pay Prank App
  
  1. New Tables
    - contacts
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - name (text)
      - created_at (timestamp)
    
    - transactions
      - id (uuid, primary key)
      - user_id (uuid, references auth.users)
      - contact_name (text)
      - amount (decimal)
      - status (text)
      - created_at (timestamp)
      - is_phone_number (boolean)
      - is_merchant (boolean)
  
  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to manage their own data
    - Add trigger to maintain transaction limit per user
*/

-- Create contacts table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS contacts (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    name text NOT NULL,
    created_at timestamptz DEFAULT now()
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create transactions table if it doesn't exist
DO $$ BEGIN
  CREATE TABLE IF NOT EXISTS transactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users NOT NULL,
    contact_name text NOT NULL,
    amount decimal(10,2) NOT NULL,
    status text DEFAULT 'Received',
    created_at timestamptz DEFAULT now(),
    is_phone_number boolean DEFAULT false,
    is_merchant boolean DEFAULT false
  );
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Create index on transactions timestamp if it doesn't exist
DO $$ BEGIN
  CREATE INDEX IF NOT EXISTS idx_transactions_timestamp ON transactions(created_at DESC);
EXCEPTION
  WHEN duplicate_table THEN
    NULL;
END $$;

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read own contacts" ON contacts;
DROP POLICY IF EXISTS "Users can create contacts" ON contacts;
DROP POLICY IF EXISTS "Users can delete own contacts" ON contacts;

-- Drop existing transaction policies
DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
DROP POLICY IF EXISTS "Users can create transactions" ON transactions;

-- Contacts policies
CREATE POLICY "Users can read own contacts"
  ON contacts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create contacts"
  ON contacts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own contacts"
  ON contacts
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Transactions policies
CREATE POLICY "Users can read own transactions"
  ON transactions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create transactions"
  ON transactions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create function to delete old transactions if it doesn't exist
CREATE OR REPLACE FUNCTION delete_old_transactions()
RETURNS TRIGGER AS $$
BEGIN
  DELETE FROM transactions
  WHERE user_id = NEW.user_id
  AND id NOT IN (
    SELECT id
    FROM transactions
    WHERE user_id = NEW.user_id
    ORDER BY created_at DESC
    LIMIT 20
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS maintain_transaction_limit ON transactions;

-- Create trigger to maintain only 20 most recent transactions per user
CREATE TRIGGER maintain_transaction_limit
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION delete_old_transactions();