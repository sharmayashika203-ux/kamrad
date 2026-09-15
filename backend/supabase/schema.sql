-- =========================================================
-- KadamFind Complete Database Schema (Supabase / PostgreSQL)
-- =========================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- 1. USERS / PROFILES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  date_of_birth DATE,
  age INTEGER CHECK (age IS NULL OR (age >= 18 AND age <= 120)),
  gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female')),
  profile_photo TEXT,
  bio TEXT,
  country TEXT,
  city TEXT,
  verification_status TEXT DEFAULT 'unverified' CHECK (verification_status IN ('unverified', 'pending', 'verified', 'rejected')),
  account_status TEXT DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'banned')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Public profile view excluding sensitive email & phone
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT 
  id,
  full_name,
  gender,
  date_of_birth,
  age,
  profile_photo,
  bio,
  country,
  city,
  verification_status,
  account_status,
  created_at
FROM public.profiles
WHERE account_status = 'active';

-- =========================================================
-- 2. TRAVEL PREFERENCES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.travel_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferred_destinations TEXT[] DEFAULT '{}'::TEXT[],
  travel_dates TEXT,
  flexible_dates BOOLEAN DEFAULT TRUE NOT NULL,
  travel_style TEXT DEFAULT 'balanced' CHECK (travel_style IN ('budget', 'luxury', 'backpacking', 'solo', 'adventure', 'balanced', 'cultural')),
  budget_level TEXT DEFAULT 'moderate' CHECK (budget_level IN ('budget', 'moderate', 'luxury', 'flexible')),
  accommodation_preference TEXT DEFAULT 'hotel' CHECK (accommodation_preference IN ('hostel', 'hotel', 'resort', 'homestay', 'camping', 'any')),
  transport_preference TEXT DEFAULT 'any' CHECK (transport_preference IN ('flight', 'train', 'car', 'bus', 'any')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================
-- 3. INTERESTS TABLE (Normalized Structure)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.interests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  category TEXT DEFAULT 'general',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================
-- 4. USER INTERESTS (Junction Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_interests (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  interest_id UUID NOT NULL REFERENCES public.interests(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, interest_id)
);

-- =========================================================
-- 5. DESTINATIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.destinations (
  destination_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination_name TEXT NOT NULL,
  country TEXT NOT NULL,
  image_url TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT unique_destination_country UNIQUE (destination_name, country)
);

-- =========================================================
-- 6. USER DESTINATIONS (Junction Table)
-- =========================================================
CREATE TABLE IF NOT EXISTS public.user_destinations (
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  destination_id UUID NOT NULL REFERENCES public.destinations(destination_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  PRIMARY KEY (user_id, destination_id)
);

-- =========================================================
-- 7. LIKES / INTERESTS SENT TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sender_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'ignored')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT check_no_self_like CHECK (sender_user_id <> receiver_user_id),
  CONSTRAINT unique_like_pair UNIQUE (sender_user_id, receiver_user_id)
);

-- =========================================================
-- 8. MATCHES TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_one_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  user_two_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  compatibility_score INTEGER DEFAULT 80 CHECK (compatibility_score >= 0 AND compatibility_score <= 100),
  matched_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unmatched', 'blocked')),
  CONSTRAINT check_no_self_match CHECK (user_one_id <> user_two_id)
);

-- Unique index ensuring user_A + user_B match pair is unique regardless of order
CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_match_pair 
ON public.matches (LEAST(user_one_id, user_two_id), GREATEST(user_one_id, user_two_id));

-- =========================================================
-- 9. SUBSCRIPTIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id TEXT NOT NULL CHECK (plan_id IN ('free', 'explorer_pass', 'pro', 'kamrad_pro', 'vip', 'globetrotter_vip')),
  payment_status TEXT DEFAULT 'active' CHECK (payment_status IN ('active', 'cancelled', 'expired', 'pending', 'failed')),
  start_date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  expiry_date TIMESTAMPTZ,
  provider TEXT DEFAULT 'razorpay',
  provider_payment_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================
-- 10. REPORTS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reported_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT check_no_self_report CHECK (reporter_id <> reported_id)
);

