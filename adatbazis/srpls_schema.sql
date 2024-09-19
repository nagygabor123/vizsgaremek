-- Create Lockers Table
CREATE TABLE lockers (
    locker_id INT PRIMARY KEY AUTO_INCREMENT,
    status ENUM('open', 'closed') NOT NULL,
    status_changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Students Table
CREATE TABLE students (
    student_id VARCHAR(20) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    class VARCHAR(20) NOT NULL,
    birth_place VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    rfid_tag VARCHAR(50) UNIQUE NOT NULL
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
