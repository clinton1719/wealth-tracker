-- 1. CLEANUP
-- Added 'category_tags' to the truncate list
TRUNCATE TABLE public.expenses, public.category_tags, public.categories, public.accounts, public.profiles RESTART IDENTITY CASCADE;

-- 3. INSERT PROFILES
INSERT INTO public.profiles (profile_id, profile_name, profile_color_code, profile_description, user_id)
VALUES 
(1, 'Clinton', '#1E90FF', 'Main profile', 1),
(2, 'Melissa', '#FF69B4', 'Partner profile', 1);

-- 4. INSERT ACCOUNTS
INSERT INTO public.accounts (account_id, account_name, account_balance, account_type, user_id, profile_id)
VALUES 
(1, 'HDFC Salary', 150000.00, 0, 1, 1),
(2, 'Clinton Credit Card', -12000.00, 1, 1, 1),
(3, 'Melissa SBI Savings', 85000.00, 0, 1, 2),
(4, 'Cash / Wallet', 5000.00, 0, 1, 1);

-- 5. INSERT CATEGORIES
INSERT INTO public.categories (category_id, category_name, category_color_code, category_icon, user_id, profile_id)
VALUES 
(1, 'Rent & Housing', '#FF5733', 'home', 1, 1),
(2, 'Groceries (Healthy)', '#2ECC71', 'leaf', 1, 1),
(3, 'Dining Out', '#F1C40F', 'utensils', 1, 2),
(4, 'Tech & Learning', '#3498DB', 'laptop', 1, 1),
(5, 'Medical & Health', '#E74C3C', 'heartbeat', 1, 1),
(6, 'Utilities', '#95A5A6', 'bolt', 1, 1),
(7, 'Transport', '#7F8C8D', 'car', 1, 1);

-- 6. INSERT CATEGORY TAGS (New Table for ElementCollection)
-- Mapping tags to the categories created above
INSERT INTO public.category_tags (category_id, tag)
VALUES 
(1, 'fixed'), (1, 'monthly'), (1, 'essential'),
(2, 'food'), (2, 'diet'), (2, 'wellness'),
(3, 'leisure'), (3, 'dates'), (3, 'weekend'),
(4, 'career'), (4, 'software'), (4, 'subscriptions'),
(5, 'doctor'), (5, 'checkup'), (5, 'pharmacy'),
(6, 'electricity'), (6, 'internet'), (6, 'recurring'),
(7, 'commute'), (7, 'cab'), (7, 'fuel');

