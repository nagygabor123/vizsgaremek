INSERT INTO lockers (status, can_be_opened) VALUES
('closed', FALSE), ('closed', TRUE), ('open', FALSE), ('closed', FALSE), ('open', TRUE),
('closed', TRUE), ('open', FALSE), ('closed', FALSE), ('open', TRUE), ('closed', TRUE),
('closed', FALSE), ('open', FALSE), ('closed', TRUE), ('open', TRUE), ('closed', FALSE),
('open', TRUE), ('closed', FALSE), ('closed', TRUE), ('open', FALSE), ('closed', TRUE);

INSERT INTO students (student_id, full_name, class, birth_place, birth_date, rfid_tag) VALUES
('STU001', 'Kovács Péter', '12A', 'Budapest', '2006-04-15', 'RFID001'),
('STU002', 'Nagy László', '11B', 'Debrecen', '2007-02-20', 'RFID002'),
('STU003', 'Tóth Anna', '10C', 'Szeged', '2008-05-10', 'RFID003'),
('STU004', 'Fekete Márta', '9A', 'Győr', '2009-06-11', 'RFID004'),
('STU005', 'Kiss Lili', '12B', 'Miskolc', '2006-01-25', 'RFID005'),
('STU006', 'Horváth Zsolt', '10A', 'Pécs', '2008-09-14', 'RFID006'),
('STU007', 'Molnár László', '11C', 'Budapest', '2007-12-30', 'RFID007'),
('STU008', 'Papp Eszter', '9B', 'Kecskemét', '2009-11-17', 'RFID008'),
('STU009', 'Szabó Dávid', '12C', 'Sopron', '2006-07-23', 'RFID009'),
('STU010', 'Jakab Sándor', '11A', 'Eger', '2007-03-11', 'RFID010'),
('STU011', 'Varga Ilona', '10B', 'Nyíregyháza', '2008-04-22', 'RFID011'),
('STU012', 'Bíró Attila', '9C', 'Budapest', '2009-08-05', 'RFID012'),
('STU013', 'Kerekes Ákos', '12A', 'Tatabánya', '2006-09-07', 'RFID013'),
('STU014', 'Balogh József', '11B', 'Zalaegerszeg', '2007-10-15', 'RFID014'),
('STU015', 'Szalai Tünde', '10C', 'Veszprém', '2008-12-24', 'RFID015'),
('STU016', 'Vörös Enikő', '9A', 'Dunaújváros', '2009-02-05', 'RFID016'),
('STU017', 'Mészáros Károly', '12B', 'Kaposvár', '2006-03-19', 'RFID017'),
('STU018', 'Halász Márk', '10A', 'Székesfehérvár', '2008-06-28', 'RFID018'),
('STU019', 'Kiss Gábor', '11C', 'Szeged', '2007-11-22', 'RFID019'),
('STU020', 'Németh Lilla', '9B', 'Győr', '2009-07-12', 'RFID020');

INSERT INTO locker_access_history (rfid_tag, locker_id, access_time, approved_by) VALUES
('RFID001', 1, '2024-09-01 08:30:00', 1),
('RFID002', 2, '2024-09-01 08:35:00', 2),
('RFID003', 3, '2024-09-01 08:40:00', NULL),
('RFID004', 4, '2024-09-01 08:45:00', 3),
('RFID005', 5, '2024-09-01 08:50:00', NULL),
('RFID006', 6, '2024-09-01 08:55:00', 4),
('RFID007', 7, '2024-09-01 09:00:00', 1),
('RFID008', 8, '2024-09-01 09:05:00', 2),
('RFID009', 9, '2024-09-01 09:10:00', NULL),
('RFID010', 10, '2024-09-01 09:15:00', 3),
('RFID011', 11, '2024-09-01 09:20:00', 4),
('RFID012', 12, '2024-09-01 09:25:00', NULL),
('RFID013', 13, '2024-09-01 09:30:00', 1),
('RFID014', 14, '2024-09-01 09:35:00', 2),
('RFID015', 15, '2024-09-01 09:40:00', NULL),
('RFID016', 16, '2024-09-01 09:45:00', 3),
('RFID017', 17, '2024-09-01 09:50:00', 4),
('RFID018', 18, '2024-09-01 09:55:00', NULL),
('RFID019', 19, '2024-09-01 10:00:00', 1),
('RFID020', 20, '2024-09-01 10:05:00', 2);

