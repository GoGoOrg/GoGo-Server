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
    icon TEXT,
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

INSERT INTO utility (name, icon) VALUES
('Wifi', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wifi" viewBox="0 0 16 16">
  <path d="M15.384 6.115a.485.485 0 0 0-.047-.736A12.44 12.44 0 0 0 8 3C5.259 3 2.723 3.882.663 5.379a.485.485 0 0 0-.048.736.52.52 0 0 0 .668.05A11.45 11.45 0 0 1 8 4c2.507 0 4.827.802 6.716 2.164.205.148.49.13.668-.049"/>
  <path d="M13.229 8.271a.482.482 0 0 0-.063-.745A9.46 9.46 0 0 0 8 6c-1.905 0-3.68.56-5.166 1.526a.48.48 0 0 0-.063.745.525.525 0 0 0 .652.065A8.46 8.46 0 0 1 8 7a8.46 8.46 0 0 1 4.576 1.336c.206.132.48.108.653-.065m-2.183 2.183c.226-.226.185-.605-.1-.75A6.5 6.5 0 0 0 8 9c-1.06 0-2.062.254-2.946.704-.285.145-.326.524-.1.75l.015.015c.16.16.407.19.611.09A5.5 5.5 0 0 1 8 10c.868 0 1.69.201 2.42.56.203.1.45.07.61-.091zM9.06 12.44c.196-.196.198-.52-.04-.66A2 2 0 0 0 8 11.5a2 2 0 0 0-1.02.28c-.238.14-.236.464-.04.66l.706.706a.5.5 0 0 0 .707 0l.707-.707z"/>
</svg>'),
('Điều hòa', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fan" viewBox="0 0 16 16">
  <path d="M10 3c0 1.313-.304 2.508-.8 3.4a2 2 0 0 0-1.484-.38c-.28-.982-.91-2.04-1.838-2.969a8 8 0 0 0-.491-.454A6 6 0 0 1 8 2c.691 0 1.355.117 1.973.332Q10 2.661 10 3m0 5q0 .11-.012.217c1.018-.019 2.2-.353 3.331-1.006a8 8 0 0 0 .57-.361 6 6 0 0 0-2.53-3.823 9 9 0 0 1-.145.64c-.34 1.269-.944 2.346-1.656 3.079.277.343.442.78.442 1.254m-.137.728a2 2 0 0 1-1.07 1.109c.525.87 1.405 1.725 2.535 2.377q.3.174.605.317a6 6 0 0 0 2.053-4.111q-.311.11-.641.199c-1.264.339-2.493.356-3.482.11ZM8 10c-.45 0-.866-.149-1.2-.4-.494.89-.796 2.082-.796 3.391q0 .346.027.678A6 6 0 0 0 8 14c.94 0 1.83-.216 2.623-.602a8 8 0 0 1-.497-.458c-.925-.926-1.555-1.981-1.836-2.96Q8.149 10 8 10M6 8q0-.12.014-.239c-1.02.017-2.205.351-3.34 1.007a8 8 0 0 0-.568.359 6 6 0 0 0 2.525 3.839 8 8 0 0 1 .148-.653c.34-1.267.94-2.342 1.65-3.075A2 2 0 0 1 6 8m-3.347-.632c1.267-.34 2.498-.355 3.488-.107.196-.494.583-.89 1.07-1.1-.524-.874-1.406-1.733-2.541-2.388a8 8 0 0 0-.594-.312 6 6 0 0 0-2.06 4.106q.309-.11.637-.199M8 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2"/>
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
</svg>'),
('Hệ thống định vị GPS', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-geo-alt-fill" viewBox="0 0 16 16">
  <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6"/>
</svg>'),
('Bluetooth', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bluetooth" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="m8.543 3.948 1.316 1.316L8.543 6.58zm0 8.104 1.316-1.316L8.543 9.42zm-1.41-4.043L4.275 5.133l.827-.827L7.377 6.58V1.128l4.137 4.136L8.787 8.01l2.745 2.745-4.136 4.137V9.42l-2.294 2.274-.827-.827zM7.903 16c3.498 0 5.904-1.655 5.904-8.01 0-6.335-2.406-7.99-5.903-7.99S2 1.655 2 8.01C2 14.344 4.407 16 7.904 16Z"/>
</svg>'),
('Cổng sạc USB', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-usb" viewBox="0 0 16 16">
  <path d="M2.25 7a.25.25 0 0 0-.25.25v1c0 .138.112.25.25.25h11.5a.25.25 0 0 0 .25-.25v-1a.25.25 0 0 0-.25-.25z"/>
  <path d="M0 5.5A.5.5 0 0 1 .5 5h15a.5.5 0 0 1 .5.5v5a.5.5 0 0 1-.5.5H.5a.5.5 0 0 1-.5-.5zM1 10h14V6H1z"/>
</svg>'),
('Hệ thống cảnh báo va chạm', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
  <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0M7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0z"/>
</svg>'),
('Lốp dự phòng', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-gear-wide-connected" viewBox="0 0 16 16">
  <path d="M7.068.727c.243-.97 1.62-.97 1.864 0l.071.286a.96.96 0 0 0 1.622.434l.205-.211c.695-.719 1.888-.03 1.613.931l-.08.284a.96.96 0 0 0 1.187 1.187l.283-.081c.96-.275 1.65.918.931 1.613l-.211.205a.96.96 0 0 0 .434 1.622l.286.071c.97.243.97 1.62 0 1.864l-.286.071a.96.96 0 0 0-.434 1.622l.211.205c.719.695.03 1.888-.931 1.613l-.284-.08a.96.96 0 0 0-1.187 1.187l.081.283c.275.96-.918 1.65-1.613.931l-.205-.211a.96.96 0 0 0-1.622.434l-.071.286c-.243.97-1.62.97-1.864 0l-.071-.286a.96.96 0 0 0-1.622-.434l-.205.211c-.695.719-1.888.03-1.613-.931l.08-.284a.96.96 0 0 0-1.186-1.187l-.284.081c-.96.275-1.65-.918-.931-1.613l.211-.205a.96.96 0 0 0-.434-1.622l-.286-.071c-.97-.243-.97-1.62 0-1.864l.286-.071a.96.96 0 0 0 .434-1.622l-.211-.205c-.719-.695-.03-1.888.931-1.613l.284.08a.96.96 0 0 0 1.187-1.186l-.081-.284c-.275-.96.918-1.65 1.613-.931l.205.211a.96.96 0 0 0 1.622-.434zM12.973 8.5H8.25l-2.834 3.779A4.998 4.998 0 0 0 12.973 8.5m0-1a4.998 4.998 0 0 0-7.557-3.779l2.834 3.78zM5.048 3.967l-.087.065zm-.431.355A4.98 4.98 0 0 0 3.002 8c0 1.455.622 2.765 1.615 3.678L7.375 8zm.344 7.646.087.065z"/>
</svg>'),
('Camera lùi', '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-camera-reels" viewBox="0 0 16 16">
  <path d="M6 3a3 3 0 1 1-6 0 3 3 0 0 1 6 0M1 3a2 2 0 1 0 4 0 2 2 0 0 0-4 0"/>
  <path d="M9 6h.5a2 2 0 0 1 1.983 1.738l3.11-1.382A1 1 0 0 1 16 7.269v7.462a1 1 0 0 1-1.406.913l-3.111-1.382A2 2 0 0 1 9.5 16H2a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2zm6 8.73V7.27l-3.5 1.555v4.35zM1 8v6a1 1 0 0 0 1 1h7.5a1 1 0 0 0 1-1V8a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1"/>
  <path d="M9 6a3 3 0 1 0 0-6 3 3 0 0 0 0 6M7 3a2 2 0 1 1 4 0 2 2 0 0 1-4 0"/>
</svg>');

CREATE OR REPLACE FUNCTION update_car_avgrating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE car
  SET avgrating = COALESCE((
      SELECT AVG(star)::NUMERIC(3,2)
      FROM review
      WHERE carid = NEW.carid
    ), 0),
    reviewcount = COALESCE((
      SELECT COUNT(*)
      FROM reviews
      WHERE carid = NEW.carid
    ), 0)
  WHERE id = NEW.carid;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- When a review is inserted
CREATE TRIGGER trg_review_insert
AFTER INSERT ON review
FOR EACH ROW
EXECUTE FUNCTION update_car_avgrating();

-- When a review is updated
CREATE TRIGGER trg_review_update
AFTER UPDATE ON review
FOR EACH ROW
EXECUTE FUNCTION update_car_avgrating();

-- When a review is deleted
CREATE TRIGGER trg_review_delete
AFTER DELETE ON review
FOR EACH ROW
EXECUTE FUNCTION update_car_avgrating();
