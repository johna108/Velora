-- Create organizations table
CREATE TABLE IF NOT EXISTS organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add organization_id to startups
ALTER TABLE startups ADD COLUMN IF NOT EXISTS organization_id UUID REFERENCES organizations ON DELETE CASCADE;

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_startups_organization_id ON startups(organization_id);

-- Enable RLS
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS "Users can view own organizations" ON organizations;
CREATE POLICY "Users can view own organizations" ON organizations
  FOR SELECT USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can insert own organizations" ON organizations;
CREATE POLICY "Users can insert own organizations" ON organizations
  FOR INSERT WITH CHECK (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can update own organizations" ON organizations;
CREATE POLICY "Users can update own organizations" ON organizations
  FOR UPDATE USING (auth.uid() = owner_id);

DROP POLICY IF EXISTS "Users can delete own organizations" ON organizations;
CREATE POLICY "Users can delete own organizations" ON organizations
  FOR DELETE USING (auth.uid() = owner_id);

-- Update Startups Policy to allow access if user owns the organization
-- (Optional: keeping existing user_id ownership for now to separate migration concerns)

-- Add priority column to tasks
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium';
