-- PostgreSQL adatbázis inicializálása

-- Táblák létrehozása
CREATE TABLE admins (
    admin_id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL
);

CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    class VARCHAR(20) NOT NULL,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL,
    access VARCHAR(50) NOT NULL
);

CREATE TABLE groups (
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(255) NOT NULL
);

CREATE TABLE student_groups (
    student_group_id SERIAL PRIMARY KEY,
    student_id VARCHAR(20) NOT NULL REFERENCES students (student_id) ON DELETE CASCADE ON UPDATE CASCADE,
    group_id INT NOT NULL REFERENCES groups (group_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE lockers (
    locker_id SERIAL PRIMARY KEY,
    status VARCHAR(10) CHECK (status IN ('be', 'ki')) NOT NULL
);

CREATE TABLE locker_relationships (
    relationship_id SERIAL PRIMARY KEY,
    rfid_tag VARCHAR(50) NOT NULL REFERENCES students (rfid_tag) ON DELETE CASCADE ON UPDATE CASCADE,
    locker_id INT NOT NULL REFERENCES lockers (locker_id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE timetables (
    timetable_id SERIAL PRIMARY KEY,
    group_id INT NOT NULL REFERENCES groups (group_id) ON DELETE CASCADE ON UPDATE CASCADE,
    admin_id INT NOT NULL REFERENCES admins (admin_id) ON DELETE CASCADE ON UPDATE CASCADE,
    day_of_week VARCHAR(10) CHECK (day_of_week IN ('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE system_status (
    id SERIAL PRIMARY KEY,
    status VARCHAR(10) NOT NULL
);

-- Adatok beszúrása
INSERT INTO admins (full_name, password, position) VALUES
('szalkai', 'piciakukija', 'senki'),
('nagy', 'nagyakukija', 'igazgató');

INSERT INTO lockers (locker_id, status) VALUES
(2, 'ki'),
(5, 'ki'),
(6, 'ki'),
(7, 'ki');

INSERT INTO students (student_id, full_name, class, rfid_tag, access) VALUES
('OM11111', 'Szalkai-Szabó Ádám', '13.I', 'DA6BD581', 'nyitva'),
('OM22222', 'Nagy Gábor', '13.I', '030FC70A', 'nyitva'),
('OM33333', 'Bodri Dévid', '12.I', 'F7F59C7A', 'nyitva'),
('OM44444', 'Pál Edvin', '12.I', '53D00E3E', 'zarva');

INSERT INTO locker_relationships (rfid_tag, locker_id) VALUES
('DA6BD581', 2),
('030FC70A', 6),
('F7F59C7A', 7),
('53D00E3E', 5);

INSERT INTO system_status (status) VALUES
('nyitva');

INSERT INTO groups (group_name) VALUES
('Matek'),
('Programozás'),
('Hálózatok'),
('Hittan');

INSERT INTO student_groups (student_id, group_id) VALUES
('OM11111', 1),
('OM22222', 1),
('OM33333', 1),
('OM44444', 1),
('OM11111', 2),
('OM11111', 3),
('OM11111', 4),
('OM22222', 2),
('OM22222', 3),
('OM22222', 4),
('OM33333', 3),
('OM33333', 4),
('OM44444', 4);

INSERT INTO timetables (group_id, admin_id, day_of_week, start_time, end_time) VALUES
(2, 2, 'monday', '07:15', '08:00'),
(2, 2, 'monday', '08:10', '08:55'),
(1, 1, 'monday', '09:05', '09:50'),
(3, 2, 'monday', '10:00', '10:45'),
(4, 1, 'monday', '10:55', '11:40'),
(4, 1, 'monday', '11:50', '12:35'),
(2, 2, 'tuesday', '07:15', '08:00'),
(2, 2, 'tuesday', '08:10', '08:55'),
(1, 1, 'tuesday', '09:05', '09:50'),
(1, 1, 'tuesday', '10:00', '10:45'),
(4, 1, 'tuesday', '10:55', '11:40'),
(4, 1, 'tuesday', '11:50', '12:35'),
(1, 2, 'tuesday', '10:00', '10:45'),
(4, 2, 'tuesday', '10:55', '11:40'),
(2, 2, 'tuesday', '11:50', '12:35'),
(2, 2, 'tuesday', '12:55', '13:40'),
(2, 2, 'tuesday', '11:50', '12:35'),
(2, 2, 'tuesday', '13:45', '14:30'),
(2, 2, 'tuesday', '14:35', '15:20'),
(2, 2, 'wednesday', '07:15', '08:00'),
(2, 2, 'wednesday', '08:10', '08:55'),
(3, 1, 'wednesday', '09:05', '09:50'),
(3, 1, 'wednesday', '10:00', '10:45'),
(1, 1, 'wednesday', '10:55', '11:40'),
(4, 1, 'wednesday', '11:50', '12:35'),
(2, 2, 'thursday', '07:15', '08:00'),
(1, 2, 'thursday', '08:10', '08:55'),
(1, 1, 'thursday', '09:05', '09:50'),
(1, 2, 'thursday', '10:00', '10:45'),
(1, 1, 'thursday', '10:55', '11:40'),
(4, 1, 'thursday', '11:50', '12:35'),
(2, 2, 'friday', '07:15', '08:00'),
(2, 2, 'friday', '08:10', '08:55'),
(2, 1, 'friday', '09:05', '09:50'),
(2, 1, 'friday', '10:00', '10:45'),
(2, 2, 'friday', '10:55', '11:40'),
(4, 1, 'friday', '11:50', '12:35');