-- =========================================================
-- 11. BLOCKS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blocker_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  CONSTRAINT check_no_self_block CHECK (blocker_id <> blocked_id),
  CONSTRAINT unique_block_pair UNIQUE (blocker_id, blocked_id)
);

-- =========================================================
-- 12. NOTIFICATIONS TABLE
-- =========================================================
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('like', 'match', 'message', 'subscription', 'system', 'verification')),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- =========================================================
-- INDEXES FOR FREQUENTLY SEARCHED FIELDS
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_verification_status ON public.profiles(verification_status);
CREATE INDEX IF NOT EXISTS idx_profiles_country_city ON public.profiles(country, city);
CREATE INDEX IF NOT EXISTS idx_travel_preferences_user ON public.travel_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_user ON public.user_interests(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interests_interest ON public.user_interests(interest_id);
CREATE INDEX IF NOT EXISTS idx_user_destinations_user ON public.user_destinations(user_id);
CREATE INDEX IF NOT EXISTS idx_user_destinations_dest ON public.user_destinations(destination_id);
CREATE INDEX IF NOT EXISTS idx_likes_sender ON public.likes(sender_user_id);
CREATE INDEX IF NOT EXISTS idx_likes_receiver ON public.likes(receiver_user_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_one ON public.matches(user_one_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_two ON public.matches(user_two_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_reports_reporter ON public.reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_reports_reported ON public.reports(reported_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocker ON public.blocks(blocker_id);
CREATE INDEX IF NOT EXISTS idx_blocks_blocked ON public.blocks(blocked_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

-- =========================================================
-- TRIGGERS & FUNCTIONS
-- =========================================================

-- Function to handle timestamp updating
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_travel_preferences_updated_at
  BEFORE UPDATE ON public.travel_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to handle automatic profile creation upon Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    full_name, 
    profile_photo, 
    gender, 
    bio, 
    country, 
    city,
    verification_status,
    account_status
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'profile_photo', NEW.raw_user_meta_data->>'avatar_url', NULL),
    COALESCE(NEW.raw_user_meta_data->>'gender', 'female'),
    COALESCE(NEW.raw_user_meta_data->>'bio', 'Passionate solo traveler looking for verified travel buddies.'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'Global'),
    COALESCE(NEW.raw_user_meta_data->>'city', 'Remote'),
    'verified',
    'active'
  )
  ON CONFLICT (id) DO NOTHING;
  
  -- Create initial travel preferences record
  INSERT INTO public.travel_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default free subscription
  INSERT INTO public.subscriptions (user_id, plan_id, payment_status)
  VALUES (NEW.id, 'free', 'active')
  ON CONFLICT DO NOTHING;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger firing on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for auto-matching when a reciprocal like occurs
CREATE OR REPLACE FUNCTION public.handle_reciprocal_like()
RETURNS TRIGGER AS $$
DECLARE
  reciprocal_exists BOOLEAN;
BEGIN
  -- Check if reciprocal like exists
  SELECT EXISTS (
    SELECT 1 FROM public.likes 
    WHERE sender_user_id = NEW.receiver_user_id 
      AND receiver_user_id = NEW.sender_user_id
  ) INTO reciprocal_exists;

  IF reciprocal_exists THEN
    -- Update both likes to accepted
    UPDATE public.likes 
    SET status = 'accepted' 
    WHERE (sender_user_id = NEW.sender_user_id AND receiver_user_id = NEW.receiver_user_id)
       OR (sender_user_id = NEW.receiver_user_id AND receiver_user_id = NEW.sender_user_id);

    -- Insert match record automatically
    INSERT INTO public.matches (user_one_id, user_two_id, compatibility_score, status)
    VALUES (
      LEAST(NEW.sender_user_id, NEW.receiver_user_id),
      GREATEST(NEW.sender_user_id, NEW.receiver_user_id),
      85,
      'active'
    )
    ON CONFLICT DO NOTHING;

    -- Send notifications to both users
    INSERT INTO public.notifications (user_id, sender_id, type, title, content)
    VALUES 
      (NEW.sender_user_id, NEW.receiver_user_id, 'match', 'It''s a Match! 🎉', 'You have matched with a companion! Start chatting now.'),
      (NEW.receiver_user_id, NEW.sender_user_id, 'match', 'It''s a Match! 🎉', 'You have matched with a companion! Start chatting now.');
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_like_created ON public.likes;
CREATE TRIGGER on_like_created
  AFTER INSERT ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_reciprocal_like();

-- =========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.travel_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_destinations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by authenticated users" 
ON public.profiles FOR SELECT TO authenticated 
USING (account_status = 'active');

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE TO authenticated 
USING (auth.uid() = id);

-- 2. TRAVEL PREFERENCES POLICIES
CREATE POLICY "Travel preferences viewable by authenticated users" 
ON public.travel_preferences FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Users can insert their own travel preferences" 
ON public.travel_preferences FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own travel preferences" 
ON public.travel_preferences FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

-- 3. INTERESTS POLICIES
CREATE POLICY "Interests viewable by everyone" 
ON public.interests FOR SELECT TO anon, authenticated 
USING (true);

-- 4. USER INTERESTS POLICIES
CREATE POLICY "User interests viewable by authenticated users" 
ON public.user_interests FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Users can insert their own user_interests" 
ON public.user_interests FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own user_interests" 
ON public.user_interests FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- 5. DESTINATIONS POLICIES
CREATE POLICY "Destinations viewable by everyone" 
ON public.destinations FOR SELECT TO anon, authenticated 
USING (true);

-- 6. USER DESTINATIONS POLICIES
CREATE POLICY "User destinations viewable by authenticated users" 
ON public.user_destinations FOR SELECT TO authenticated 
USING (true);

CREATE POLICY "Users can insert their own user_destinations" 
ON public.user_destinations FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own user_destinations" 
ON public.user_destinations FOR DELETE TO authenticated 
USING (auth.uid() = user_id);

-- 7. LIKES POLICIES
CREATE POLICY "Users can view likes sent or received by them" 
ON public.likes FOR SELECT TO authenticated 
USING (auth.uid() = sender_user_id OR auth.uid() = receiver_user_id);

CREATE POLICY "Users can create likes as sender" 
ON public.likes FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = sender_user_id);

CREATE POLICY "Users can update likes sent or received by them" 
ON public.likes FOR UPDATE TO authenticated 
USING (auth.uid() = sender_user_id OR auth.uid() = receiver_user_id);

CREATE POLICY "Users can delete likes sent by them" 
ON public.likes FOR DELETE TO authenticated 
USING (auth.uid() = sender_user_id);

-- 8. MATCHES POLICIES
CREATE POLICY "Users can view their own matches" 
ON public.matches FOR SELECT TO authenticated 
USING (auth.uid() = user_one_id OR auth.uid() = user_two_id);

CREATE POLICY "Users can create match if part of it" 
ON public.matches FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_one_id OR auth.uid() = user_two_id);

CREATE POLICY "Users can update their own matches" 
ON public.matches FOR UPDATE TO authenticated 
USING (auth.uid() = user_one_id OR auth.uid() = user_two_id);

-- 9. SUBSCRIPTIONS POLICIES
CREATE POLICY "Users can view their own subscriptions" 
ON public.subscriptions FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own subscriptions" 
ON public.subscriptions FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own subscriptions" 
ON public.subscriptions FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

-- 10. REPORTS POLICIES
CREATE POLICY "Users can view reports created by them" 
ON public.reports FOR SELECT TO authenticated 
USING (auth.uid() = reporter_id);

CREATE POLICY "Users can create reports" 
ON public.reports FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = reporter_id);

-- 11. BLOCKS POLICIES
CREATE POLICY "Users can view their own blocked list" 
ON public.blocks FOR SELECT TO authenticated 
USING (auth.uid() = blocker_id);

CREATE POLICY "Users can block other users" 
ON public.blocks FOR INSERT TO authenticated 
WITH CHECK (auth.uid() = blocker_id);

CREATE POLICY "Users can unblock users" 
ON public.blocks FOR DELETE TO authenticated 
USING (auth.uid() = blocker_id);

-- 12. NOTIFICATIONS POLICIES
CREATE POLICY "Users can view their notifications" 
ON public.notifications FOR SELECT TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" 
ON public.notifications FOR UPDATE TO authenticated 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their notifications" 
ON public.notifications FOR DELETE TO authenticated 
USING (auth.uid() = user_id);
