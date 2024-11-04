-- Globals table
CREATE TABLE globals (
    id SERIAL PRIMARY KEY,
    name TEXT,
    short TEXT,
    customfield1 TEXT,
    customfield2 TEXT
);

-- Teachers table
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    name TEXT,
    short TEXT,
    customfield1 TEXT,
    customfield2 TEXT,
    gender CHAR(1), -- 'M' for male, 'F' for female
    color VARCHAR(7), -- HTML color code
    email TEXT,
    mobile TEXT,
    timeoff TEXT,
    subjectids TEXT, -- comma-separated list of IDs
    htmlexportlink TEXT,
    ascttorder INT
);

-- Classes table
CREATE TABLE classes (
    id SERIAL PRIMARY KEY,
    name TEXT,
    short TEXT,
    customfield1 TEXT,
    customfield2 TEXT,
    teacherid INT REFERENCES teachers(id),
    classroomids TEXT, -- comma-separated list of classroom IDs
    timeoff TEXT,
    classlevel TEXT, -- deprecated
    grade INT, -- upcoming feature
    gradeid INT, -- references grade table
    htmlexportlink TEXT,
    ascttorder INT
);

-- Classrooms table
CREATE TABLE classrooms (
    id SERIAL PRIMARY KEY,
    name TEXT,
    short TEXT,
    customfield1 TEXT,
    customfield2 TEXT,
    capacity INT, -- or special value '*'
    timeoff TEXT,
    htmlexportlink TEXT,
    ascttorder INT,
    buildingid INT -- reference to buildings table, if exists
);

-- Subjects table
CREATE TABLE subjects (
    id SERIAL PRIMARY KEY,
    name TEXT,
    short TEXT,
    customfield1 TEXT,
    customfield2 TEXT,
    timeoff TEXT,
    ascttorder INT
);

-- Students table
CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    firstname TEXT,
    lastname TEXT,
    number TEXT,
    customfield1 TEXT,
    customfield2 TEXT,
    gender CHAR(1), -- 'M' for male, 'F' for female
    classid INT REFERENCES classes(id),
    groupids TEXT, -- comma-separated list of group IDs
    groupnames TEXT, -- comma-separated list of group names
    email TEXT,
    mobile TEXT
);

-- StudentSubjects table
CREATE TABLE studentsubjects (
    studentid INT REFERENCES students(id),
    subjectid INT REFERENCES subjects(id),
    seminargroup INT,
    seminargrouptermoverride TEXT, -- comma-separated list
    importance VARCHAR(20), -- 'low', 'normal', 'high', etc.
    alternatefor INT, -- references another subject ID
    locked CHAR(1) -- '0' for unlocked, '1' for locked
);

-- Groups table
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    classid INT REFERENCES classes(id),
    classids TEXT, -- comma-separated list of class IDs for GROUPSTYPE2
    name TEXT,
    entireclass CHAR(1), -- '1' for entire class, '0' for partial
    divisiontag TEXT,
    ascttdivision TEXT,
    studentcount INT
);

-- Lessons table
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    subjectid INT REFERENCES subjects(id),
    groupids TEXT, -- comma-separated list for GROUPSTYPE1
    groupid INT, -- for GROUPSTYPE2
    classids TEXT, -- comma-separated list of class IDs
    classid INT REFERENCES classes(id), -- use instead of classids
    divisiontag TEXT,
    teacherids TEXT, -- comma-separated list of teacher IDs
    teacherid INT REFERENCES teachers(id), -- use instead of teacherids
    studentids TEXT, -- comma-separated list of student IDs
    classroomids TEXT, -- comma-separated list of classroom IDs
    periodsperweek FLOAT,
    durationperiods INT,
    terms INT, -- bitfield
    weeks INT, -- bitfield
    days INT, -- bitfield
    capacity INT, -- or special '*'
    seminartag CHAR(1), -- '1' for seminar, blank otherwise
    locked CHAR(1) -- '1' for locked, '0' for unlocked
);

