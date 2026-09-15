-- =========================================================
-- KadamFind Seed Data (Initial Interests & Destinations)
-- =========================================================

-- Seed 20 Normalized Interests
INSERT INTO public.interests (name, category, icon) VALUES
  ('hiking', 'outdoor', '🥾'),
  ('trekking', 'outdoor', '🏔️'),
  ('beaches', 'leisure', '🏖️'),
  ('food', 'culture', '🍱'),
  ('photography', 'arts', '📸'),
  ('nightlife', 'entertainment', '🍸'),
  ('culture', 'culture', '🏛️'),
  ('history', 'culture', '📜'),
  ('shopping', 'leisure', '🛍️'),
  ('adventure', 'outdoor', '🪂'),
  ('nature', 'outdoor', '🌿'),
  ('camping', 'outdoor', '⛺'),
  ('road trips', 'travel', '🚗'),
  ('luxury travel', 'lifestyle', '💎'),
  ('backpacking', 'travel', '🎒'),
  ('wellness', 'lifestyle', '🧘'),
  ('skiing', 'sports', '⛷️'),
  ('scuba diving', 'sports', '🏓'),
  ('wildlife', 'nature', '🦁'),
  ('festivals', 'culture', '🎉')
ON CONFLICT (name) DO NOTHING;

-- Seed Popular Destinations
INSERT INTO public.destinations (destination_name, country, image_url, description) VALUES
  ('Bali', 'Indonesia', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4', 'Tropical paradise with lush rice terraces, beaches, and rich spiritual culture.'),
  ('Santorini', 'Greece', 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff', 'Whitewashed houses overlooking the Aegean Sea with iconic blue domes and sunsets.'),
  ('Tokyo', 'Japan', 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26', 'Futuristic metropolis blending neon skyscrapers with ancient temples and culinary mastery.'),
  ('Swiss Alps', 'Switzerland', 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99', 'Majestic mountain peaks, alpine hiking trails, and cozy mountain chalets.'),
  ('Kyoto', 'Japan', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e', 'Cultural heart of Japan filled with traditional wooden houses and bamboo groves.'),
  ('Paris', 'France', 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', 'City of Light, world-renowned art galleries, café culture, and iconic landmarks.'),
  ('Cairo', 'Egypt', 'https://images.unsplash.com/photo-1572252821143-03541c484f47', 'Gateway to the Great Pyramids, Sphinx, and ancient Nile civilization.'),
  ('Reykjavik', 'Iceland', 'https://images.unsplash.com/photo-1504893524553-b855bce32c67', 'Land of fire and ice, geothermal hot springs, waterfalls, and Northern Lights.')
ON CONFLICT (destination_name, country) DO NOTHING;
