-- 1. CLEANUP (Optional: Clears existing data to avoid duplicates)
TRUNCATE TABLE public.expenses, public.categories, public.accounts, public.profiles, public.users RESTART IDENTITY CASCADE;

-- 2. INSERT USER (Clinton)
-- Role must be 'USER' or 'ADMIN' based on your check constraint
INSERT INTO public.users (id, username, password, role)
VALUES 
(1, 'clinton', 'clinton', 'USER');

-- 3. INSERT PROFILES (Clinton & Melissa)
-- Color codes: Blue for Clinton, Pink for Melissa
INSERT INTO public.profiles (profile_id, profile_name, profile_color_code, profile_description, user_id)
VALUES 
(1, 'Clinton', '#1E90FF', 'Main profile', 1), -- Dodger Blue
(2, 'Melissa', '#FF69B4', 'Partner profile', 1); -- Hot Pink

-- 4. INSERT ACCOUNTS
-- account_type constraint: 0 or 1. Assuming 0=Savings, 1=Credit/Wallet
INSERT INTO public.accounts (account_id, account_name, account_balance, account_type, user_id, profile_id)
VALUES 
(1, 'HDFC Salary', 150000.00, 0, 1, 1),
(2, 'Clinton Credit Card', -12000.00, 1, 1, 1),
(3, 'Melissa SBI Savings', 85000.00, 0, 1, 2),
(4, 'Cash / Wallet', 5000.00, 0, 1, 1);

-- 5. INSERT CATEGORIES
-- Included 'Tech' for your work and 'Health' for diet
INSERT INTO public.categories (category_id, category_name, category_color_code, category_icon, user_id, profile_id)
VALUES 
(1, 'Rent & Housing', '#FF5733', 'home', 1, 1),
(2, 'Groceries (Healthy)', '#2ECC71', 'leaf', 1, 1), -- Green for health
(3, 'Dining Out', '#F1C40F', 'utensils', 1, 2),
(4, 'Tech & Learning', '#3498DB', 'laptop', 1, 1), -- Blue for Tech
(5, 'Medical & Health', '#E74C3C', 'heartbeat', 1, 1),
(6, 'Utilities', '#95A5A6', 'bolt', 1, 1);

-- 6. INSERT EXPENSES (Jan 2025 - Dec 2025)
-- Sample data showing monthly patterns
INSERT INTO public.expenses (expense_amount, expense_created_at, expense_updated_at, expense_description, account_id, category_id, profile_id, user_id)
VALUES 
-- JANUARY 2025
(25000.00, '2025-01-01', '2025-01-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(3500.00, '2025-01-05', '2025-01-05', 'BigBasket: Oats, Olive Oil, Fruits', 2, 2, 1, 1),
(1200.00, '2025-01-10', '2025-01-10', 'AWS Bill (Personal Project)', 2, 4, 1, 1),
(4500.00, '2025-01-15', '2025-01-15', 'Dinner Date (Melissa)', 3, 3, 2, 1),

-- FEBRUARY 2025
(25000.00, '2025-02-01', '2025-02-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(800.00, '2025-02-02', '2025-02-02', 'Udemy Spring Boot Course', 2, 4, 1, 1),
(2000.00, '2025-02-14', '2025-02-14', 'Valentines Gift', 1, 3, 1, 1),
(1500.00, '2025-02-20', '2025-02-20', 'Lipid Profile / Health Checkup', 1, 5, 1, 1),

-- MARCH 2025
(25000.00, '2025-03-01', '2025-03-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(3000.00, '2025-03-10', '2025-03-10', 'Vegetable Market (Low Oil Prep)', 4, 2, 1, 1),
(1200.00, '2025-03-12', '2025-03-12', 'AWS Bill', 2, 4, 1, 1),

-- APRIL 2025
(25000.00, '2025-04-01', '2025-04-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(500.00, '2025-04-05', '2025-04-05', 'Broadband Bill', 1, 6, 1, 1),

-- MAY 2025
(25000.00, '2025-05-01', '2025-05-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(4000.00, '2025-05-15', '2025-05-15', 'Summer Clothes Shopping', 3, 3, 2, 1),

-- JUNE 2025
(25000.00, '2025-06-01', '2025-06-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(1200.00, '2025-06-10', '2025-06-10', 'AWS Bill', 2, 4, 1, 1),

-- JULY 2025
(25000.00, '2025-07-01', '2025-07-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(2000.00, '2025-07-20', '2025-07-20', 'Monsoon Trek Snacks (Healthy)', 4, 2, 1, 1),

-- AUGUST 2025
(25000.00, '2025-08-01', '2025-08-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(1500.00, '2025-08-15', '2025-08-15', 'Electricity Bill', 1, 6, 1, 1),

-- SEPTEMBER 2025
(25000.00, '2025-09-01', '2025-09-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(1200.00, '2025-09-10', '2025-09-10', 'AWS Bill', 2, 4, 1, 1),

-- OCTOBER 2025
(25000.00, '2025-10-01', '2025-10-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(5000.00, '2025-10-20', '2025-10-20', 'Diwali Gifts for Melissa', 1, 3, 1, 1),

-- NOVEMBER 2025
(25000.00, '2025-11-01', '2025-11-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(3000.00, '2025-11-15', '2025-11-15', 'Java Certification Exam Fee', 2, 4, 1, 1),

-- DECEMBER 2025
(25000.00, '2025-12-01', '2025-12-01', 'Monthly Rent - Pune', 1, 1, 1, 1),
(1200.00, '2025-12-10', '2025-12-10', 'AWS Bill', 2, 4, 1, 1),
(6000.00, '2025-12-25', '2025-12-25', 'Christmas/Year End Party', 3, 3, 2, 1);

-- 7. RESET SEQUENCES
-- This ensures that when you add new data via your app, the IDs don't conflict with what we just inserted.
SELECT setval('public.users_id_seq', (SELECT MAX(id) FROM public.users));
SELECT setval('public.profiles_profile_id_seq', (SELECT MAX(profile_id) FROM public.profiles));
SELECT setval('public.accounts_account_id_seq', (SELECT MAX(account_id) FROM public.accounts));
SELECT setval('public.categories_category_id_seq', (SELECT MAX(category_id) FROM public.categories));
SELECT setval('public.expenses_expense_id_seq', (SELECT MAX(expense_id) FROM public.expenses));