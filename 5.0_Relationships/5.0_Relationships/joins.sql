-- Teach
--1) As Keyword 

-- Join

-- 1. One-to-One Join (User Profile and Address)
-- To retrieve a user and their associated address (assuming each user has exactly one address):

SELECT u.username, u.email, a.street, a.city, a.state
FROM users u
JOIN addresses a ON u.user_id = a.user_id;

-- 2. One-to-Many Join (User Profile and Posts)
-- To retrieve a user and their posts (assuming each user can have multiple posts):

SELECT u.username, u.email, p.title, p.content
FROM users u
JOIN posts p ON u.user_id = p.user_id;

-- 3. Many-to-Many Join (Users and Interests)
-- To retrieve users and their associated interests (assuming multiple users can have multiple interests):

SELECT u.username, i.interest_name
FROM users u
JOIN user_interests ui ON u.user_id = ui.user_id
JOIN interests i ON ui.interest_id = i.interest_id;
