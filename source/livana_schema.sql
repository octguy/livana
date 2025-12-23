create table  "role"
(
    id         uuid        not null
        constraint pk_role
            primary key,
    created_at timestamp   not null,
    updated_at timestamp,
    deleted_at timestamp,
    name       varchar(50) not null
        constraint uc_role_name
            unique
);

create table  "user"
(
    id            uuid         not null
        constraint pk_user
            primary key,
    created_at    timestamp    not null,
    updated_at    timestamp,
    deleted_at    timestamp,
    username      varchar(50)  not null
        constraint uc_user_username
            unique,
    email         varchar(50)  not null
        constraint uc_user_email
            unique,
    enabled       boolean      not null,
    status        varchar(255) not null,
    last_login_at timestamp
);

create table  auth_credential
(
    id                      uuid         not null
        constraint pk_auth_credential
            primary key,
    created_at              timestamp    not null,
    updated_at              timestamp,
    deleted_at              timestamp,
    user_id                 uuid         not null
        constraint uc_auth_credential_user
            unique
        constraint fk_auth_credential_on_user
            references "user",
    password                varchar(200) not null,
    verfication_code        varchar(6),
    verification_expiration timestamp,
    last_password_change_at timestamp
);

create table password_reset_token
(
    id         uuid         not null
        constraint pk_password_reset_token
            primary key,
    created_at timestamp    not null,
    updated_at timestamp,
    deleted_at timestamp,
    user_id    uuid         not null
        constraint uc_password_reset_token_user
            unique
        constraint fk_password_reset_token_on_user
            references "user",
    token      varchar(200) not null,
    expiration timestamp    not null
);

create table  refresh_token
(
    id         uuid         not null
        constraint pk_refresh_token
            primary key,
    created_at timestamp    not null,
    updated_at timestamp,
    deleted_at timestamp,
    user_id    uuid         not null
        constraint uc_refresh_token_user
            unique
        constraint fk_refresh_token_on_user
            references "user",
    token      varchar(200) not null,
    expiration timestamp    not null
);

create table role_user
(
    created_at timestamp not null,
    updated_at timestamp,
    deleted_at timestamp,
    user_id    uuid      not null
        constraint fk_role_user_on_user
            references "user",
    role_id    uuid      not null
        constraint fk_role_user_on_role
            references role,
    constraint pk_role_user
        primary key (user_id, role_id)
);


create table user_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    display_name VARCHAR(100),
    bio TEXT,
    profile_photo_url TEXT,
    phone_number VARCHAR(20),
    date_of_birth DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table interests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT
);

create table user_interests (
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    interest_id INTEGER NOT NULL REFERENCES interests(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, interest_id)
);

-- 2. Locations (optional PostGIS geometry for geospatial search)
CREATE TABLE locations (
    id            BIGSERIAL PRIMARY KEY,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city          VARCHAR(100),
    state_region  VARCHAR(100),
    postal_code   VARCHAR(20),
    country_code  VARCHAR(2),
    latitude      DOUBLE PRECISION,
    longitude     DOUBLE PRECISION,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
    -- If PostGIS is enabled, add: ,geom GEOGRAPHY(Point, 4326)
);

