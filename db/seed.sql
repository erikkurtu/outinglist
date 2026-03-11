-- Categories (15 from SPEC taxonomy)
INSERT OR IGNORE INTO categories (id, name, slug, icon, color, sort_order) VALUES
  ('cat-01', 'Music & Concerts', 'music-concerts', '🎵', '#8B5CF6', 1),
  ('cat-02', 'Food & Drink', 'food-drink', '🍕', '#F59E0B', 2),
  ('cat-03', 'Arts & Culture', 'arts-culture', '🎨', '#EC4899', 3),
  ('cat-04', 'Sports & Fitness', 'sports-fitness', '🏃', '#10B981', 4),
  ('cat-05', 'Nightlife & Parties', 'nightlife-parties', '🌙', '#6366F1', 5),
  ('cat-06', 'Family & Kids', 'family-kids', '👨‍👩‍👧', '#F97316', 6),
  ('cat-07', 'Outdoor & Nature', 'outdoor-nature', '🌿', '#22C55E', 7),
  ('cat-08', 'Tech & Innovation', 'tech-innovation', '💻', '#3B82F6', 8),
  ('cat-09', 'Community & Civic', 'community-civic', '🤝', '#14B8A6', 9),
  ('cat-10', 'Workshops & Classes', 'workshops-classes', '📚', '#A855F7', 10),
  ('cat-11', 'Markets & Pop-ups', 'markets-popups', '🛍️', '#F59E0B', 11),
  ('cat-12', 'Comedy & Theater', 'comedy-theater', '🎭', '#EF4444', 12),
  ('cat-13', 'Festivals', 'festivals', '🎪', '#FF6B35', 13),
  ('cat-14', 'Networking & Professional', 'networking-professional', '💼', '#64748B', 14),
  ('cat-15', 'Wellness & Spirituality', 'wellness-spirituality', '✨', '#A855F7', 15);

-- 20 Atlanta Events (March-April 2026)
INSERT OR IGNORE INTO events (id, title, description, source_type, source_url, image_url, start_at, end_at, location_name, location_address, price_min, price_max, is_free, metro, status) VALUES

('evt-01',
 'Spring Jazz at Piedmont Park',
 'Join us for an evening of live jazz under the stars at Piedmont Park. Atlanta''s finest jazz musicians perform original compositions and beloved classics. Bring a blanket, grab a snack from local food vendors, and let the music wash over you.',
 'internal', NULL, NULL,
 '2026-03-14T18:00:00-05:00', '2026-03-14T22:00:00-05:00',
 'Piedmont Park', '400 Park Dr NE, Atlanta, GA 30306',
 0, 0, 1, 'atlanta', 'active'),

('evt-02',
 'Ponce City Market Rooftop Party',
 'The iconic rooftop at Ponce City Market hosts its first outdoor party of the season. DJ sets, craft cocktails, city views that go on forever. 21+ only.',
 'internal', 'https://poncecitymarket.com',
 NULL,
 '2026-03-21T20:00:00-05:00', '2026-03-21T01:00:00-05:00',
 'Ponce City Market', '675 Ponce de Leon Ave NE, Atlanta, GA 30308',
 25, 40, 0, 'atlanta', 'active'),

('evt-03',
 'The Tabernacle: Lake Street Dive',
 'Lake Street Dive brings their soulful blend of pop, rock, and jazz to The Tabernacle. One of Atlanta''s most beloved venues hosts an unforgettable night.',
 'internal', NULL, NULL,
 '2026-03-19T20:00:00-05:00', '2026-03-19T23:30:00-05:00',
 'The Tabernacle', '152 Luckie St NW, Atlanta, GA 30303',
 45, 85, 0, 'atlanta', 'active'),

('evt-04',
 'Atlanta BeltLine Lantern Parade',
 'The beloved annual Lantern Parade returns to the BeltLine! Make your own lantern at a community workshop then join thousands marching through intown Atlanta neighborhoods. A true Atlanta tradition.',
 'internal', NULL, NULL,
 '2026-03-28T19:00:00-05:00', '2026-03-28T22:00:00-05:00',
 'Atlanta BeltLine', 'Old Fourth Ward Park, Atlanta, GA 30307',
 0, 0, 1, 'atlanta', 'active'),

('evt-05',
 'Fox Theatre: Hamilton',
 'The Tony Award-winning musical Hamilton finally returns to the historic Fox Theatre. This is Atlanta''s theater event of the year — don''t wait to get tickets.',
 'internal', NULL, NULL,
 '2026-04-03T19:30:00-05:00', '2026-04-03T22:30:00-05:00',
 'Fox Theatre', '660 Peachtree St NE, Atlanta, GA 30308',
 89, 299, 0, 'atlanta', 'active'),

