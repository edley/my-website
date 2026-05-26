-- Run this SQL in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql/new)
-- Replace _ with your project ID.

-- Create contacts table for the contact form
CREATE TABLE IF NOT EXISTS contacts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    read BOOLEAN NOT NULL DEFAULT FALSE
);

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (so the website contact form can submit)
CREATE POLICY "Allow anonymous insert contacts"
    ON contacts
    FOR INSERT
    TO anon
    WITH CHECK (true);

-- Only authenticated users can view contacts
CREATE POLICY "Allow authenticated select contacts"
    ON contacts
    FOR SELECT
    TO authenticated
    USING (true);

-- Only authenticated users can update contacts (e.g., mark as read)
CREATE POLICY "Allow authenticated update contacts"
    ON contacts
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);