CREATE TABLE IF NOT EXISTS t_p9677434_entrepreneur_investo.users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(30) UNIQUE,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS t_p9677434_entrepreneur_investo.otp_codes (
  id SERIAL PRIMARY KEY,
  contact VARCHAR(255) NOT NULL,
  code VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_otp_contact ON t_p9677434_entrepreneur_investo.otp_codes(contact);
