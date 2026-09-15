# KadamFind Backend Architecture & Database Documentation

This folder contains the complete backend infrastructure for **KadamFind**, powered by Supabase (PostgreSQL + Auth + Edge Functions) and Razorpay payment integrations.

---

## 🗄️ Database Structure

The database consists of **12 PostgreSQL tables** with strict Row-Level Security (RLS) policies, indexes, and triggers:

1. **`profiles`**: Master user profile details (Name, DOB, Gender, Avatar, Completion Meter).
2. **`public_profiles`**: Security view exposing non-sensitive companion fields to public discovery.
3. **`travel_preferences`**: Destination, dates, budget, travel style, accommodation, transport preferences.
4. **`interests`**: Master dictionary of normalized travel activities (Hiking, Photography, Foodie, etc.).
5. **`user_interests`**: Junction table for user multi-select interest tags.
6. **`destinations`**: Master lookup of travel destinations.
7. **`user_preferred_destinations`**: Secondary preferred destination list.
8. **`likes` (Connections)**: Travel connection invites and interest status (`pending`, `accepted`, `rejected`).
9. **`matches`**: Mutual travel match records with pair-uniqueness index `idx_unique_match_pair` on `LEAST(user_one_id, user_two_id), GREATEST(user_one_id, user_two_id)`.
10. **`notifications`**: In-app user notification drawer records.
11. **`subscriptions`**: Membership records (`free`, `kamrad_pro`, `globetrotter_vip`) with payment verification state and expiry date.
12. **`blocks` & `reports`**: Safety tables enforcing block exclusions and reporting.

---

## 🚀 Setup & Migration Guide

### 1. Apply Database Schema
Execute `supabase/schema.sql` in your Supabase SQL Editor to construct all 12 tables, indexes, views, and RLS policies.

### 2. Seed Master Lookup Tables
Execute `supabase/seed.sql` to populate master interest tags, global travel destinations, and sample verified companion profiles.

### 3. Deploy Edge Functions
Deploy the server-side payment verification and Razorpay webhook handlers:
```bash
npm run functions:deploy
```
