/*
  # Create contacts table for storing user contacts

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on contacts table
    - Add policies for authenticated users to:
      - Read their own contacts
      - Create new contacts
      - Delete their own contacts
*/

CREATE TABLE IF NOT EXISTS contacts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policies
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