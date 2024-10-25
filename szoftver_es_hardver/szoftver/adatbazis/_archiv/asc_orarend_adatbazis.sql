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
