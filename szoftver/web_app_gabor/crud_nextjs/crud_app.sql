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
  `rfid_tag` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `students`
--

INSERT INTO `students` (`student_id`, `full_name`, `class`, `rfid_tag`) VALUES
('OM11111', 'Szalkai-Szabó Ádám', '13.I', 'DA6BD581'),
('OM22222', 'Nagy Gábor', '13.I', '030FC70A'),
('OM33333', 'Bodri Dévid', '12.I', 'F7F59C7A'),
('OM44444', 'Pál Edvin', '12.I', '53D00E3E');

--
-- Indexek a kiírt táblákhoz
--

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