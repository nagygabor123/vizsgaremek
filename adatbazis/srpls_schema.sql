-- Lockers tábla létrehozása
CREATE TABLE lockers (
    locker_id INT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('open', 'closed') NOT NULL,
    can_be_opened BOOLEAN DEFAULT FALSE -- Jelzi, hogy nyitható-e a szekrény, tanári jóváhagyást igényel
);

-- Students tábla létrehozása
CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    class VARCHAR(20) NOT NULL,
    birth_place VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL
);

-- Create Locker Access History Table
CREATE TABLE locker_access_history (
    access_id INT PRIMARY KEY AUTO_INCREMENT,
    rfid_tag VARCHAR(50) NOT NULL,
    locker_id INT NOT NULL,
    access_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Rögzíti, mikor nyitották ki a szekrényt
    approved_by INT, -- Annak az adminnak az azonosítója, aki jóváhagyta a hozzáférést (NULL lehet, ha nem volt szükséges)
    FOREIGN KEY (rfid_tag) REFERENCES students(rfid_tag),
    FOREIGN KEY (locker_id) REFERENCES lockers(locker_id),
    FOREIGN KEY (approved_by) REFERENCES admins(admin_id)
);

-- Create Locker Relationships Table
CREATE TABLE locker_relationships (
    relationship_id INT PRIMARY KEY AUTO_INCREMENT,
    rfid_tag VARCHAR(50) NOT NULL,
    locker_id INT NOT NULL,
    FOREIGN KEY (rfid_tag) REFERENCES students(rfid_tag),
    FOREIGN KEY (locker_id) REFERENCES lockers(locker_id)
);

-- Create Subjects Table
CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(255) NOT NULL,
    teacher_name VARCHAR(255) NOT NULL
);

-- Create Timetables Table
CREATE TABLE timetables (
    timetable_id INT PRIMARY KEY AUTO_INCREMENT,
    student_id VARCHAR(20) NOT NULL,
    subject_id INT NOT NULL,
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday') NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    FOREIGN KEY (student_id) REFERENCES students(student_id),
    FOREIGN KEY (subject_id) REFERENCES subjects(subject_id)
);

-- Create Admins Table (for teachers/staff who can approve locker access)
CREATE TABLE admins (
    admin_id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL -- Pl. 'Tanár', 'Adminisztrátor'
);
