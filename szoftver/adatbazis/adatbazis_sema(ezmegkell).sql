CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL,
  `osztalyfonok` varchar(255) NOT NULL,
  `short_name` VARCHAR(8) NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `students` (
  `student_id` VARCHAR(20) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `class` VARCHAR(255) NOT NULL,
  `rfid_tag` VARCHAR(50) NOT NULL COLLATE utf8mb4_general_ci,
  `access` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`student_id`),
  UNIQUE KEY `rfid_tag` (`rfid_tag`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `groups` (
  `group_id` INT NOT NULL AUTO_INCREMENT,
  `group_name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `student_groups` (
  `student_group_id` INT NOT NULL AUTO_INCREMENT,
  `student_id` VARCHAR(20) NOT NULL,
  `group_id` INT NOT NULL,
  PRIMARY KEY (`student_group_id`),
  FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `lockers` (
  `locker_id` INT NOT NULL AUTO_INCREMENT,
  `status` ENUM('be', 'ki') NOT NULL,
  PRIMARY KEY (`locker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `locker_relationships` (
  `relationship_id` INT NOT NULL AUTO_INCREMENT,
  `rfid_tag` VARCHAR(50) NOT NULL COLLATE utf8mb4_general_ci,
  `locker_id` INT NOT NULL,
  PRIMARY KEY (`relationship_id`),
  FOREIGN KEY (`rfid_tag`) REFERENCES `students` (`rfid_tag`),
  FOREIGN KEY (`locker_id`) REFERENCES `lockers` (`locker_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `timetables` (
  `timetable_id` INT NOT NULL AUTO_INCREMENT,
  `group_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `group_name` VARCHAR(255) NOT NULL,
  `day_of_week` ENUM('sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  PRIMARY KEY (`timetable_id`),
  FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `system_status` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `status` varchar(10) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `year_schedule` (
    `year_schedule_id` INT AUTO_INCREMENT PRIMARY KEY,
    `type` VARCHAR(255) NOT NULL,
    `nev` VARCHAR(255) NOT NULL,
    `which_day` VARCHAR(255) NOT NULL,
    `replace_day` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `ring_times` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `start_time` TIME NOT NULL,
    `end_time` TIME NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;








INSERT INTO `admins` (`admin_id`, `full_name`, `password`, `position`,`osztalyfonok`,`short_name`) VALUES
(1, 'szalkai', 'piciakukija', 'senki','nincs','SSSS'),
(2, 'nagy', 'nagyakukija', 'igazgató','nincs','GGGG');


INSERT INTO `lockers` (`locker_id`, `status`) VALUES
(2, 'ki'),
(5, 'ki'),
(6, 'ki'),
(7, 'ki');


INSERT INTO `students` (`student_id`, `full_name`, `class`, `rfid_tag`,`access`) VALUES
('OM11111', 'Szalkai-Szabó Ádám', '13.I,13.I-S,13.I-A1', 'DA6BD581', 'nyithato'),
('OM22222', 'Nagy Gábor', '13.I,13.I-I,13.I-A1', '030FC70A', 'nyithato'),
('OM33333', 'Bodri Dévid', '12.I,12.I-A2,12.I-H1', 'F7F59C7A', 'nyithato'),
('OM44444', 'Pál Edvin', '12.I,12.I-A2,12.I-H1', '53D00E3E', 'zarva');


INSERT INTO `locker_relationships` (`relationship_id`, `rfid_tag`, `locker_id`) VALUES
(1, 'DA6BD581', 2),
(2, '030FC70A', 6),
(3, 'F7F59C7A', 7),
(4, '53D00E3E', 5);


INSERT INTO `system_status` (`id`, `status`) VALUES
(1, 'nyitva');




INSERT INTO year_schedule (type, nev, which_day, replace_day) VALUES
('kezd', 'Tanévkezdés', '2024-09-02', ''),
('veg', 'Tanévzárás', '2025-06-20', ''),
('szunet', 'Karácsonyi szünet', '2024-12-24', '2025-01-05'),
('plusznap', 'Szombati tanítás', '2024-12-21', 'monday'),
('plusznap', 'Szombati tanítás', '2025-02-01', 'monday'),
('tanitasnelkul', 'Tanítás nélküli nap', '2025-02-25', '2025-02-26');



