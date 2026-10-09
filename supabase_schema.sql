-- ============================================================
-- PATLIPUTRA GROUP - SUPABASE DATABASE INITIALIZATION SCRIPT
-- Copy and paste this complete script into your Supabase Dashboard
-- under: SQL Editor -> New Query -> Run
-- ============================================================

-- 1. ADMIN USERS TABLE
CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  role TEXT DEFAULT 'superadmin',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Seed default admin account
INSERT INTO public.admin_users (email, role)
VALUES ('admin@patliputragroup.com', 'superadmin')
ON CONFLICT (email) DO NOTHING;


-- 2. NEWS & MEDIA COVERAGE TABLE
CREATE TABLE IF NOT EXISTS public.news (
  id TEXT PRIMARY KEY,
  category TEXT DEFAULT 'clipping',
  source TEXT DEFAULT 'PRESS RELEASE',
  date TEXT DEFAULT 'RECENT COVERAGE',
  headline TEXT NOT NULL,
  english_title TEXT,
  excerpt TEXT,
  image TEXT,
  tag TEXT DEFAULT 'NEWSPAPER CLIPPING',
  is_clipping BOOLEAN DEFAULT true,
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed existing news data
INSERT INTO public.news (id, category, source, date, headline, english_title, excerpt, image, tag, is_clipping, highlights)
VALUES 
(
  'news-signature-park-1',
  'clipping',
  'NATIONAL PRESS & DAINIK JAGRAN',
  'RECENT COVERAGE',
  'पाटलिपुत्र सिग्नेचर पार्क का भव्य शुभारंभ, दिल्ली के सांसद मनोज तिवारी ने भी बुक कराया अपना फ्लैट',
  'Delhi MP Manoj Tiwari Inaugurates Patliputra Signature Park',
  'दिल्ली के माननीय सांसद श्री मनोज तिवारी ने ग्रेटर नोएडा के प्रतिष्ठित क्षेत्र Chi V में पाटलिपुत्र सिग्नेचर पार्क का भव्य उद्घाटन किया। उन्होंने खुलासा किया कि पटना में भी उनका घर इसी बिल्डर ने बनाया है और इस नए प्रोजेक्ट में भी अपना स्टूडियो अपार्टमेंट बुक कराया। प्रबंध निदेशक श्री अनिल कुमार ने 2026 तक पजेशन का संकल्प व्यक्त किया।',
  '/img/news/delivered_news1.webp',
  'NEWSPAPER CLIPPING',
  true,
  '["उद्घाटन: सांसद मनोज तिवारी", "लोकेशन: Chi V, ग्रेटर नोएडा", "12% अश्योर्ड रिटर्न ऑफर", "पजेशन संकल्प: 2026"]'::jsonb
),
(
  'news-signature-park-2',
  'clipping',
  'REGIONAL HINDI MEDIA',
  'EXPANSION EDITION',
  '50 लाख स्क्वायर फीट डिलीवरी का विश्वास: ग्रेटर नोएडा में पाटलिपुत्र सिग्नेचर पार्क',
  'Proven Track Record: 50 Lakh+ Sq. Ft. Successfully Delivered Nationwide',
  'प्रबंध निदेशक श्री अनिल कुमार ने सभी आगंतुकों का आभार व्यक्त करते हुए कहा कि पाटलिपुत्र ग्रुप ने विभिन्न शहरों में 50 लाख वर्ग फीट से अधिक कमर्शियल और रेजिडेंशियल प्रोजेक्ट्स डिलीवर किए हैं। सभी खरीदारों को 5 लाख रुपये तक का इनॉग्रल डिस्काउंट और 12% तक का अश्योर्ड रिटर्न पजेशन तक दिया जाएगा।',
  '/img/news/delivered_news2.webp',
  'NEWSPAPER CLIPPING',
  true,
  '["50L+ Sq. Ft. Delivered", "₹5 लाख इनॉग्रल डिस्काउंट", "अपकमिंग फिल्म सिटी के निकट", "अत्याधुनिक सुविधाएं"]'::jsonb
),
(
  'news-signature-park-3',
  'clipping',
  'AMAR UJALA & CITY DESK',
  'NCR LAUNCH',
  'फिल्म सिटी के नजदीक विश्वस्तरीय सुविधाओं से युक्त नया मील का पत्थर',
  'Strategic Chi V Location Near Upcoming Film City with World-Class Living',
  'अत्याधुनिक सुविधाओं, प्राइम लोकेशन और बेहतरीन कनेक्टिविटी के कारण निवेशकों और होम बायर्स के लिए यह एक आकर्षक अवसर प्रस्तुत करता है। ग्रेटर नोएडा के रियल एस्टेट सेक्टर में यह प्रोजेक्ट एक नया मील का पत्थर साबित होगा, जहां गुणवत्ता और विश्वसनीयता का नया परिचय मिला है।',
  '/img/news/delivered_news4.webp',
  'NEWSPAPER CLIPPING',
  true,
  '["फिल्म सिटी के नजदीक", "निवेशकों में भारी उत्साह", "Chi V प्राइम लोकेशन", "विश्वस्तरीय सुविधाएं"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- 3. DELIVERED PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.delivered_projects (
  id TEXT PRIMARY KEY,
  order_index INTEGER DEFAULT 0,
  name TEXT NOT NULL,
  location TEXT DEFAULT 'Patna',
  image TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed delivered projects
INSERT INTO public.delivered_projects (id, order_index, name, location, image, description)
VALUES
('delivered-1791395144822', 1, 'Lalita Apartment', 'Patna', '/img/delivered/lalita.webp', 'This premium residential project offers spacious 2 & 3 BHK apartments with modern layouts, quality finishes, and lifestyle amenities, ensuring comfort and convenience in a prime Patna location.'),
('delivered-1791395225820', 2, 'Maharaja Kameshwar Complex', 'Patna', '/img/delivered/maharaja.webp', 'Located in the bustling Fraser Road area of Patna, this landmark development features a single tower rising across 6 floors, thoughtfully designed to accommodate 228 modern units.'),
('delivered-1791395280376', 3, 'Patligram', 'Patna', '/img/delivered/patligram.webp', 'Situated in Kumhrar, Patna, this ready-to-move residential project presents thoughtfully designed 3 BHK flats, each around 1,204 sq ft, priced at approximately ₹70 lakh, offering comfort and modern living.'),
('delivered-1791395770774', 4, 'Jyotipuram', 'Patna', '/img/delivered/jyotipuram.webp', 'Located in Rukanpura, Patna, this ready-to-move project offers 2, 3 & 4 BHK flats sized 1,200–2,714 sq ft, priced ₹37.8–88.2 lakh, with amenities like clubhouse, kids’ play, power backup & 24×7 security.'),
('delivered-1791395834021', 5, 'Madhuri Enclave', 'Patna', '/img/delivered/madhuri.webp', 'Situated in Digha, Patna, this ready-to-move residential project features thoughtfully designed 2 & 3 BHK flats sized 1,086–1,404 sq ft, with around 60 units across 0.3 acres, offering comfort and modern urban living.'),
('delivered-1791396036602', 6, 'P mall', 'Patna', '/img/delivered/pmall.webp', 'This premium mall brings a blend of retail, dining, and entertainment under one roof, offering top national and international brands, modern amenities, ample parking, and a vibrant shopping experience.'),
('delivered-1791396107902', 7, 'Satyam Apartment', 'Patna', '/img/delivered/satyam.webp', 'Located on Boring Road, Patna, this ready-to-move project offers premium apartments with Italian marble finishes, power backup, kids’ play, yoga zone, green spaces, and 24×7 security.'),
('delivered-1791396210845', 8, 'Viswamohini Apartment', 'Patna', '/img/delivered/viswamohini.webp', 'This premium residential project offers spacious 2 & 3 BHK apartments with modern layouts, quality finishes, and lifestyle amenities, ensuring comfort and convenience in a prime Patna location.')
ON CONFLICT (id) DO NOTHING;


-- 4. ONGOING PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.ongoing_projects (
  id TEXT PRIMARY KEY,
  order_index INTEGER DEFAULT 0,
  type TEXT,
  title TEXT NOT NULL,
  location TEXT,
  area TEXT,
  price TEXT,
  bedrooms INTEGER,
  bathrooms INTEGER,
  image TEXT,
  tag TEXT DEFAULT 'Under Construction',
  rera TEXT,
  sqft TEXT,
  description TEXT,
  about TEXT,
  address TEXT,
  amenities JSONB DEFAULT '[]'::jsonb,
  features JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed ongoing projects
INSERT INTO public.ongoing_projects (
  id, order_index, title, location, type, area, price, image, tag, sqft, description, about, address, amenities, features
)
VALUES (
  'ongoing-signature-park',
  1,
  'Patliputra Signature Park',
  'Greater Noida',
  '1BHK, 2BHK, Retails, Office Spaces & Luxury Studio Apartments',
  '10 Acres',
  'Starts @ 40 Lakh*',
  '/img/signature_park.jpg',
  'Under Construction',
  'An integrated luxury hub spread over 10 acres sqft',
  'An integrated luxury hub spread over 10 acres, Patliputra Signature Park is located in the heart of Greater Noida just two minutes away from the Pari Chowk and Knowledge Park Metro Station. It is known as THE COMMERCIAL DESTINATION OF GREATER NOIDA. Designed by India''s leading Architect, Signature Park offers one of its kind classic architecture of Premium Retail Area, Hyper-Market, Anchor Stores, Branded Stores, Entertainment Zone, Gaming Zone, Food Court, Restaurants, Ultra-Luxurious Serviced Residences, Fully Furnished Studio Apartments, & Office Spaces.',
  'An integrated luxury hub spread over 10 acres, Patliputra Signature Park is located in the heart of Greater Noida just two minutes away from the Pari Chowk and Knowledge Park Metro Station. It is known as THE COMMERCIAL DESTINATION OF GREATER NOIDA. Designed by India''s leading Architect, Signature Park offers one of its kind classic architecture of Premium Retail Area, Hyper-Market, Anchor Stores, Branded Stores, Entertainment Zone, Gaming Zone, Food Court, Restaurants, Ultra-Luxurious Serviced Residences, Fully Furnished Studio Apartments, & Office Spaces.',
  'Signature Park, Plot No. INS - 02, Sector - CHI V, Greater Noida, Gautam Buddha Nagar (Uttar Pradesh) 201310',
  '["MEDITATION GARDEN", "24/7 SECURITY", "CCTV SURVEILLANCE", "AMPLE PARKING SPACE", "FULLY AUTOMATIC LIFTS", "OPEN GYM", "LANDSCAPE GARDEN", "24X7 POWER BACKUP", "YOGA DESK", "SWIMMING POOL"]'::jsonb,
  '["Have 1BHK, 2BHK, Retails, Office Spaces and Luxury Studio Apartments.", "* East-Facing Flats", "An integrated luxury hub spread over 10 acres"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;


-- 5. QUOTE INQUIRIES TABLE
CREATE TABLE IF NOT EXISTS public.quote_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  unit_type TEXT,
  budget TEXT,
  note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 6. CAREER APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.career_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  position TEXT NOT NULL,
  experience TEXT,
  portfolio_url TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);


-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivered_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ongoing_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quote_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.career_applications ENABLE ROW LEVEL SECURITY;

-- Public can read published projects and news
CREATE POLICY "Public Read News" ON public.news FOR SELECT USING (true);
CREATE POLICY "Public Read Delivered Projects" ON public.delivered_projects FOR SELECT USING (true);
CREATE POLICY "Public Read Ongoing Projects" ON public.ongoing_projects FOR SELECT USING (true);

-- Public can submit quote and career inquiries
CREATE POLICY "Public Insert Quotes" ON public.quote_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Careers" ON public.career_applications FOR INSERT WITH CHECK (true);

-- Admin full access policies (Service role / admin API has full bypass)
CREATE POLICY "Service Role Full Access News" ON public.news FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Delivered" ON public.delivered_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Ongoing" ON public.ongoing_projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Quotes" ON public.quote_inquiries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Careers" ON public.career_applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Service Role Full Access Admins" ON public.admin_users FOR ALL USING (true) WITH CHECK (true);


-- 8. DIVERSIFIED BUSINESSES TABLE
CREATE TABLE IF NOT EXISTS public.diversified_businesses (
  id TEXT PRIMARY KEY,
  order_index INTEGER DEFAULT 0,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'HOTEL',
  category_label TEXT,
  category_filter TEXT NOT NULL DEFAULT 'hospitality',
  location TEXT DEFAULT 'Patna, Bihar',
  tagline TEXT,
  image TEXT,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  stats JSONB DEFAULT '[]'::jsonb,
  address TEXT,
  contact_info TEXT,
  highlights JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for diversified businesses
ALTER TABLE public.diversified_businesses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Diversified" ON public.diversified_businesses FOR SELECT USING (true);
CREATE POLICY "Service Role Full Access Diversified" ON public.diversified_businesses FOR ALL USING (true) WITH CHECK (true);

-- Seed diversified businesses data
INSERT INTO public.diversified_businesses (
  id, order_index, title, category, category_label, category_filter, location, tagline, image, description, features, stats, address, contact_info, highlights
)
VALUES
(
  'patliputra-exotica',
  1,
  'Hotel Patliputra Exotica',
  'HOTEL',
  '4-Star Luxury Business Hotel',
  'hospitality',
  'Exhibition Road, Patna',
  'Premier 4-Star Hospitality & Grand Banqueting Landmark',
  '/img/Business/delivered_exotica.webp',
  'Patna''s distinguished luxury business hotel offering plush executive suites, signature fine dining at Bawarchi, versatile conference facilities, and majestic celebration halls.',
  '["4-Star Executive Rooms", "Bawarchi Multi-Cuisine Fine Dine", "Grand Banquets & Ballrooms", "24/7 Corporate Business Hub"]'::jsonb,
  '[{"label": "Rating", "value": "4-Star"}, {"label": "Accommodations", "value": "70+ Rooms"}, {"label": "Banquets", "value": "3 Grand Halls"}]'::jsonb,
  'Exhibition Road, Near Gandhi Maidan, Patna, Bihar 800001',
  '+91 98765 43210',
  '["Prime central commercial hub location with seamless transit connectivity", "Signature Bawarchi restaurant serving acclaimed North Indian, Mughlai & Oriental cuisine", "Comprehensive high-tech conference spaces for corporate conventions", "Dedicated concierge, valet parking, and luxury airport transfers"]'::jsonb
),
(
  'patliputra-nirvana',
  2,
  'Hotel Patliputra Nirvana',
  'HOTEL',
  'Boutique Urban Hotel',
  'hospitality',
  'Buddha Colony / Boring Road, Patna',
  'Tranquil Boutique Hospitality & Curated Dining Ambience',
  '/img/Business/delivered_nirvana.webp',
  'An exquisite boutique urban retreat combining serene zen aesthetics with personalized hospitality, handcrafted culinary delights, and private banqueting spaces crafted for memorable stays.',
  '["Designer Boutique Suites", "Themed Ambient Restaurant", "Bespoke Event Spaces", "24/7 Personalized Concierge"]'::jsonb,
  '[{"label": "Ambiance", "value": "Zen Boutique"}, {"label": "Dining", "value": "Curated Cuisine"}, {"label": "Location", "value": "Buddha Colony"}]'::jsonb,
  'Buddha Colony, Off Boring Canal Road, Patna, Bihar 800001',
  '+91 98765 43210',
  '["Calm, aesthetic environment nestled in central Patna", "Thoughtfully appointed rooms with contemporary conveniences", "Intimate venue for social gatherings, engagements, and corporate meetings", "Dedicated guest services and prompt room assistance"]'::jsonb
),
(
  'alina-resort',
  3,
  'Alina Resort',
  'RESORT',
  'Destination Resort & Events',
  'hospitality',
  'Patna Outskirts, Bihar',
  'Luxury Poolside Paradise & Grand Wedding Haven',
  '/img/Business/delivered_alina.webp',
  'An expansive leisure resort featuring sparkling swimming pools, lush landscaped party lawns, poolside gazebos, and grand catering designed for fairytale weddings and weekend retreats.',
  '["Open-Air Designer Pool", "1,000+ Guest Wedding Lawns", "Poolside Cabanas & Lounge", "Weekend Leisure & Banquets"]'::jsonb,
  '[{"label": "Venue Type", "value": "Resort & Lawns"}, {"label": "Capacity", "value": "1,000+ Guests"}, {"label": "Setting", "value": "Poolside Greenery"}]'::jsonb,
  'Patna - Gaya Highway Corridor, Patna Outskirts, Bihar',
  '+91 98765 43210',
  '["Spacious open-air swimming pool with sun lounge deck", "Massive manicured lawns ideal for grand destination weddings & galas", "Dedicated catering kitchens and VIP dressing suites", "Tranquil getaway away from urban noise with ample valet parking"]'::jsonb
),
(
  'mims-hospital',
  4,
  'MIMS Hospital',
  'HOSPITAL',
  'Super-Speciality Healthcare',
  'healthcare',
  'Bihar',
  'Advanced Critical Care & Compassionate Medical Services',
  '/img/Business/delivered_mims.webp',
  'A state-of-the-art multi-speciality medical complex providing round-the-clock emergency trauma services, modern ICU facilities, diagnostic laboratories, and super-specialist healthcare.',
  '["24/7 Trauma & Emergency", "Modular OTs & Advanced ICUs", "NABL-Standard Pathology", "Multi-Speciality Consultations"]'::jsonb,
  '[{"label": "Emergency", "value": "24/7 Service"}, {"label": "Care Units", "value": "Advanced ICU"}, {"label": "Departments", "value": "Multi-Speciality"}]'::jsonb,
  'Medical Hub Corridor, Bihar',
  '+91 98765 43210',
  '["Round-the-clock emergency casualty and trauma response team", "Fully equipped critical care unit with modern ventilators and monitors", "Digital imaging, ultrasound, and comprehensive diagnostic laboratory", "In-house emergency pharmacy and dedicated ambulance fleet"]'::jsonb
),
(
  'babu-g-vidyamandir',
  5,
  'Babu G Vidyamandir',
  'SCHOOL',
  'Academic Institution',
  'education',
  'Bihar',
  'Excellence in Comprehensive Education & Character Building',
  '/img/Business/delivered_school.webp',
  'A premier co-educational institution nurturing academic excellence, holistic personality development, smart digital classrooms, and extensive sports facilities for future leaders.',
  '["Smart Interactive Classrooms", "Modern STEM & Science Labs", "Expansive Athletic Grounds", "Holistic Value-Based Learning"]'::jsonb,
  '[{"label": "Campus", "value": "Expansive Green"}, {"label": "Education", "value": "Comprehensive"}, {"label": "Activities", "value": "Sports & Arts"}]'::jsonb,
  'Campus Enclave, Bihar',
  '+91 98765 43210',
  '["Wide open campus with full-sized athletic grounds and play courts", "Dedicated computer labs, library, and science practical rooms", "Experienced faculty focusing on intellectual, moral, and physical growth", "Safe and secure campus environment with transport facilities"]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- TABLE 5: UPCOMING LANDMARKS
-- ==========================================
CREATE TABLE IF NOT EXISTS public.upcoming_landmarks (
  id TEXT PRIMARY KEY,
  order_index INTEGER DEFAULT 0,
  title TEXT NOT NULL,
  badge TEXT NOT NULL DEFAULT '5 Star Hotel',
  image TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for upcoming landmarks
ALTER TABLE public.upcoming_landmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Upcoming Landmarks" ON public.upcoming_landmarks FOR SELECT USING (true);
CREATE POLICY "Service Role Full Access Upcoming Landmarks" ON public.upcoming_landmarks FOR ALL USING (true) WITH CHECK (true);

-- Seed upcoming landmarks data
INSERT INTO public.upcoming_landmarks (
  id, order_index, title, badge, image
)
VALUES
(
  'mussoorie-hotel',
  1,
  '5 Star Hotel in Mussoorie',
  '5 Star Hotel',
  '/img/landmarks/Mussoorie_Hotel.png'
),
(
  'ranchi-hotel',
  2,
  '5 Star Hotel in Ranchi',
  '5 Star Hotel',
  '/img/landmarks/Ranchi_Hotel.png'
),
(
  'patliputra-park',
  3,
  'Patliputra Park in Patna - Saguna More',
  'Park',
  '/img/landmarks/Patliputra_Park.png'
),
(
  'greaternoida-hotel',
  4,
  '5 Star Hotel in Greater Noida',
  '5 Star Hotel',
  '/img/landmarks/GreaterNoida_Hotel.png'
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================
-- TABLE 6: BLOGS & ARTICLES
-- ==========================================
CREATE TABLE IF NOT EXISTS public.blogs (
  id TEXT PRIMARY KEY,
  order_index INTEGER DEFAULT 0,
  title TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Patliputra',
  date TEXT NOT NULL DEFAULT '07-August 2025',
  image TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  offers JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  why_invest JSONB DEFAULT '[]'::jsonb,
  contact_phone TEXT DEFAULT '+91 9771417077',
  patna_office TEXT DEFAULT '301, Maharaja Kameshwar Complex, Frazer Road, Patna',
  noida_office TEXT DEFAULT 'Plot No. INS - 02, Sector - Chi V, Greater Noida',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for blogs
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (true);
CREATE POLICY "Service Role Full Access Blogs" ON public.blogs FOR ALL USING (true) WITH CHECK (true);

-- Seed blogs initial data
INSERT INTO public.blogs (
  id, order_index, title, author, date, image, subtitle, description, offers, highlights, why_invest, contact_phone, patna_office, noida_office
)
VALUES
(
  'remarkable-success-bihar',
  1,
  'After Our Remarkable Success In Bihar',
  'Patliputra',
  '07-August 2025',
  'https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_bihar_success.png',
  'Patliputra Signature Park – Now in Greater Noida!',
  'After our remarkable success in Bihar, we''re expanding to Greater Noida with a landmark investment opportunity.',
  '["12% Assured Return Till Possession", "Offer valid only till 30th June 2025", "RERA Approved Project (UPRERAPRJ422327/10/2024)", "Construction in Full Swing"]'::jsonb,
  '["Premium Studio Apartments, Office Spaces & Retail Shops", "Located in Sector Chi V, one of Greater Noida''s most promising zones", "Backed by the trusted Patliputra Group"]'::jsonb,
  '["High returns with low entry point", "Fully secure, RERA-compliant project", "Ideal for working professionals, startups & smart investors", "Assured rental income before possession"]'::jsonb,
  '+91 9771417077',
  '301, Maharaja Kameshwar Complex, Frazer Road, Patna',
  'Plot No. INS - 02, Sector - Chi V, Greater Noida'
),
(
  'now-in-greater-noida',
  2,
  'Now In Greater Noida',
  'Patliputra',
  '07-August 2025',
  'https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_greater_noida.png',
  'Signature Landmark on the Yamuna Expressway Corridor',
  'Experience unmatched commercial & luxury studio living in Greater Noida Chi V with guaranteed returns and flexible payment schemes.',
  '["12% Assured Return till Possession", "Right Time, Right Investment", "Special 50:25:25 Flexible Payment Plan", "Construction in Full Swing"]'::jsonb,
  '["Situated at Entrance of Greater Noida before Pari Chowk", "High-visibility retail frontage with premium office spaces", "Next to major business enclaves and universities"]'::jsonb,
  '["Exponential capital appreciation in Yamuna Expressway corridor", "Direct metro & expressway connectivity to Jewar Airport", "Guaranteed corporate lease assistance post possession"]'::jsonb,
  '+91 9771417077',
  '301, Maharaja Kameshwar Complex, Frazer Road, Patna',
  'Plot No. INS - 02, Sector - Chi V, Greater Noida'
),
(
  'offer-patliputra-signature-park',
  3,
  'Offer Patliputra Signature Park',
  'Patliputra',
  '07-August 2025',
  'https://mbfrobyozijbwglauqop.supabase.co/storage/v1/object/public/project%20images/Blogs/blog_signature_park_offer.png',
  'Invest Smart, Earn Early: Fully Furnished Studio Apartments',
  'Invest in luxury studio apartments starting at ₹27 Lakh with assured monthly rentals of ₹27,000/- right from day one.',
  '["Just Pay ₹ 27,00,000*", "Assured Returns ₹ 27,000/- Per Month", "Fully Furnished Studio Apartment with Turnkey Handover", "Payment Plan: 50:25:25"]'::jsonb,
  '["Designer turnkey interiors with international grade fittings", "Exclusive club membership and concierge services", "High rental demand from corporate hubs & IT corridors"]'::jsonb,
  '["Immediate monthly cash flow before possession", "Hassle-free fully managed rental asset", "Trusted 35+ years legacy of Patliputra Group"]'::jsonb,
  '+91 9771417077',
  '301, Maharaja Kameshwar Complex, Frazer Road, Patna',
  'Plot No. INS - 02, Sector - Chi V, Greater Noida'
)
ON CONFLICT (id) DO NOTHING;