('evt-06',
 'Grant Park Farmers Market',
 'Atlanta''s original farmers market returns for the spring season! Over 100 local vendors, live music, and the best coffee in the city. Saturday mornings, rain or shine.',
 'internal', NULL, NULL,
 '2026-03-14T8:00:00-05:00', '2026-03-14T13:00:00-05:00',
 'Grant Park', '537 Park Ave SE, Atlanta, GA 30312',
 0, 0, 1, 'atlanta', 'active'),

('evt-07',
 'Atlanta Tech Village: Startup Pitch Night',
 'Watch Atlanta''s most promising startups pitch to a panel of investors. Network with founders, investors, and Atlanta''s tech community afterward. Free to attend.',
 'internal', NULL, NULL,
 '2026-03-18T18:00:00-05:00', '2026-03-18T21:00:00-05:00',
 'Atlanta Tech Village', '3423 Piedmont Rd NE, Atlanta, GA 30305',
 0, 0, 1, 'atlanta', 'active'),

('evt-08',
 'Fernbank Museum: After Dark — Nocturnal Edition',
 'Adults-only night at Fernbank Museum. Explore dinosaur exhibits with a cocktail in hand, live DJ in the atrium, and special late-night planetarium shows.',
 'internal', NULL, NULL,
 '2026-03-20T19:00:00-05:00', '2026-03-20T23:00:00-05:00',
 'Fernbank Museum of Natural History', '767 Clifton Rd, Atlanta, GA 30307',
 20, 30, 0, 'atlanta', 'active'),

('evt-09',
 'Sweet Auburn Music Festival',
 'A celebration of Atlanta''s rich musical history in the neighborhood that gave us so much. Multiple stages, food from local vendors, art installations along Auburn Avenue.',
 'internal', NULL, NULL,
 '2026-04-11T11:00:00-05:00', '2026-04-11T22:00:00-05:00',
 'Auburn Avenue', 'Auburn Ave NE, Atlanta, GA 30303',
 0, 0, 1, 'atlanta', 'active'),

('evt-10',
 'Decatur Wine Festival',
 'Taste wines from over 200 wineries at this beloved annual festival in historic Decatur Square. Education seminars, food pairings, and a beautiful outdoor setting.',
 'internal', NULL, NULL,
 '2026-04-25T12:00:00-05:00', '2026-04-25T18:00:00-05:00',
 'Decatur Square', 'Old Courthouse Square, Decatur, GA 30030',
 65, 95, 0, 'atlanta', 'active'),

('evt-11',
 'High Museum: Art After Dark',
 'The High Museum opens its doors for an adults-only evening of art, cocktails, and live music. Special access to the current blockbuster exhibition with no crowds.',
 'internal', NULL, NULL,
 '2026-03-27T19:00:00-05:00', '2026-03-27T22:00:00-05:00',
 'High Museum of Art', '1280 Peachtree St NE, Atlanta, GA 30309',
 25, 35, 0, 'atlanta', 'active'),

('evt-12',
 'East Atlanta Village Strut',
 'The neighborhood''s annual street festival is back! Live music on multiple stages, local art vendors, food from EAV restaurants, and the community spirit that makes Atlanta great.',
 'internal', NULL, NULL,
 '2026-04-18T13:00:00-05:00', '2026-04-18T21:00:00-05:00',
 'East Atlanta Village', 'Flat Shoals Ave SE, Atlanta, GA 30316',
 0, 0, 1, 'atlanta', 'active'),

('evt-13',
 'Yoga on the BeltLine',
 'Start your Saturday morning right with free community yoga along the BeltLine Eastside Trail. All levels welcome. Bring your mat and your neighbors.',
 'internal', NULL, NULL,
 '2026-03-15T9:00:00-05:00', '2026-03-15T10:30:00-05:00',
 'BeltLine Eastside Trail', 'Ponce City Market Access, Atlanta, GA 30309',
 0, 0, 1, 'atlanta', 'active'),

('evt-14',
 'Krog Street Market Comedy Night',
 'Four of Atlanta''s sharpest comedians perform in the intimate setting of Krog Street Market. BYOB encouraged. Tickets go fast for this monthly sellout.',
 'internal', NULL, NULL,
 '2026-03-22T20:00:00-05:00', '2026-03-22T22:30:00-05:00',
 'Krog Street Market', '99 Krog St NE, Atlanta, GA 30307',
 15, 20, 0, 'atlanta', 'active'),

('evt-15',
 'West End: Community Mural Reveal',
 'The West End neighborhood unveils its newest community mural, created by local artist Kezia Brown. Celebration includes live music, food from nearby restaurants, and remarks from the artists.',
 'internal', NULL, NULL,
 '2026-03-29T15:00:00-05:00', '2026-03-29T18:00:00-05:00',
 'West End', 'Lee St SW & Ralph David Abernathy, Atlanta, GA 30310',
 0, 0, 1, 'atlanta', 'active'),

