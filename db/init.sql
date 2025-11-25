-- Create a test table
CREATE TABLE test_table (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL
);

-- Insert a sample row
INSERT INTO test_table (message)
VALUES ('Hello from Adeona DB!');

-- Ensure UUID support
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Auto-update updated_at on row update
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ENTITIES --

-- Create Users table
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL, --originall char(60) but hash password is 95+ characters long so use TEXT type
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE TRIGGER trigger_set_updated_at_users
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- Create Airlines table
CREATE TABLE airlines(
    airline_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    airline_name VARCHAR(100) UNIQUE NOT NULL,
    iata_code VARCHAR(3) UNIQUE NOT NULL,
    logo_url VARCHAR(2048) DEFAULT NULL,
    icon_url VARCHAR(2048) DEFAULT NULL
);

-- Create Locations table
CREATE TABLE locations (
    location_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    iata_code CHAR(3) UNIQUE NOT NULL,
    airport_name VARCHAR(100) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country_code CHAR(2) NOT NULL,
    country VARCHAR(100) NOT NULL,
    country_icon_url VARCHAR(2048),
    timezone VARCHAR(50)
);

-- Create Flights table
CREATE TYPE flight_class_enum AS ENUM ('ECONOMY', 'PREMIUM_ECONOMY','BUSINESS', 'FIRST');

CREATE TABLE flights (
    flight_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    airline_id UUID NOT NULL,
    -- flight_number VARCHAR(10) NOT NULL,
    flight_number VARCHAR(10),
    flight_class flight_class_enum NOT NULL,
    origin_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    departure_datetime TIMESTAMPTZ NOT NULL,
    arrival_datetime TIMESTAMPTZ NOT NULL,
    duration_minutes SMALLINT NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    currency CHAR(3) DEFAULT 'USD' NOT NULL,
    adults SMALLINT NOT NULL,
    children SMALLINT NOT NULL,
    infants SMALLINT NOT NULL,
    num_segments SMALLINT NOT NULL CHECK (num_segments >= 1),
    api_source VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_synced_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    

    -- Foreign Key Constraints
    CONSTRAINT fk_airline FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),
    CONSTRAINT fk_origin FOREIGN KEY (origin_id) REFERENCES locations(location_id),
    CONSTRAINT fk_destination FOREIGN KEY (destination_id) REFERENCES locations(location_id),

    -- Check Constraints
    CONSTRAINT chk_duration_positive CHECK (duration_minutes >= 0),
    CONSTRAINT chk_arrival_after_departure CHECK (arrival_datetime > departure_datetime)
);


-- Create Flight Segments table
CREATE TABLE flight_segments(
    segment_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    flight_id UUID NOT NULL,
    segment_number SMALLINT CHECK (segment_number >= 1),
    airline_id UUID NOT NULL,
    flight_number VARCHAR(10),
    origin_id UUID NOT NULL,
    destination_id UUID NOT NULL,
    departure_datetime TIMESTAMPTZ NOT NULL,
    arrival_datetime TIMESTAMPTZ NOT NULL,
    duration_minutes SMALLINT NOT NULL,
    -- layover_minutes SMALLINT DEFAULT 0, Not available in Amadeus

    -- Foreign Key Constraints
    CONSTRAINT fk_flight FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,
    CONSTRAINT fk_airline FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),
    CONSTRAINT fk_origin FOREIGN KEY (origin_id) REFERENCES locations(location_id),
    CONSTRAINT fk_destination FOREIGN KEY (destination_id) REFERENCES locations(location_id),

    -- Unique Constraints
    CONSTRAINT unique_flight_segment UNIQUE (flight_id, segment_number),

    -- Check Constraints
    CONSTRAINT chk_duration_positive CHECK (duration_minutes >= 0),
    CONSTRAINT chk_return_after_departure CHECK (arrival_datetime > departure_datetime)
    -- CONSTRAINT chk_layover_nonnegative CHECK (layover_minutes IS NULL OR layover_minutes >= 0)

);

-- Create Saved Flights table
CREATE TABLE saved_flights(
    sf_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    flight_id UUID NOT NULL,
    saved_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Foreign Key Constraints
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_flight FOREIGN KEY (flight_id) REFERENCES flights(flight_id) ON DELETE CASCADE,

    -- Unique Constraints
    CONSTRAINT unique_user_flight UNIQUE (user_id, flight_id)
);

-- Create Saved Filters table
CREATE TYPE trip_type_enum AS ENUM ('one_way', 'round_trip');

CREATE TABLE saved_filters(
    filter_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name VARCHAR(50) NOT NULL,
    airline_id UUID,
    origin_id UUID,
    destination_id UUID,
    trip_type trip_type_enum,
    min_price DECIMAL(10,2),
    max_price DECIMAL(10,2),
    departure_date DATE,
    return_date DATE,
    date_flex_days SMALLINT,
    num_segments SMALLINT,
    include_redeye BOOLEAN DEFAULT true,
    show_extra_details BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    is_default BOOLEAN DEFAULT false,

    -- Foreign Key Constraint
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_airline FOREIGN KEY (airline_id) REFERENCES airlines(airline_id),
    CONSTRAINT fk_origin FOREIGN KEY (origin_id) REFERENCES locations(location_id),
    CONSTRAINT fk_destination FOREIGN KEY (destination_id) REFERENCES locations(location_id),

    -- Check Constraint
    CONSTRAINT chk_num_segments CHECK (num_segments IS NULL OR num_segments >= 1),
    CONSTRAINT chk_min_price CHECK (min_price IS NULL OR min_price >= 0),
    CONSTRAINT chk_max_price CHECK (max_price IS NULL OR max_price >= 0)

);

CREATE TRIGGER trigger_set_updated_at_saved_filters
BEFORE UPDATE ON saved_filters
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();


-- Create Search History table
CREATE TABLE search_history(
    search_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    origin VARCHAR(3) NOT NULL,
    destination VARCHAR(3) NOT NULL,
    departure_date DATE NOT NULL,
    return_date DATE,
    trip_type TEXT NOT NULL, -- "one-way", "round-trip"
    adults SMALLINT NOT NULL,
    children SMALLINT NOT NULL,
    infants SMALLINT NOT NULL,
    
    filters JSONB, -- optional: class, stops, airline preferences, etc.
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,

    -- Foreign Key Constraint
    CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);


-- INDEXES indexes for search heavy fields and reduce full table scans

-- Flight table - users common searches: origin, destination, and departure
    CREATE INDEX idx_flights_origin ON  flights(origin_id);
    CREATE INDEX idx_flights_destination ON flights(destination_id);
    -- Composite index for origin + destination (common filter combo)
    CREATE INDEX idx_flights_origin_destination ON flights(origin_id,destination_id);
    -- Index for sorting/filtering by departure time
    CREATE INDEX idx_flights_departure_datetime ON flights(departure_datetime);
    -- Optional: Composite for all three
    CREATE INDEX idx_flights_origin_dest_departure ON flights(origin_id, destination_id, departure_datetime);

-- Saved Filters table - users common searches: name
    CREATE INDEX idx_saved_filters_name ON saved_filters(name);

-- Search History table - for measuring search frequency 
    CREATE INDEX idx_search_freq_basic ON search_history (origin, destination, departure_date, return_date, trip_type, created_at);

-- Notes for future scalability
-- Partitioning large tables
    -- search_history, flights, flight_segments could eventually grow large. Partitioning by created_at (monthly) or user_id (hash) is future-proofing.
-- Materialized views or denormalized analytics tables
    -- Precompute frequent aggregations or search results for performance.