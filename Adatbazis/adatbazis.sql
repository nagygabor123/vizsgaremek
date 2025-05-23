CREATE TABLE schools (
  school_id SERIAL PRIMARY KEY,
  school_name VARCHAR(255) NOT NULL UNIQUE,
  status VARCHAR(10) NOT NULL
);

CREATE TABLE admins (
  admin_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  osztalyfonok VARCHAR(255) NOT NULL,
  short_name VARCHAR(8) NOT NULL,
  school_id INT NOT NULL,
  FOREIGN KEY (school_id) REFERENCES schools (school_id) ON DELETE CASCADE
);

CREATE TABLE students (
  student_id VARCHAR(20) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  class VARCHAR(255) NOT NULL,
  rfid_tag VARCHAR(50) UNIQUE NOT NULL,
  access VARCHAR(50) NOT NULL,
  school_id INT NOT NULL,
  FOREIGN KEY (school_id) REFERENCES schools (school_id) ON DELETE CASCADE
);

CREATE TABLE lockers (
  locker_id SERIAL PRIMARY KEY,
  status TEXT CHECK (status IN ('be', 'ki')) NOT NULL
);

CREATE TABLE locker_relationships (
  relationship_id SERIAL PRIMARY KEY,
  rfid_tag VARCHAR(50) NOT NULL,
  locker_id INT NOT NULL,
  FOREIGN KEY (rfid_tag) REFERENCES students (rfid_tag) ON DELETE CASCADE,
  FOREIGN KEY (locker_id) REFERENCES lockers (locker_id) ON DELETE CASCADE
);

CREATE TABLE csoportok (
  group_id SERIAL PRIMARY KEY,
  group_name VARCHAR(255) NOT NULL,
  school_id INT NOT NULL,
  FOREIGN KEY (school_id) REFERENCES schools (school_id) ON DELETE CASCADE
);

CREATE TABLE student_groups (
  student_group_id SERIAL PRIMARY KEY,
  student_id VARCHAR(20) NOT NULL,
  group_id INT NOT NULL,
  FOREIGN KEY (student_id) REFERENCES students (student_id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES csoportok (group_id) ON DELETE CASCADE
);

CREATE TABLE timetables (
  timetable_id SERIAL PRIMARY KEY,
  admin_id INT NOT NULL,
  group_name VARCHAR(255) NOT NULL,
  day_of_week TEXT CHECK (day_of_week IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday')) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  school_id INT NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins (admin_id) ON DELETE CASCADE,
  FOREIGN KEY (school_id) REFERENCES schools (school_id) ON DELETE CASCADE
);

CREATE TABLE group_relations (
  relation_id SERIAL PRIMARY KEY,
  timetable_id INT NOT NULL,
  group_id INT NOT NULL,
  FOREIGN KEY (timetable_id) REFERENCES timetables (timetable_id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES csoportok (group_id) ON DELETE CASCADE
);

CREATE TABLE year_schedule (
  year_schedule_id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  nev VARCHAR(255) NOT NULL,
  which_day DATE NOT NULL,
  replace_day VARCHAR(255) NOT NULL,
  school_id INT NOT NULL,
  FOREIGN KEY (school_id) REFERENCES schools (school_id) ON DELETE CASCADE
);

CREATE TABLE ring_times (
  id SERIAL PRIMARY KEY,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  school_id INT NOT NULL,
  FOREIGN KEY (school_id) REFERENCES schools (school_id) ON DELETE CASCADE
);

INSERT INTO schools (school_name,status) VALUES
('Kiskunfélegyházi Szent Benedek PG Középiskola', 'zarva'),
('Constantinum Katolikus Óvoda, Általános Iskola, Gimnázium, Technikum, Kollégium', 'zarva'),
('Móra Ferenc Gimnázium', 'nyithato');



INSERT INTO admins (full_name, password, position, osztalyfonok, short_name, school_id) VALUES
('Admin Pg', '$2b$10$J1PxYeg5TgGiNiW8ktiIG.deNCMVUaKQBt72.JEPjRABoJ1QSMZa.', 'rendszergazda', 'nincs', 'AdPg', 1),
('Admin Consti', '$2b$10$J1PxYeg5TgGiNiW8ktiIG.deNCMVUaKQBt72.JEPjRABoJ1QSMZa.', 'rendszergazda', 'nincs', 'AdCo', 2),
('Admin Mora', '$2b$10$J1PxYeg5TgGiNiW8ktiIG.deNCMVUaKQBt72.JEPjRABoJ1QSMZa.', 'rendszergazda', 'nincs', 'AdMo', 3);


INSERT INTO year_schedule (type, nev, which_day, replace_day, school_id) VALUES
('kezd', 'Tanévkezdés', '2024-09-02', '', 1),
('veg', 'Tanévzárás', '2025-06-13', '', 1),
('kezd', 'Tanévkezdés', '2024-09-02', '', 2),
('veg', 'Tanévzárás', '2025-06-13', '', 2),
('kezd', 'Tanévkezdés', '2024-09-02', '', 3),
('veg', 'Tanévzárás', '2025-06-13', '', 3);
