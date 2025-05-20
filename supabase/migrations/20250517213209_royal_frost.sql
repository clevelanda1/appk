/*
  # Update Apple Pay Prank Database Schema

  1. Tables
    - Safely creates or updates `contacts` and `transactions` tables
    - Adds proper indexes and constraints
  
  2. Security
    - Enables RLS on all tables
    - Adds policies for user data access
  
  3. Triggers
    - Adds trigger to maintain transaction history limit
*/

-- Safely create or update contacts table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'contacts') THEN
    CREATE TABLE contacts (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL,
      name text NOT NULL,
      created_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Safely create or update transactions table
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE tablename = 'transactions') THEN
    CREATE TABLE transactions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users NOT NULL,
      contact_name text NOT NULL,
      amount decimal(10,2) NOT NULL,
      status text DEFAULT 'Received',
      created_at timestamptz DEFAULT now(),
      is_phone_number boolean DEFAULT false,
      is_merchant boolean DEFAULT false
    );
  END IF;
END $$;

-- Safely create index on transactions timestamp
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE indexname = 'idx_transactions_timestamp'
  ) THEN
    CREATE INDEX idx_transactions_timestamp ON transactions(created_at DESC);
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN 
  -- Contacts policies
  DROP POLICY IF EXISTS "Users can read own contacts" ON contacts;
  DROP POLICY IF EXISTS "Users can create contacts" ON contacts;
  DROP POLICY IF EXISTS "Users can delete own contacts" ON contacts;
  
  -- Transactions policies
  DROP POLICY IF EXISTS "Users can read own transactions" ON transactions;
  DROP POLICY IF EXISTS "Users can create transactions" ON transactions;
END $$;

-- Create new policies
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

-- Create or replace function to delete old transactions
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

-- Drop existing trigger if it exists and create new one
DROP TRIGGER IF EXISTS maintain_transaction_limit ON transactions;
CREATE TRIGGER maintain_transaction_limit
AFTER INSERT ON transactions
FOR EACH ROW
EXECUTE FUNCTION delete_old_transactions();