-- 7. INSERT EXPENSES (Expanded to ~10+ per month for 2025)
INSERT INTO public.expenses (expense_amount, expense_created_at, expense_updated_at, expense_description, account_id, category_id, profile_id, user_id)
VALUES 
-- === JANUARY 2025 ===
(25000.00, '2025-01-01', '2025-01-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-01-02', '2025-01-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(3500.00, '2025-01-05', '2025-01-05', 'BigBasket: Oats, Walnuts, Flaxseeds', 2, 2, 1, 1),
(1200.00, '2025-01-10', '2025-01-10', 'AWS Bill (EC2 Instances)', 2, 4, 1, 1),
(450.00, '2025-01-12', '2025-01-12', 'Uber to Magarpatta', 4, 7, 1, 1),
(2000.00, '2025-01-14', '2025-01-14', 'Pharmacy: Fish Oil Supplements', 1, 5, 1, 1),
(4500.00, '2025-01-15', '2025-01-15', 'Dinner Date (Subway/Salads)', 3, 3, 2, 1),
(850.00, '2025-01-18', '2025-01-18', 'Vegetables (Leafy Greens)', 4, 2, 1, 1),
(1500.00, '2025-01-20', '2025-01-20', 'MSEB Electricity Bill', 1, 6, 1, 1),
(550.00, '2025-01-25', '2025-01-25', 'Kindle Book: Microservices Patterns', 2, 4, 1, 1),
(300.00, '2025-01-28', '2025-01-28', 'Ola Auto', 4, 7, 1, 1),

-- === FEBRUARY 2025 ===
(25000.00, '2025-02-01', '2025-02-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-02-02', '2025-02-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(1200.00, '2025-02-04', '2025-02-04', 'Grocery: Olive Oil & Almonds', 2, 2, 1, 1),
(800.00, '2025-02-05', '2025-02-05', 'Udemy Spring Boot 3 Update', 2, 4, 1, 1),
(1500.00, '2025-02-10', '2025-02-10', 'Lipid Profile Checkup', 1, 5, 1, 1),
(1200.00, '2025-02-12', '2025-02-12', 'AWS Bill', 2, 4, 1, 1),
(2000.00, '2025-02-14', '2025-02-14', 'Valentines Gift for Melissa', 1, 3, 1, 1),
(1200.00, '2025-02-18', '2025-02-18', 'MSEB Electricity Bill', 1, 6, 1, 1),
(600.00, '2025-02-22', '2025-02-22', 'Fruits (Papaya/Guava)', 4, 2, 1, 1),
(450.00, '2025-02-25', '2025-02-25', 'Uber to Phoenix Mall', 2, 7, 1, 1),
(350.00, '2025-02-28', '2025-02-28', 'Mobile Recharge', 4, 6, 1, 1),

-- === MARCH 2025 ===
(25000.00, '2025-03-01', '2025-03-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(3000.00, '2025-03-03', '2025-03-03', 'Monthly Groceries (Low Fat)', 2, 2, 1, 1),
(699.00, '2025-03-05', '2025-03-05', 'Jio Fiber Broadband', 2, 6, 1, 1),
(1200.00, '2025-03-10', '2025-03-10', 'AWS Bill', 2, 4, 1, 1),
(500.00, '2025-03-12', '2025-03-12', 'Doctor Consultation', 4, 5, 1, 1),
(2500.00, '2025-03-15', '2025-03-15', 'New Running Shoes (Health)', 2, 5, 1, 1),
(1800.00, '2025-03-18', '2025-03-18', 'MSEB Electricity Bill', 1, 6, 1, 1),
(900.00, '2025-03-20', '2025-03-20', 'Tech Meetup Entry Fee', 4, 4, 1, 1),
(1500.00, '2025-03-25', '2025-03-25', 'Weekend Dinner (Grilled Chicken)', 3, 3, 2, 1),
(400.00, '2025-03-28', '2025-03-28', 'Ola Auto', 4, 7, 1, 1),
(750.00, '2025-03-30', '2025-03-30', 'Multivitamins Stock', 1, 5, 1, 1),

-- === APRIL 2025 ===
(25000.00, '2025-04-01', '2025-04-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-04-03', '2025-04-03', 'Jio Fiber Broadband', 2, 6, 1, 1),
(4000.00, '2025-04-05', '2025-04-05', 'Summer Groceries (Curd, Fruits)', 2, 2, 1, 1),
(1300.00, '2025-04-10', '2025-04-10', 'AWS Bill (Route53 added)', 2, 4, 1, 1),
(2200.00, '2025-04-15', '2025-04-15', 'MSEB Electricity Bill (AC Usage)', 1, 6, 1, 1),
(500.00, '2025-04-18', '2025-04-18', 'Uber to Office', 2, 7, 1, 1),
(1200.00, '2025-04-20', '2025-04-20', 'Pharmacy', 4, 5, 1, 1),
(3000.00, '2025-04-22', '2025-04-22', 'Summer Cotton Clothes', 2, 1, 1, 1),
(1500.00, '2025-04-25', '2025-04-25', 'Dinner with Melissa', 3, 3, 2, 1),
(250.00, '2025-04-29', '2025-04-29', 'Coconut Water (Daily)', 4, 2, 1, 1),

-- === MAY 2025 ===
(25000.00, '2025-05-01', '2025-05-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-05-02', '2025-05-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(1200.00, '2025-05-05', '2025-05-05', 'AWS Bill', 2, 4, 1, 1),
(3500.00, '2025-05-08', '2025-05-08', 'Healthy Grocery Restock', 2, 2, 1, 1),
(2500.00, '2025-05-15', '2025-05-15', 'MSEB Bill (Peak Summer)', 1, 6, 1, 1),
(4000.00, '2025-05-18', '2025-05-18', 'Summer Clothes Shopping', 3, 3, 2, 1),
(600.00, '2025-05-20', '2025-05-20', 'Uber Intercity', 2, 7, 1, 1),
(1000.00, '2025-05-22', '2025-05-22', 'Blood Test (Cholesterol)', 1, 5, 1, 1),
(450.00, '2025-05-25', '2025-05-25', 'Books (Java Concurrency)', 4, 4, 1, 1),
(2000.00, '2025-05-28', '2025-05-28', 'Date Night (Sushi - Healthy)', 3, 3, 2, 1),

-- === JUNE 2025 ===
(25000.00, '2025-06-01', '2025-06-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-06-02', '2025-06-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(550.00, '2025-06-04', '2025-06-04', 'Umbrella/Raincoat', 4, 1, 1, 1),
(1200.00, '2025-06-10', '2025-06-10', 'AWS Bill', 2, 4, 1, 1),
(3200.00, '2025-06-12', '2025-06-12', 'Groceries (Lentils, Brown Rice)', 2, 2, 1, 1),
(1800.00, '2025-06-15', '2025-06-15', 'MSEB Electricity Bill', 1, 6, 1, 1),
(600.00, '2025-06-18', '2025-06-18', 'Cab to Hinjewadi', 2, 7, 1, 1),
(1500.00, '2025-06-20', '2025-06-20', 'Gym Membership Renewal', 1, 5, 1, 1),
(800.00, '2025-06-25', '2025-06-25', 'Movie Date', 3, 3, 2, 1),
(300.00, '2025-06-28', '2025-06-28', 'Cloudinary Subscription', 2, 4, 1, 1),

-- === JULY 2025 ===
(25000.00, '2025-07-01', '2025-07-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-07-02', '2025-07-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(3000.00, '2025-07-05', '2025-07-05', 'Groceries', 2, 2, 1, 1),
(1200.00, '2025-07-10', '2025-07-10', 'AWS Bill', 2, 4, 1, 1),
(1600.00, '2025-07-15', '2025-07-15', 'MSEB Electricity Bill', 1, 6, 1, 1),
(2000.00, '2025-07-20', '2025-07-20', 'Monsoon Trek Snacks (Healthy Bars)', 4, 2, 1, 1),
(500.00, '2025-07-22', '2025-07-22', 'Shoe Cleaning Kit', 4, 1, 1, 1),
(450.00, '2025-07-25', '2025-07-25', 'Cab to Sinhagad', 4, 7, 1, 1),
(1200.00, '2025-07-28', '2025-07-28', 'Dinner (Soup & Salad)', 3, 3, 2, 1),
(999.00, '2025-07-30', '2025-07-30', 'IntelliJ IDEA License', 2, 4, 1, 1),

-- === AUGUST 2025 ===
(25000.00, '2025-08-01', '2025-08-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-08-02', '2025-08-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(1200.00, '2025-08-05', '2025-08-05', 'AWS Bill', 2, 4, 1, 1),
(3500.00, '2025-08-08', '2025-08-08', 'Groceries (Quinoa, Chia Seeds)', 2, 2, 1, 1),
(1500.00, '2025-08-15', '2025-08-15', 'MSEB Electricity Bill', 1, 6, 1, 1),
(800.00, '2025-08-18', '2025-08-18', 'Car Rental for Weekend', 2, 7, 1, 1),
(2000.00, '2025-08-20', '2025-08-20', 'Gift for Melissa', 1, 3, 1, 1),
(600.00, '2025-08-22', '2025-08-22', 'Routine Health Checkup', 1, 5, 1, 1),
(400.00, '2025-08-25', '2025-08-25', 'Stationery/Whiteboard', 4, 4, 1, 1),
(1000.00, '2025-08-30', '2025-08-30', 'Dining Out', 3, 3, 2, 1),

-- === SEPTEMBER 2025 ===
(25000.00, '2025-09-01', '2025-09-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-09-02', '2025-09-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(3200.00, '2025-09-05', '2025-09-05', 'Groceries (Healthy Oils)', 2, 2, 1, 1),
(1200.00, '2025-09-10', '2025-09-10', 'AWS Bill', 2, 4, 1, 1),
(500.00, '2025-09-12', '2025-09-12', 'Uber to Principal Global', 2, 7, 1, 1),
(1600.00, '2025-09-15', '2025-09-15', 'MSEB Electricity Bill', 1, 6, 1, 1),
(2500.00, '2025-09-20', '2025-09-20', 'Spring Boot Certification', 2, 4, 1, 1),
(800.00, '2025-09-22', '2025-09-22', 'Supplements (Omega-3)', 1, 5, 1, 1),
(1200.00, '2025-09-25', '2025-09-25', 'Lunch with Team', 4, 3, 1, 1),
(300.00, '2025-09-28', '2025-09-28', 'Mobile Bill', 4, 6, 1, 1),

-- === OCTOBER 2025 ===
(25000.00, '2025-10-01', '2025-10-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-10-02', '2025-10-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(5000.00, '2025-10-05', '2025-10-05', 'Diwali Gifts for Melissa', 1, 3, 1, 1),
(1200.00, '2025-10-10', '2025-10-10', 'AWS Bill', 2, 4, 1, 1),
(3500.00, '2025-10-12', '2025-10-12', 'Groceries (Dry Fruits)', 2, 2, 1, 1),
(1500.00, '2025-10-15', '2025-10-15', 'MSEB Electricity Bill', 1, 6, 1, 1),
(2000.00, '2025-10-18', '2025-10-18', 'Home Cleaning (UrbanClap)', 4, 1, 1, 1),
(600.00, '2025-10-20', '2025-10-20', 'Sweets (Sugar Free)', 4, 2, 1, 1),
(450.00, '2025-10-25', '2025-10-25', 'Uber', 2, 7, 1, 1),
(1200.00, '2025-10-28', '2025-10-28', 'Dinner Out', 3, 3, 2, 1),

-- === NOVEMBER 2025 ===
(25000.00, '2025-11-01', '2025-11-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-11-02', '2025-11-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(1200.00, '2025-11-05', '2025-11-05', 'AWS Bill', 2, 4, 1, 1),
(3000.00, '2025-11-10', '2025-11-10', 'Groceries', 2, 2, 1, 1),
(3000.00, '2025-11-15', '2025-11-15', 'Java Certification Exam Fee', 2, 4, 1, 1),
(1400.00, '2025-11-18', '2025-11-18', 'MSEB Electricity Bill', 1, 6, 1, 1),
(800.00, '2025-11-20', '2025-11-20', 'Winter Cream/Lotion', 4, 5, 1, 1),
(500.00, '2025-11-22', '2025-11-22', 'Ola Auto', 4, 7, 1, 1),
(2000.00, '2025-11-25', '2025-11-25', 'Casual Dinner', 3, 3, 2, 1),
(600.00, '2025-11-28', '2025-11-28', 'Udemy Black Friday Sale', 2, 4, 1, 1),

-- === DECEMBER 2025 ===
(25000.00, '2025-12-01', '2025-12-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(699.00, '2025-12-02', '2025-12-02', 'Jio Fiber Broadband', 2, 6, 1, 1),
(3500.00, '2025-12-05', '2025-12-05', 'Groceries (Soup ingredients)', 2, 2, 1, 1),
(1200.00, '2025-12-10', '2025-12-10', 'AWS Bill', 2, 4, 1, 1),
(1500.00, '2025-12-15', '2025-12-15', 'MSEB Electricity Bill', 1, 6, 1, 1),
(1000.00, '2025-12-18', '2025-12-18', 'Winter Jacket Cleaning', 4, 1, 1, 1),
(800.00, '2025-12-20', '2025-12-20', 'Lipid Profile Re-check', 1, 5, 1, 1),
(6000.00, '2025-12-25', '2025-12-25', 'Christmas/Year End Party', 3, 3, 2, 1),
(500.00, '2025-12-28', '2025-12-28', 'Uber to KP', 2, 7, 1, 1),
(1500.00, '2025-12-30', '2025-12-30', 'New Year Groceries', 2, 2, 1, 1);

-- 8. RESET SEQUENCES
SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM public.users));
SELECT setval('public.profiles_profile_id_seq', (SELECT MAX(profile_id) FROM public.profiles));
SELECT setval('public.accounts_account_id_seq', (SELECT MAX(account_id) FROM public.accounts));
SELECT setval('public.categories_category_id_seq', (SELECT MAX(category_id) FROM public.categories));
-- Note: There is no sequence for category_tags usually as it's an element collection join table, 
-- but if you added an ID to it, reset it here.
SELECT setval('public.expenses_expense_id_seq', (SELECT MAX(expense_id) FROM public.expenses));