INSERT INTO locker_relationships (rfid_tag, locker_id) VALUES
('RFID001', 1), ('RFID002', 2), ('RFID003', 3), ('RFID004', 4), ('RFID005', 5),
('RFID006', 6), ('RFID007', 7), ('RFID008', 8), ('RFID009', 9), ('RFID010', 10),
('RFID011', 11), ('RFID012', 12), ('RFID013', 13), ('RFID014', 14), ('RFID015', 15),
('RFID016', 16), ('RFID017', 17), ('RFID018', 18), ('RFID019', 19), ('RFID020', 20);

INSERT INTO subjects (subject_name, teacher_name) VALUES
('Matematika', 'Kiss László'), ('Fizika', 'Nagy Ágnes'), ('Kémia', 'Tóth Zoltán'), 
('Biológia', 'Horváth Éva'), ('Történelem', 'Szabó Péter'), ('Földrajz', 'Jakab Judit'),
('Angol', 'Kovács Márta'), ('Német', 'Varga Krisztián'), ('Francia', 'Molnár István'), 
('Spanyol', 'Németh Gergő'), ('Olasz', 'Balogh Enikő'), ('Informatika', 'Fekete Tamás'),
('Rajz', 'Papp Gyula'), ('Ének', 'Bíró Ilona'), ('Testnevelés', 'Vörös Erika'), 
('Etika', 'Halász Márton'), ('Filozófia', 'Szalai Réka'), ('Irodalom', 'Mészáros Gábor'),
('Magyar', 'Nagy Nóra'), ('Társadalomismeret', 'Kerekes Attila');

INSERT INTO timetables (student_id, subject_id, day_of_week, start_time, end_time) VALUES
('STU001', 1, 'Monday', '08:00:00', '09:00:00'), ('STU002', 2, 'Tuesday', '09:00:00', '10:00:00'),
('STU003', 3, 'Wednesday', '10:00:00', '11:00:00'), ('STU004', 4, 'Thursday', '11:00:00', '12:00:00'),
('STU005', 5, 'Friday', '12:00:00', '13:00:00'), ('STU006', 6, 'Monday', '08:00:00', '09:00:00'),
('STU007', 7, 'Tuesday', '09:00:00', '10:00:00'), ('STU008', 8, 'Wednesday', '10:00:00', '11:00:00'),
('STU009', 9, 'Thursday', '11:00:00', '12:00:00'), ('STU010', 10, 'Friday', '12:00:00', '13:00:00'),
('STU011', 11, 'Monday', '08:00:00', '09:00:00'), ('STU012', 12, 'Tuesday', '09:00:00', '10:00:00'),
('STU013', 13, 'Wednesday', '10:00:00', '11:00:00'), ('STU014', 14, 'Thursday', '11:00:00', '12:00:00'),
('STU015', 15, 'Friday', '12:00:00', '13:00:00'), ('STU016', 16, 'Monday', '08:00:00', '09:00:00'),
('STU017', 17, 'Tuesday', '09:00:00', '10:00:00'), ('STU018', 18, 'Wednesday', '10:00:00', '11:00:00'),
('STU019', 19, 'Thursday', '11:00:00', '12:00:00'), ('STU020', 20, 'Friday', '12:00:00', '13:00:00');

INSERT INTO admins (full_name, position) VALUES
('Nagy Judit', 'Igazgató'), ('Fekete Tamás', 'Tanár'), ('Kiss László', 'Portás'),
('Tóth Zoltán', 'Tanár'), ('Kovács Anna', 'Igazgatóhelyettes'), ('Szabó Péter', 'Portás'),
('Horváth Éva', 'Tanár'), ('Varga Krisztián', 'Tanár'), ('Molnár István', 'Portás'),
('Németh Gergő', 'Tanár'), ('Balogh Enikő', 'Tanár'), ('Fekete Márton', 'Portás'),
('Bíró Ilona', 'Tanár'), ('Vörös Erika', 'Tanár'), ('Halász Márton', 'Tanár'),
('Szalai Réka', 'Portás'), ('Mészáros Gábor', 'Tanár'), ('Kerekes Attila', 'Tanár'),
('Jakab Judit', 'Portás'), ('Tóth Márton', 'Tanár');