('evt-16',
 'Chattahoochee Food Works: Spring Pop-Up Market',
 'Artisan makers, local food producers, and craft vendors fill Chattahoochee Food Works for a day-long pop-up. Find your new favorite hot sauce, ceramics, or candle maker.',
 'internal', NULL, NULL,
 '2026-04-05T10:00:00-05:00', '2026-04-05T16:00:00-05:00',
 'Chattahoochee Food Works', '1235 Chattahoochee Ave NW, Atlanta, GA 30318',
 0, 0, 1, 'atlanta', 'active'),

('evt-17',
 'Variety Playhouse: Mavis Staples',
 'Living legend Mavis Staples brings her gospel-soul powerhouse to Little Five Points. This is a career-defining performance from one of America''s greatest voices.',
 'internal', NULL, NULL,
 '2026-04-08T20:00:00-05:00', '2026-04-08T23:00:00-05:00',
 'Variety Playhouse', '1099 Euclid Ave NE, Atlanta, GA 30307',
 55, 85, 0, 'atlanta', 'active'),

('evt-18',
 'Atlanta Botanical Garden: Orchid Daze',
 'The most spectacular orchid exhibition in the Southeast returns to the Atlanta Botanical Garden. Over 10,000 orchids in bloom, special programming for plant enthusiasts.',
 'internal', NULL, NULL,
 '2026-04-12T10:00:00-05:00', '2026-04-12T17:00:00-05:00',
 'Atlanta Botanical Garden', '1345 Piedmont Ave NE, Atlanta, GA 30309',
 24, 24, 0, 'atlanta', 'active'),

('evt-19',
 'Inman Park Festival & Tour of Homes',
 'Atlanta''s oldest neighborhood festival fills the streets with art, music, and the famous Inman Park parade. Don''t miss the Tour of Homes for a peek inside Victorian gems.',
 'internal', NULL, NULL,
 '2026-04-25T10:00:00-05:00', '2026-04-25T18:00:00-05:00',
 'Inman Park', 'Euclid Ave NE, Atlanta, GA 30307',
 0, 0, 1, 'atlanta', 'active'),

('evt-20',
 'Souls Grown Deep: Vernacular Art Workshop',
 'A hands-on workshop inspired by Atlanta''s Souls Grown Deep Foundation. Learn traditional quilting techniques from master craftspeople. Materials provided. Space limited.',
 'internal', NULL, NULL,
 '2026-04-02T14:00:00-05:00', '2026-04-02T17:00:00-05:00',
 'Hammonds House Museum', '503 Peeples St SW, Atlanta, GA 30310',
 15, 15, 0, 'atlanta', 'active');

-- Event-Category relationships
INSERT OR IGNORE INTO event_categories (event_id, category_id) VALUES
  ('evt-01', 'cat-01'), ('evt-01', 'cat-07'),  -- Jazz: Music + Outdoor
  ('evt-02', 'cat-05'), ('evt-02', 'cat-02'),  -- Rooftop: Nightlife + Food
  ('evt-03', 'cat-01'),                          -- Tabernacle: Music
  ('evt-04', 'cat-09'), ('evt-04', 'cat-07'),  -- BeltLine: Community + Outdoor
  ('evt-05', 'cat-12'),                          -- Hamilton: Theater
  ('evt-06', 'cat-11'), ('evt-06', 'cat-02'),  -- Farmers Market: Markets + Food
  ('evt-07', 'cat-08'), ('evt-07', 'cat-14'),  -- Tech: Tech + Networking
  ('evt-08', 'cat-03'), ('evt-08', 'cat-05'),  -- Fernbank: Arts + Nightlife
  ('evt-09', 'cat-01'), ('evt-09', 'cat-13'),  -- Sweet Auburn: Music + Festival
  ('evt-10', 'cat-02'), ('evt-10', 'cat-13'),  -- Wine: Food + Festival
  ('evt-11', 'cat-03'), ('evt-11', 'cat-05'),  -- High Museum: Arts + Nightlife
  ('evt-12', 'cat-13'), ('evt-12', 'cat-09'),  -- EAV Strut: Festival + Community
  ('evt-13', 'cat-04'), ('evt-13', 'cat-15'),  -- Yoga: Sports + Wellness
  ('evt-14', 'cat-12'),                          -- Comedy: Theater
  ('evt-15', 'cat-09'), ('evt-15', 'cat-03'),  -- Mural: Community + Arts
  ('evt-16', 'cat-11'), ('evt-16', 'cat-02'),  -- Pop-up: Markets + Food
  ('evt-17', 'cat-01'),                          -- Mavis Staples: Music
  ('evt-18', 'cat-03'), ('evt-18', 'cat-07'),  -- Botanical: Arts + Outdoor
  ('evt-19', 'cat-13'), ('evt-19', 'cat-09'),  -- Inman Park: Festival + Community
  ('evt-20', 'cat-03'), ('evt-20', 'cat-10');  -- Workshop: Arts + Workshop