-- Cards table
CREATE TABLE cards (
    id SERIAL PRIMARY KEY,
    lessonid INT REFERENCES lessons(id),
    subjectid INT REFERENCES subjects(id),
    classids TEXT, -- comma-separated list of class IDs
    groupids TEXT, -- comma-separated list of group IDs
    teacherids TEXT, -- comma-separated list of teacher IDs
    studentids TEXT, -- comma-separated list of student IDs
    classroomids TEXT, -- comma-separated list of classroom IDs
    day INT,
    period INT,
    durationperiods INT,
    locked CHAR(1) -- '0' for unlocked, '1' for locked
);

-- Days table
CREATE TABLE days (
    day INT PRIMARY KEY,
    short TEXT,
    name TEXT
);

-- Periods table
CREATE TABLE periods (
    period INT PRIMARY KEY,
    name TEXT,
    short TEXT,
    starttime TIME,
    endtime TIME
);

-- TermsDefs table
CREATE TABLE termsdefs (
    id SERIAL PRIMARY KEY,
    terms INT, -- bitfield list
    name TEXT,
    short TEXT
);

-- WeeksDefs table
CREATE TABLE weeksdefs (
    id SERIAL PRIMARY KEY,
    weeks INT, -- bitfield list
    name TEXT,
    short TEXT
);

-- Grades table
CREATE TABLE grades (
    id SERIAL PRIMARY KEY,
    name TEXT,
    short TEXT,
    grade INT
);

-- ClassSubjects table
CREATE TABLE classsubjects (
    classid INT REFERENCES classes(id),
    subjectid INT REFERENCES subjects(id),
    teacherid INT REFERENCES teachers(id),
    seminartag CHAR(1), -- '1' for seminar, blank otherwise
    periodsperweek FLOAT
);

-- GroupSubjects table
CREATE TABLE groupsubjects (
    classids TEXT, -- comma-separated list of class IDs
    groupids TEXT, -- comma-separated list of group IDs
    subjectid INT REFERENCES subjects(id),
    teacherids TEXT, -- comma-separated list of teacher IDs
    periodsperweek FLOAT,
    studentids TEXT, -- comma-separated list of student IDs
    studentcount INT,
    entireclass CHAR(1), -- '1' for entire class, blank otherwise
    positions TEXT, -- export positions as day:period, day:period
    classlevel TEXT,
    classroomids TEXT, -- comma-separated list of classroom IDs
    divisiontag TEXT
);


-- Globals adatok
INSERT INTO globals (name, short, customfield1, customfield2)
VALUES
    ('Iskola neve', 'IN', 'Mező1', 'Mező2'),
    ('Félév', 'FE', 'Mező1', 'Mező2');

-- Teachers adatok
INSERT INTO teachers (name, short, customfield1, customfield2, gender, color, email, mobile, timeoff, subjectids, htmlexportlink, ascttorder)
VALUES
    ('Kiss János', 'KJ', 'Mező1', 'Mező2', 'M', '#FF5733', 'janos.kiss@example.com', '+36301234567', 'Nyári szünet', '1,2', 'http://export-link.com', 1),
    ('Nagy Anna', 'NA', 'Mező1', 'Mező2', 'F', '#33FF57', 'anna.nagy@example.com', '+36309876543', 'Téli szünet', '3,4', 'http://export-link.com', 2);

-- Classes adatok
INSERT INTO classes (name, short, customfield1, customfield2, teacherid, classroomids, timeoff, classlevel, grade, gradeid, htmlexportlink, ascttorder)
VALUES
    ('Matematika 101', 'M101', 'Mező1', 'Mező2', 1, '1,2', 'Tavaszi szünet', 'Szint 1', 10, 1, 'http://export-link.com', 1),
    ('Biológia 102', 'B102', 'Mező1', 'Mező2', 2, '3,4', 'Őszi szünet', 'Szint 2', 11, 2, 'http://export-link.com', 2);

-- Classrooms adatok
INSERT INTO classrooms (name, short, customfield1, customfield2, capacity, timeoff, htmlexportlink, ascttorder, buildingid)
VALUES
    ('A terem', 'A', 'Mező1', 'Mező2', 30, 'Hétvége', 'http://export-link.com', 1, 1),
    ('B terem', 'B', 'Mező1', 'Mező2', '*', 'Ünnepnap', 'http://export-link.com', 2, 2);

