-- Base model (likely includes created_at, updated_at, etc.)
-- You can define it via inheritance or manually repeat these fields per table

CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    full_name VARCHAR(255),
    birthday DATE,
    gender VARCHAR(10),
    address TEXT,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_superuser BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Car" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    brand VARCHAR(255),
    model VARCHAR(255),
    year INT,
    price NUMERIC(10, 2),
    seat_number INT,
    door_number INT,
    color VARCHAR(100),
    mileage INT,
    location TEXT,
    description TEXT,
    fuel_type_id INT REFERENCES "FuelType"(id),
    transmission_type_id INT REFERENCES "TransmisionType"(id),
    user_id INT REFERENCES "User"(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "FuelType" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "TransmisionType" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Feedback" (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "User"(id),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Comment" (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "User"(id),
    car_id INT REFERENCES "Car"(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Tag" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Car_Tag" (
    id SERIAL PRIMARY KEY,
    car_id INT REFERENCES "Car"(id),
    tag_id INT REFERENCES "Tag"(id),
    
);

CREATE TABLE "Utility" (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "Car_Utility" (
    id SERIAL PRIMARY KEY,
    car_id INT REFERENCES "Car"(id),
    utility_id INT REFERENCES "Utility"(id)
);
