-- ============================================
-- Velora - Complete Supabase Schema
-- Run this entire file in Supabase SQL Editor
-- ============================================

-- ============================================
-- STEP 1: DROP EXISTING OBJECTS (Clean Slate)
-- ============================================
-- Drop tables (CASCADE will remove policies, indexes, triggers)
DROP TABLE IF EXISTS feedback CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS team_members CASCADE;
DROP TABLE IF EXISTS startups CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop trigger and function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- ============================================
-- STEP 2: CREATE TABLES
-- ============================================

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Startups table
CREATE TABLE startups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  industry TEXT,
  target_market TEXT,
  business_model TEXT,
  stage TEXT CHECK (stage IN ('Idea', 'MVP', 'Pre-Seed', 'Seed')),
  problem TEXT,
  solution TEXT,
  roadmap TEXT,
  traction TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Team members table
CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES startups ON DELETE CASCADE,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('Founder', 'Team Member')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES startups ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT CHECK (status IN ('Todo', 'In Progress', 'Done')) DEFAULT 'Todo',
  assignee_id UUID REFERENCES team_members ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Feedback table
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  startup_id UUID NOT NULL REFERENCES startups ON DELETE CASCADE,
  type TEXT CHECK (type IN ('Internal', 'External')),
  content TEXT NOT NULL,
  from_name TEXT NOT NULL,
  metric INTEGER CHECK (metric >= 1 AND metric <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- STEP 3: CREATE INDEXES FOR PERFORMANCE
-- ============================================
CREATE INDEX idx_startups_user_id ON startups(user_id);
CREATE INDEX idx_startups_is_public ON startups(is_public) WHERE is_public = true;
CREATE INDEX idx_team_members_startup_id ON team_members(startup_id);
CREATE INDEX idx_tasks_startup_id ON tasks(startup_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_feedback_startup_id ON feedback(startup_id);

-- ============================================
-- STEP 4: ENABLE ROW LEVEL SECURITY
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE startups ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- ============================================
-- STEP 5: CREATE RLS POLICIES
-- ============================================

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Startups policies
CREATE POLICY "Users can view own startups" ON startups
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create startups" ON startups
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own startups" ON startups
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own startups" ON startups
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Public startups visible to all" ON startups
  FOR SELECT USING (is_public = true);

-- Team members policies
CREATE POLICY "Users can manage own startup team" ON team_members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM startups
      WHERE startups.id = team_members.startup_id
      AND startups.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members visible for public startups" ON team_members
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM startups
      WHERE startups.id = team_members.startup_id
      AND startups.is_public = true
    )
  );

-- Tasks policies
CREATE POLICY "Users can manage own startup tasks" ON tasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM startups
      WHERE startups.id = tasks.startup_id
      AND startups.user_id = auth.uid()
    )
  );

-- Feedback policies
CREATE POLICY "Users can manage own startup feedback" ON feedback
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM startups
      WHERE startups.id = feedback.startup_id
      AND startups.user_id = auth.uid()
    )
  );

-- ============================================
-- STEP 6: CREATE TRIGGER FOR NEW USER SIGNUP
-- ============================================
-- This automatically creates a profile when a user signs up

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- STEP 7: GRANT PERMISSIONS
-- ============================================
-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- Grant table permissions
GRANT SELECT ON profiles TO anon, authenticated;
GRANT INSERT, UPDATE ON profiles TO authenticated;

GRANT SELECT ON startups TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON startups TO authenticated;

GRANT SELECT ON team_members TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON team_members TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON tasks TO authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON feedback TO authenticated;

-- ============================================
-- DONE! Your Supabase database is ready.
-- ============================================
