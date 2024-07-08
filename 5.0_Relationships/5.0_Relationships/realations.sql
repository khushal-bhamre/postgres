--Teach Foreign Key
-- user_id INT REFERENCES users(user_id),
-- user_id INT FOREIGN KEY REFERENCES Users(user_id)
-- FOREIGN KEY (user_id) REFERENCES users(user_id)

-- In a one-to-one relationship, each record in Table A can have at most one matching record in Table B, and vice versa.---

-- One-to-One Relationship
-- Example: User Profile and Address

-- In a one-to-one relationship, each record in Table A can have at most one matching record in Table B, and vice versa

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE addresses (
    address_id INT PRIMARY KEY,
    user_id INT UNIQUE,
    street VARCHAR(100),
    city VARCHAR(50),
    state VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- In this example:

-- Each user (in the users table) can have at most one address (in the addresses table).
-- The user_id in the addresses table is a foreign key referencing the user_id in the users table, establishing the one-to-one relationship.

-- One-to-Many Relationship
-- Example: User Profile and Posts

-- In a one-to-many relationship, each record in Table A can have many matching records in Table B, but each record in Table B can have at most one matching record in Table A.

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE posts (
    post_id INT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- In this example:

-- Each user (in the users table) can have multiple posts (in the posts table).
-- The user_id in the posts table is a foreign key referencing the user_id in the users table, establishing the one-to-many relationship.

-- Many-to-Many Relationship
-- Example: Users and Interests

-- In a many-to-many relationship, each record in Table A can have many matching records in Table B, and vice versa.

CREATE TABLE users (
    user_id INT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE interests (
    interest_id INT PRIMARY KEY,
    interest_name VARCHAR(50) NOT NULL
);

CREATE TABLE user_interests (
    user_id INT,
    interest_id INT,
    PRIMARY KEY (user_id, interest_id),
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (interest_id) REFERENCES interests(interest_id)
);

-- In this example:

-- Each user (in the users table) can have multiple interests (in the interests table), and each interest can be associated with multiple users.
-- The user_interests table serves as a junction table that connects users and interests, with foreign keys referencing their respective tables, establishing the many-to-many relationship.