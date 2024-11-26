CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tábla szerkezet ehhez a táblához `students`
CREATE TABLE `students` (
  `student_id` VARCHAR(20) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `class` VARCHAR(20) NOT NULL,
  `rfid_tag` VARCHAR(50) NOT NULL COLLATE utf8mb4_general_ci,
  `access` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `rfid_tag` (`rfid_tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tábla szerkezet ehhez a táblához `groups`
CREATE TABLE `groups` (
  `group_id` INT NOT NULL AUTO_INCREMENT,
  `group_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tábla szerkezet ehhez a táblához `student_groups`
CREATE TABLE `student_groups` (
  `student_group_id` INT NOT NULL AUTO_INCREMENT,
  `student_id` VARCHAR(20) NOT NULL,
  `group_id` INT NOT NULL,
  PRIMARY KEY (`student_group_id`),
  FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tábla szerkezet ehhez a táblához `lockers`
CREATE TABLE `lockers` (
  `locker_id` INT NOT NULL AUTO_INCREMENT,
  `status` ENUM('be', 'ki') NOT NULL,
  PRIMARY KEY (`locker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Tábla szerkezet ehhez a táblához `locker_relationships`
CREATE TABLE `locker_relationships` (
  `relationship_id` INT NOT NULL AUTO_INCREMENT,
  `rfid_tag` VARCHAR(50) NOT NULL COLLATE utf8mb4_general_ci,
  `locker_id` INT NOT NULL,
  PRIMARY KEY (`relationship_id`),
  FOREIGN KEY (`rfid_tag`) REFERENCES `students` (`rfid_tag`),
  FOREIGN KEY (`locker_id`) REFERENCES `lockers` (`locker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `admins`
ADD PRIMARY KEY (`admin_id`);

-- Tábla szerkezet ehhez a táblához `timetables`
CREATE TABLE `timetables` (
  `timetable_id` INT NOT NULL AUTO_INCREMENT,
  `group_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `day_of_week` ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  PRIMARY KEY (`timetable_id`),
  FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `system_status` (
  `id` int(11) NOT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;








INSERT INTO `admins` (`admin_id`, `full_name`, `password`, `position`) VALUES
(1, 'szalkai', 'piciakukija', 'senki'),
(2, 'nagy', 'nagyakukija', 'igazgató');


INSERT INTO `lockers` (`locker_id`, `status`) VALUES
(2, 'ki'),
(5, 'ki'),
(6, 'ki'),
(7, 'ki');


INSERT INTO `students` (`student_id`, `full_name`, `class`, `rfid_tag`,`access`) VALUES
('OM11111', 'Szalkai-Szabó Ádám', '13.I', 'DA6BD581', 'nyithato'),
('OM22222', 'Nagy Gábor', '13.I', '030FC70A', 'nyithato'),
('OM33333', 'Bodri Dévid', '12.I', 'F7F59C7A', 'nyithato'),
('OM44444', 'Pál Edvin', '12.I', '53D00E3E', 'zarva');


INSERT INTO `locker_relationships` (`relationship_id`, `rfid_tag`, `locker_id`) VALUES
(1, 'DA6BD581', 2),
(2, '030FC70A', 6),
(3, 'F7F59C7A', 7),
(4, '53D00E3E', 5);


INSERT INTO `system_status` (`id`, `status`) VALUES
(1, 'nyitva');


INSERT INTO `groups` ( `group_name`) VALUES
('Matek'),
('Programozás'),
('Hálózatok'),
('Hittan');


INSERT INTO `student_groups` (`student_id`, `group_id`) VALUES
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


INSERT INTO `timetables` (`group_id`, `admin_id`, `day_of_week`, `start_time`, `end_time`) VALUES
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


