-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Nov 13. 18:12
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `crud_app`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admins`
--

CREATE TABLE `admins` (
  `admin_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `position` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `admins`
--

INSERT INTO `admins` (`admin_id`, `full_name`, `password`, `position`) VALUES
(1, 'szalkai', 'piciakukija', 'senki'),
(2, 'nagy', 'nagyakukija', 'igazgató');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lockers`
--

CREATE TABLE `lockers` (
  `locker_id` int(11) NOT NULL,
  `status` enum('be','ki') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `lockers`
--

INSERT INTO `lockers` (`locker_id`, `status`) VALUES
(2, 'ki'),
(5, 'ki'),
(6, 'ki'),
(7, 'ki');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `locker_relationships`
--

CREATE TABLE `locker_relationships` (
  `relationship_id` int(11) NOT NULL,
  `rfid_tag` varchar(50) NOT NULL,
  `locker_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `locker_relationships`
--

INSERT INTO `locker_relationships` (`relationship_id`, `rfid_tag`, `locker_id`) VALUES
(1, 'DA6BD581', 2),
(2, '030FC70A', 6),
(3, 'F7F59C7A', 7),
(4, '53D00E3E', 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `students`
--

CREATE TABLE `students` (
  `student_id` varchar(20) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `class` varchar(20) NOT NULL,
  `rfid_tag` varchar(50) NOT NULL,
  `access` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `students`
--

INSERT INTO `students` (`student_id`, `full_name`, `class`, `rfid_tag`,`access`) VALUES
('OM11111', 'Szalkai-Szabó Ádám', '13.I', 'DA6BD581', 'nyithato'),
('OM22222', 'Nagy Gábor', '13.I', '030FC70A', 'nyithato'),
('OM33333', 'Bodri Dévid', '12.I', 'F7F59C7A', 'nyithato'),
('OM44444', 'Pál Edvin', '12.I', '53D00E3E', 'zarva');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `system_status`
--

CREATE TABLE `system_status` (
  `id` int(11) NOT NULL,
  `status` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `system_status`
--

INSERT INTO `system_status` (`id`, `status`) VALUES
(1, 'nyitva');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `groups`
--

CREATE TABLE `groups` (
  `group_id` INT PRIMARY KEY AUTO_INCREMENT,
  `group_name` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `groups`
--

INSERT INTO `groups` (`group_name`) VALUES
('13.I Mathematics'),
('13.I Physics'),
('12.I Literature'),
('12.I Chemistry');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `student_groups`
--

CREATE TABLE `student_groups` (
  `student_group_id` INT PRIMARY KEY AUTO_INCREMENT,
  `student_id` VARCHAR(20) NOT NULL,
  `group_id` INT NOT NULL,
  FOREIGN KEY (`student_id`) REFERENCES `students` (`student_id`),
  FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `student_groups`
--

INSERT INTO `student_groups` (`student_id`, `group_id`) VALUES
('OM11111', 1),
('OM11111', 2),
('OM22222', 1),
('OM33333', 3),
('OM44444', 4);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `timetables`
--

CREATE TABLE `timetables` (
  `timetable_id` INT PRIMARY KEY AUTO_INCREMENT,
  `group_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `day_of_week` ENUM('Hetfo', 'Kedd', 'Szerda', 'Csutortok', 'Pentek') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`),
  FOREIGN KEY (`admin_id`) REFERENCES `admins` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `timetables`
--

INSERT INTO `timetables` (`group_id`, `admin_id`, `day_of_week`, `start_time`, `end_time`) VALUES
(1, 2, 'Hetfo', '08:00:00', '09:30:00'),
(2, 2, 'Hetfo', '10:00:00', '11:30:00'),
(3, 1, 'Hetfo', '12:00:00', '13:30:00'),
(4, 1, 'Hetfo', '14:00:00', '15:30:00'),
(1, 2, 'Kedd', '08:00:00', '09:30:00'),
(2, 2, 'Kedd', '10:00:00', '11:30:00'),
(3, 1, 'Kedd', '12:00:00', '13:30:00'),
(4, 1, 'Kedd', '14:00:00', '15:30:00'),
(1, 2, 'Szerda', '08:00:00', '09:30:00'),
(2, 2, 'Szerda', '10:00:00', '11:30:00'),
(3, 1, 'Szerda', '12:00:00', '13:30:00'),
(4, 1, 'Szerda', '14:00:00', '15:30:00'),
(1, 2, 'Csutortok', '08:00:00', '09:30:00'),
(2, 2, 'Csutortok', '10:00:00', '11:30:00'),
(3, 1, 'Csutortok', '12:00:00', '13:30:00'),
(4, 1, 'Csutortok', '14:00:00', '15:30:00'),
(1, 2, 'Pentek', '08:00:00', '09:30:00'),
(2, 2, 'Pentek', '10:00:00', '11:30:00'),
(3, 1, 'Pentek', '12:00:00', '13:30:00'),
(4, 1, 'Pentek', '14:00:00', '15:30:00');

-- --------------------------------------------------------


--
-- A tábla indexei `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`admin_id`);

--
-- A tábla indexei `lockers`
--
ALTER TABLE `lockers`
  ADD PRIMARY KEY (`locker_id`);

--
-- A tábla indexei `locker_relationships`
--
ALTER TABLE `locker_relationships`
  ADD PRIMARY KEY (`relationship_id`),
  ADD KEY `rfid_tag` (`rfid_tag`),
  ADD KEY `locker_id` (`locker_id`);

--
-- A tábla indexei `students`
--
ALTER TABLE `students`
  ADD PRIMARY KEY (`student_id`),
  ADD UNIQUE KEY `rfid_tag` (`rfid_tag`);

--
-- A tábla indexei `system_status`
--
ALTER TABLE `system_status`
  ADD PRIMARY KEY (`id`);


--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `admins`
--
ALTER TABLE `admins`
  MODIFY `admin_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `lockers`
--
ALTER TABLE `lockers`
  MODIFY `locker_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `locker_relationships`
--
ALTER TABLE `locker_relationships`
  MODIFY `relationship_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `system_status`
--
ALTER TABLE `system_status`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `locker_relationships`
--
ALTER TABLE `locker_relationships`
  ADD CONSTRAINT `locker_relationships_ibfk_1` FOREIGN KEY (`rfid_tag`) REFERENCES `students` (`rfid_tag`),
  ADD CONSTRAINT `locker_relationships_ibfk_2` FOREIGN KEY (`locker_id`) REFERENCES `lockers` (`locker_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