-- 3. Listings (both homes and experiences are stored here)
CREATE TABLE listing_homes (
    id                  BIGSERIAL PRIMARY KEY,
    host_id             BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title               VARCHAR(255) NOT NULL,
    description         TEXT NOT NULL,
    location_id         BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    property_type       VARCHAR(100),       -- e.g. apartment, house for homes
    max_guests          INTEGER NOT NULL CHECK (max_guests > 0),
    base_price          NUMERIC(10,2) NOT NULL CHECK (base_price >= 0),
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

create table listing_experiences (
    id             BIGSERIAL PRIMARY KEY,
    host_id        BIGINT NOT NULL REFERENCES users(id),
    category_id    BIGINT REFERENCES experience_categories(id),
    location_id   BIGINT REFERENCES locations(id),
    title          TEXT NOT NULL,
    description    TEXT,
    duration_min   INT,                 -- thời lượng tính bằng phút
    price          NUMERIC(10,2),
    capacity       INT,                 -- số khách tối đa
    location_id    BIGINT,              -- nếu có bảng location riêng
    status         TEXT DEFAULT 'draft', -- draft / pending / approved / rejected
    created_at     TIMESTAMP DEFAULT NOW(),
    updated_at     TIMESTAMP DEFAULT NOW()
);

CREATE TABLE amenities ( -- just for homes
    id          SERIAL PRIMARY KEY,
    listing_id  BIGINT NOT NULL REFERENCES listing_home(id) ON DELETE CASCADE,
    title       VARCHAR(100) NOT NULL,
    description TEXT,

);

create table facilities (
    id          SERIAL PRIMARY KEY,
    listing_id  BIGINT NOT NULL REFERENCES listing_home(id) ON DELETE CASCADE,
    name       VARCHAR(100) NOT NULL,
    description TEXT,
    quantity    INT,
);

CREATE TABLE experience_categories (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT
);


-- Photos associated with listings
CREATE TABLE listing_photos (
    id         BIGSERIAL PRIMARY KEY,
    listing_home_id BIGINT REFERENCES listings_home(id),
    listing_experience_id BIGINT REFERENCES listings_experience(id),
    photo_url  TEXT NOT NULL,
    description TEXT,
    position   INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Amenity definitions (Wi‑Fi, parking, etc.)


create table activities (
    id            BIGSERIAL PRIMARY KEY,
    experience_id BIGINT NOT NULL REFERENCES listing_experiences(id) ON DELETE CASCADE,
    title         TEXT NOT NULL,
    description   TEXT,
    duration_min  INT,                  -- thời lượng từng activity
    sort_order    INT DEFAULT 0,        -- sắp xếp
);

-- Session schedule for experiences (each session is a distinct bookable event)
CREATE TABLE experience_sessions (
    id             BIGSERIAL PRIMARY KEY,
    listing_id     BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    start_time     TIMESTAMPTZ NOT NULL,
    end_time       TIMESTAMPTZ,
    capacity       INTEGER NOT NULL,
    price_per_person NUMERIC(10,2) NOT NULL CHECK (price_per_person >= 0),
    currency_code  CHAR(3) NOT NULL DEFAULT 'USD',
    available_spots INTEGER NOT NULL,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Bookings
CREATE TYPE booking_status AS ENUM ('pending','confirmed','cancelled','declined','completed');
CREATE TYPE payment_status AS ENUM ('authorized','captured','released','refunded');

CREATE TABLE bookings (
    id             BIGSERIAL PRIMARY KEY,
    listing_id     BIGINT NOT NULL REFERENCES listing_home(id) ON DELETE CASCADE,
    experience_id BIGINT REFERENCES listing_experiences(id) ON DELETE CASCADE,
    guest_id        BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in_date  DATE, -- null for experiences
    check_out_date DATE, -- null for experiences
    session_id     BIGINT REFERENCES experience_sessions(id) ON DELETE SET NULL,
    number_of_guests INTEGER NOT NULL,
    total_price    NUMERIC(10,2) NOT NULL CHECK (total_price >= 0),
    currency_code  CHAR(3) NOT NULL DEFAULT 'USD',
    status         booking_status NOT NULL DEFAULT 'pending',
    is_request     BOOLEAN NOT NULL DEFAULT FALSE, -- true for Request to Book
    payment_status payment_status NOT NULL DEFAULT 'authorized',
    cancellation_reason TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payment transactions for each booking (charges, refunds, fees)
CREATE TABLE booking_payments (
    id                 BIGSERIAL PRIMARY KEY,
    booking_id         BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    amount             NUMERIC(10,2) NOT NULL,
    host_earnings      NUMERIC(10,2),
    currency_code      CHAR(3) NOT NULL DEFAULT 'USD',
    payment_method     VARCHAR(50),
    status             payment_status NOT NULL,
    transaction_reference VARCHAR(255),
    processed_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Messaging
-- A conversation groups messages between participants
CREATE TABLE conversations (
    id               BIGSERIAL PRIMARY KEY,
    listing_id       BIGINT REFERENCES listings(id) ON DELETE SET NULL,
    booking_id       BIGINT REFERENCES bookings(id) ON DELETE SET NULL,
    created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_message_at  TIMESTAMPTZ
);

-- Participants in each conversation (supports group chats)
CREATE TABLE conversation_participants (
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id         BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            VARCHAR(30),
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (conversation_id, user_id)
);

-- Individual chat messages
CREATE TABLE messages (
    id              BIGSERIAL PRIMARY KEY,
    conversation_id BIGINT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id       BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT,
    message_type    VARCHAR(20) NOT NULL DEFAULT 'text', -- 'text','image','file'
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_read         BOOLEAN NOT NULL DEFAULT FALSE
);

-- 6. Reviews & Ratings
CREATE TABLE reviews (
    id             BIGSERIAL PRIMARY KEY,
    booking_id     BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    listing_id     BIGINT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    reviewer_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating         INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment        TEXT,
    review_type    VARCHAR(20) NOT NULL DEFAULT 'guest_to_listing', -- e.g. 'host_to_guest'
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Optional sub‑ratings for specific categories (cleanliness, communication, etc.)
CREATE TABLE review_ratings (
    review_id BIGINT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    category  VARCHAR(50) NOT NULL,
    rating    INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    PRIMARY KEY (review_id, category)
);

-- Helpful votes on reviews
CREATE TABLE review_helpful_votes (
    id         BIGSERIAL PRIMARY KEY,
    review_id  BIGINT NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    is_helpful BOOLEAN NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (review_id, user_id)
);

-- 7. Notifications
CREATE TABLE notifications (
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type       VARCHAR(50) NOT NULL, -- e.g. 'booking', 'message', 'review'
    message    TEXT NOT NULL,
    link       TEXT,                -- deep link to relevant record
    is_read    BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. Coupons and Discounts (optional)
-- CREATE TABLE coupons (
--     id            SERIAL PRIMARY KEY,
--     code          VARCHAR(50) NOT NULL UNIQUE,
--     description   TEXT,
--     discount_percent NUMERIC(5,2) CHECK (discount_percent > 0 AND discount_percent <= 100),
--     max_uses      INTEGER,
--     expiry_date   DATE,
--     created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- CREATE TABLE booking_coupons (
--     id         SERIAL PRIMARY KEY,
--     booking_id BIGINT NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
--     coupon_id  INTEGER NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
--     discount_amount NUMERIC(10,2) NOT NULL
-- );

-- 9. Support Tickets (for help and trust/safety issues)
-- CREATE TABLE support_tickets (
--     id         BIGSERIAL PRIMARY KEY,
--     user_id    BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--     subject    VARCHAR(255) NOT NULL,
--     description TEXT NOT NULL,
--     status     VARCHAR(20) NOT NULL DEFAULT 'open', -- 'open','in_progress','closed'
--     created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
--     updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
-- );

-- Indexes to improve search performance
-- CREATE INDEX idx_listings_type ON listings(type);
-- CREATE INDEX idx_listings_location ON listings(location_id);
-- CREATE INDEX idx_bookings_guest ON bookings(guest_id);
-- CREATE INDEX idx_bookings_host ON bookings(host_id);
-- CREATE INDEX idx_messages_conversation ON messages(conversation_id);
-- CREATE INDEX idx_reviews_listing ON reviews(listing_id);

-- Full‑text search configuration (optional)
-- If listing descriptions and titles need to be searchable, create a tsvector column and index
-- ALTER TABLE listings ADD COLUMN search_vector tsvector;
-- CREATE INDEX idx_listings_search ON listings USING GIN(search_vector);

-- Triggers can be added to update timestamps (e.g. updated_at) and search_vector, but are omitted for brevity.
