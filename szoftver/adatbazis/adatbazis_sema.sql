CREATE TABLE lockers (
    locker_id INT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('be', 'ki') NOT NULL,
);

CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    class VARCHAR(20) NOT NULL,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE locker_access_history (
    access_id INT PRIMARY KEY AUTO_INCREMENT,
    rfid_tag VARCHAR(50) NOT NULL,
    locker_id INT NOT NULL,
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Logolja, mikor nyitották ki a szekrényt
    approved_by INT, -- Annak az azonosítója, aki jóváhagyta a hozzáférést (NULL, ha a rendszer a nap végén nyitódik ki)
    FOREIGN KEY (rfid_tag) REFERENCES students(rfid_tag),
    FOREIGN KEY (locker_id) REFERENCES lockers(locker_id),
    FOREIGN KEY (approved_by) REFERENCES admins(admin_id)
);

CREATE TABLE locker_relationships (
    relationship_id INT PRIMARY KEY AUTO_INCREMENT,
    rfid_tag VARCHAR(50) NOT NULL,
    locker_id INT NOT NULL,
    FOREIGN KEY (rfid_tag) REFERENCES students(rfid_tag),
    FOREIGN KEY (locker_id) REFERENCES lockers(locker_id)
);

CREATE TABLE groups (
    group_id INT PRIMARY KEY AUTO_INCREMENT,
    group_name VARCHAR(255) NOT NULL
);

CREATE TABLE student_groups (
    student_group_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    group_id INT NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (group_id) REFERENCES groups(group_id)
);

CREATE TABLE timetables (
    timetable_id INT PRIMARY KEY AUTO_INCREMENT,
    group_id INT NOT NULL, -- Csoportazonosító, amely jelzi, hogy melyik csoporthoz tartozik az órarend
    admin_id INT NOT NULL,
    day_of_week ENUM('Hetfo', 'Kedd', 'Szerda', 'Csutortok', 'Pentek') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(group_id),
    FOREIGN KEY (admin_id) REFERENCES admins(admin_id)
);

CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL -- Pl. Rendszergazda, Igazgatóhelyettes, Portás
);
