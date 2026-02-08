# Database Setup Instructions

## Step 1: Create the Database Schema

1. Go to your **Supabase Dashboard → SQL Editor**
2. Create a new query
3. Copy the entire contents of `supabase/schema.sql`
4. Paste it into the SQL Editor
5. Click **Run**

This creates:
- `profiles` — user profiles
- `startups` — startup information
- `team_members` — team member entries
- `tasks` — task/todo items
- `feedback` — feedback entries

All tables have Row Level Security (RLS) enabled so users can only access their own data.

## Step 2: Create Auth Trigger (Optional but Recommended)

Copy and run this in SQL Editor to auto-create a profile row when a user signs up:

```sql
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
```

This ensures every user automatically gets a profile row.

## Step 3: Seed Sample Data (Optional)

To add sample startup data for testing, run:

```sql
INSERT INTO startups (user_id, name, description, industry, target_market, business_model, stage, problem, solution, roadmap, traction, is_public)
VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'InnovateAI',
  'A unified digital platform for early-stage startup operations',
  'Artificial Intelligence',
  'SaaS companies',
  'B2B Subscription',
  'MVP',
  'Early-stage startups struggle with poor execution and unstructured planning',
  'InnovateAI provides a unified workspace for founders to manage execution',
  'Q1: Launch public beta, Q2: Integrate GitHub and Slack',
  'In MVP stage with 2 beta users',
  true
);
```

After running the schema, the app will automatically query real data from these tables.
