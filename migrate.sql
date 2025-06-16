-- Base fields to be added to all models
-- Can be used as a domain or just added manually
-- For simplicity, added manually to each table

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL,
    password VARCHAR NOT NULL,
    fullName VARCHAR,
    email VARCHAR UNIQUE,
    phone VARCHAR,
    avatar TEXT,
    about TEXT,
    role VARCHAR,
    birthday DATE,
    totalCars INT,
    totalHired INT,
    responsePercent FLOAT,
    agreePercent FLOAT,
    responseTime FLOAT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Feedback (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    description TEXT,
    ischeck BOOLEAN,
    userId INT REFERENCES users(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE FuelType (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE TransmissionType (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE City (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);



CREATE TABLE Brand (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    ownerId INT REFERENCES users(id),
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
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE Booking (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES users(id),
    carId INT REFERENCES Car(id),
    status VARCHAR,
    startDate TIMESTAMP,
    endDate TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Review (
    id SERIAL PRIMARY KEY,
    content TEXT,
    userId INT REFERENCES users(id),
    carId INT REFERENCES Car(id),
    star INT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Favorite (
    id SERIAL PRIMARY KEY,
    userId INT REFERENCES users(id),
    carId INT REFERENCES Car(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE Tag (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE CarImage (
    id SERIAL PRIMARY KEY,
    carId INT,
    imageUrl TEXT,
    isPrimary BOOLEAN,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Utility (
    id SERIAL PRIMARY KEY,
    name VARCHAR,
    description VARCHAR,
    imageUrl TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);


CREATE TABLE Car_Tag (
    id SERIAL PRIMARY KEY,
    carId INT REFERENCES Car(id),
    tagId INT REFERENCES Tag(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Car_Utility (
    id SERIAL PRIMARY KEY,
    carId INT REFERENCES Car(id),
    utilityId INT REFERENCES Utility(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE Car_Promotion (
    id SERIAL PRIMARY KEY,
    carId INT REFERENCES Car(id),
    promotionId INT REFERENCES Promotion(id),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE TABLE CarAvailability (
    id SERIAL PRIMARY KEY,
    carId INT REFERENCES Car(id),
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP
);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updatedat = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
    tbl RECORD;
BEGIN
    FOR tbl IN
        SELECT table_name
        FROM information_schema.columns
        WHERE column_name = 'updatedat'
          AND table_schema = 'public'
    LOOP
        EXECUTE format('
            CREATE TRIGGER set_updated_at_%I
            BEFORE UPDATE ON %I
            FOR EACH ROW
            WHEN (OLD.updatedat IS DISTINCT FROM NEW.updatedat OR OLD IS DISTINCT FROM NEW)
            EXECUTE FUNCTION update_updated_at_column();
        ', tbl.table_name, tbl.table_name);
    END LOOP;
END $$;

INSERT INTO transmissiontype (name, description) VALUES
('Số tự động', ''),
('Số sàn', '');

INSERT INTO fueltype (name, description) VALUES
('Xe xăng', ''),
('Xe điện', '');

INSERT INTO brand (name, description) VALUES
('Tesla', ''),
('Toyota', ''),
('Ford', ''),
('Honda', ''),
('BMW', ''),
('Subaru', ''),
('Hyundai', ''),
('Audi', ''),
('Jeep', ''),
('Porsche', ''),
('Dodge', ''),
('Ferrari', ''),
('Jaguar', ''),
('Lamborghini', ''),
('Maserati', ''),
('Bentley', ''),
('Chryslex', ''),
('Chevrolet Corvette', ''),
('Cadillac', ''),
('Mazda', ''),
('Ford Mustang', ''),
('Nissan', ''),
('Alfa Romeo', ''),
('Bugatti', ''),
('Buick', ''),
('Lexus', ''),
('Rolls-Royce', ''),
('Acura', ''),
('Aston Martin', ''),
('Chevrolet', ''),
('Kia', ''),
('Mercedes-Benz', ''),
('Volvo', ''),
('McLaren', ''),
('Mitsubishi', ''),
('Saab', ''),
('Suzuki', ''),
('KTM', ''),
('Maybach', ''),
('Isuzu', ''),
('VinFast', '');

INSERT INTO city (name) VALUES
('An Giang'),
('Bà Rịa - Vũng Tàu'),
('Bạc Liêu'),
('Bắc Giang'),
('Bắc Kạn'),
('Bắc Ninh'),
('Bến Tre'),
('Bình Dương'),
('Bình Định'),
('Bình Phước'),
('Bình Thuận'),
('Cà Mau'),
('Cao Bằng'),
('Cần Thơ'),
('Đà Nẵng'),
('Đắk Lắk'),
('Đắk Nông'),
('Điện Biên'),
('Đồng Nai'),
('Đồng Tháp'),
('Gia Lai'),
('Hà Giang'),
('Hà Nam'),
('Hà Nội'),
('Hà Tĩnh'),
('Hải Dương'),
('Hải Phòng'),
('Hậu Giang'),
('Hòa Bình'),
('Hưng Yên'),
('Khánh Hòa'),
('Kiên Giang'),
('Kon Tum'),
('Lai Châu'),
('Lạng Sơn'),
('Lào Cai'),
('Lâm Đồng'),
('Long An'),
('Nam Định'),
('Nghệ An'),
('Ninh Bình'),
('Ninh Thuận'),
('Phú Thọ'),
('Phú Yên'),
('Quảng Bình'),
('Quảng Nam'),
('Quảng Ngãi'),
('Quảng Ninh'),
('Quảng Trị'),
('Sóc Trăng'),
('Sơn La'),
('Tây Ninh'),
('Thái Bình'),
('Thái Nguyên'),
('Thanh Hóa'),
('Thừa Thiên Huế'),
('Tiền Giang'),
('TP Hồ Chí Minh'),
('Trà Vinh'),
('Tuyên Quang'),
('Vĩnh Long'),
('Vĩnh Phúc'),
('Yên Bái');
