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