-- Subjects adatok
INSERT INTO subjects (name, short, customfield1, customfield2, timeoff, ascttorder)
VALUES
    ('Matematika', 'Matek', 'Mező1', 'Mező2', 'Nyár', 1),
    ('Biológia', 'Bio', 'Mező1', 'Mező2', 'Tél', 2);

-- Students adatok
INSERT INTO students (firstname, lastname, number, customfield1, customfield2, gender, classid, groupids, groupnames, email, mobile)
VALUES
    ('Erika', 'Szabó', '12345', 'Mező1', 'Mező2', 'F', 1, '1,2', 'A csoport, B csoport', 'erika.szabo@example.com', '+36301231234'),
    ('István', 'Kovács', '67890', 'Mező1', 'Mező2', 'M', 2, '3,4', 'C csoport, D csoport', 'istvan.kovacs@example.com', '+36309876543');

-- Studentsubjects adatok
INSERT INTO studentsubjects (studentid, subjectid, seminargroup, seminargrouptermoverride, importance, alternatefor, locked)
VALUES
    (1, 1, 1, 'Felülírás1,Felülírás2', 'magas', NULL, '0'),
    (2, 2, 2, 'Felülírás3', 'normál', NULL, '1');

-- Groups adatok
INSERT INTO groups (classid, classids, name, entireclass, divisiontag, ascttdivision, studentcount)
VALUES
    (1, '1,2', 'A csoport', '1', 'Div A', 'OsztTag1', 20),
    (2, '3,4', 'B csoport', '0', 'Div B', 'OsztTag2', 15);

-- Lessons adatok
INSERT INTO lessons (subjectid, groupids, groupid, classids, classid, divisiontag, teacherids, teacherid, studentids, classroomids, periodsperweek, durationperiods, terms, weeks, days, capacity, seminartag, locked)
VALUES
    (1, '1,2', 1, '1,2', 1, 'Tag1', '1,2', 1, '1,2', '1,2', 5.5, 1, 3, 15, 7, 30, '1', '0'),
    (2, '3,4', 2, '3,4', 2, 'Tag2', '3,4', 2, '3,4', '3,4', 4.0, 2, 5, 10, 5, '*', '0', '1');

-- Cards adatok
INSERT INTO cards (lessonid, subjectid, classids, groupids, teacherids, studentids, classroomids, day, period, durationperiods, locked)
VALUES
    (1, 1, '1,2', '1,2', '1,2', '1,2', '1,2', 1, 1, 1, '0'),
    (2, 2, '3,4', '3,4', '3,4', '3,4', '3,4', 2, 2, 2, '1');

-- Days adatok
INSERT INTO days (day, short, name)
VALUES
    (1, 'H', 'Hétfő'),
    (2, 'K', 'Kedd');

-- Periods adatok
INSERT INTO periods (period, name, short, starttime, endtime)
VALUES
    (1, '1. óra', '1', '08:00:00', '08:45:00'),
    (2, '2. óra', '2', '08:50:00', '09:35:00');

-- TermsDefs adatok
INSERT INTO termsdefs (terms, name, short)
VALUES
    (3, 'Első félév', 'EF'),
    (5, 'Második félév', 'MF');

-- WeeksDefs adatok
INSERT INTO weeksdefs (weeks, name, short)
VALUES
    (15, '1-15. hét', 'H1-15'),
    (30, '16-30. hét', 'H16-30');

-- Grades adatok
INSERT INTO grades (name, short, grade)
VALUES
    ('10. évfolyam', '10E', 10),
    ('11. évfolyam', '11E', 11);

-- ClassSubjects adatok
INSERT INTO classsubjects (classid, subjectid, teacherid, seminartag, periodsperweek)
VALUES
    (1, 1, 1, '1', 3.5),
    (2, 2, 2, NULL, 4.0);

-- GroupSubjects adatok
INSERT INTO groupsubjects (classids, groupids, subjectid, teacherids, periodsperweek, studentids, studentcount, entireclass, positions, classlevel, classroomids, divisiontag)
VALUES
    ('1,2', '1,2', 1, '1,2', 2.5, '1,2', 10, '1', '1:1,2:2', 'Szint 1', '1,2', 'Div1'),
    ('3,4', '3,4', 2, '3,4', 3.0, '3,4', 15, '0', '3:3,4:4', 'Szint 2', '3,4', 'Div2');
