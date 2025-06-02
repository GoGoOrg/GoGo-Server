-- Base fields to be added to all models
-- Can be used as a domain or just added manually
-- For simplicity, added manually to each table

CREATE TABLE "user" (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    firstName VARCHAR,
    lastName VARCHAR,
    email VARCHAR UNIQUE,
    phoneNumber VARCHAR,
    avatar TEXT,
    about TEXT,
    role VARCHAR,
    birthday DATE,
    totalCars INT,
    totalHired INT,
    responsePercent FLOAT,
    agreePercent FLOAT,
    responseTime FLOAT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Feedback (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    description TEXT,
    ischeck BOOLEAN,
    userId INT REFERENCES "user"(id),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE FuelType (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE TransmissionType (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE City (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);



CREATE TABLE Brand (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Car (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    type VARCHAR,
    licensePlate VARCHAR,
    description VARCHAR,
    regulation VARCHAR,
    color VARCHAR,
    seats INT,
    doors INT,
    price FLOAT,
    ownerId INT REFERENCES "user"(id),
    brandId INT REFERENCES Brand(id),
    cityId INT REFERENCES City(id),
    transmissionTypeId INT REFERENCES TransmissionType(id),
    fuelTypeId INT REFERENCES FuelType(id),
    totalRide INT,
    totalHeart INT,
    mortage BOOLEAN,
    insurance BOOLEAN,
    starNumber FLOAT,
    avgRating FLOAT,
    reviewCount FLOAT,
    pricePerDay INT,
    discountValue INT,
    discountType VARCHAR,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE Booking (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES "user"(id),
    carId INT REFERENCES Car(id),
    status VARCHAR,
    startDateTime TIMESTAMP,
    endDateTime TIMESTAMP,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Review (
    id SERIAL PRIMARY KEY,
    content TEXT,
    userId INT REFERENCES "user"(id),
    carId INT REFERENCES Car(id),
    star INT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Favorite (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES "user"(id),
    carId INT REFERENCES Car(id),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE Tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);




CREATE TABLE CarImage (
    id SERIAL PRIMARY KEY,
    carId INT,
    imageUrl TEXT,
    isPrimary BOOLEAN,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Utility (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR,
    imageUrl TEXT,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE Car_Tag (
    id SERIAL PRIMARY KEY,
    carId INT REFERENCES Car(id),
    tagId INT REFERENCES Tag(id),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Car_Utility (
    id SERIAL PRIMARY KEY,
    carId INT REFERENCES Car(id),
    utilityId INT REFERENCES Utility(id),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Promotion (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    discountAmount INT,
    discountPercent INT,
    startDate DATE,
    endDate DATE,
    isActive BOOLEAN,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Car_Promotion (
    id SERIAL PRIMARY KEY,
    carId INT REFERENCES Car(id),
    promotionId INT REFERENCES Promotion(id),
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE CarAvailability (
    id SERIAL PRIMARY KEY,
    carId INT REFERENCES Car(id),
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    createdAt TIMESTAMP,
    updatedAt TIMESTAMP,
    deletedAt TIMESTAMP
);
