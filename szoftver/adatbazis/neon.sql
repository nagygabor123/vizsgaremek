CREATE TABLE admins (
  admin_id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  position VARCHAR(255) NOT NULL,
  osztalyfonok VARCHAR(255) NOT NULL,
  short_name VARCHAR(8) NOT NULL
);

CREATE TABLE students (
  student_id VARCHAR(20) PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  class VARCHAR(255) NOT NULL,
  rfid_tag VARCHAR(50) UNIQUE NOT NULL,
  access VARCHAR(50) NOT NULL,
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
  group_name VARCHAR(255) NOT NULL
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
  day_of_week TEXT CHECK (day_of_week IN ( 'monday', 'tuesday', 'wednesday', 'thursday', 'friday')) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  FOREIGN KEY (admin_id) REFERENCES admins (admin_id) ON DELETE CASCADE
);

CREATE TABLE group_relations (
  relation_id SERIAL PRIMARY KEY,
  timetable_id INT NOT NULL,
  group_id INT NOT NULL,
  FOREIGN KEY (timetable_id) REFERENCES timetables (timetable_id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES csoportok (group_id) ON DELETE CASCADE
);

CREATE TABLE system_status (
  id SERIAL PRIMARY KEY,
  status VARCHAR(10) NOT NULL
);

CREATE TABLE year_schedule (
  year_schedule_id SERIAL PRIMARY KEY,
  type VARCHAR(255) NOT NULL,
  nev VARCHAR(255) NOT NULL,
  which_day DATE NOT NULL,
  replace_day VARCHAR(255) NOT NULL
);

CREATE TABLE ring_times (
  id SERIAL PRIMARY KEY,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL
);

INSERT INTO admins (full_name, password, position, osztalyfonok, short_name) VALUES
('szalkai', 'piciakukija', 'senki', 'nincs', 'SSSS'),
('nagy', 'nagyakukija', 'igazgató', 'nincs', 'GGGG');

INSERT INTO system_status (status) VALUES
('nyithato');

INSERT INTO year_schedule (type, nev, which_day, replace_day) VALUES
('kezd', 'Tanévkezdés', '2024-09-02', ''),
('veg', 'Tanévzárás', '2025-06-20', ''),
('szunet', 'Karácsonyi szünet', '2024-12-24', '2025-01-05'),
('plusznap', 'Szombati tanítás', '2024-12-21', 'monday'),
('plusznap', 'Szombati tanítás', '2025-02-01', 'monday'),
('tanitasnelkul', 'Tanítás nélküli nap', '2025-02-25', '2025-02-26');
