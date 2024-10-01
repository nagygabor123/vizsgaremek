-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2024. Okt 01. 10:40
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
-- Adatbázis: `rfid_log`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `logs`
--

CREATE TABLE `logs` (
  `id` int(11) NOT NULL,
  `rfid_tag` varchar(255) NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `logs`
--

INSERT INTO `logs` (`id`, `rfid_tag`, `timestamp`) VALUES
(1, 'DA6BD581', '2024-10-01 07:38:43'),
(2, 'DA6BD581', '2024-10-01 07:38:44'),
(3, '030FC70A', '2024-10-01 07:38:48'),
(4, '030FC70A', '2024-10-01 07:38:49'),
(5, '030FC70A', '2024-10-01 07:38:50'),
(6, 'DA6BD581', '2024-10-01 07:39:02'),
(7, 'DA6BD581', '2024-10-01 07:39:04'),
(8, '030FC70A', '2024-10-01 07:39:06'),
(9, '030FC70A', '2024-10-01 07:39:07'),
(10, 'DA6BD581', '2024-10-01 07:39:09'),
(11, 'DA6BD581', '2024-10-01 07:39:13'),
(12, '030FC70A', '2024-10-01 07:39:15'),
(13, 'DA6BD581', '2024-10-01 07:39:16'),
(14, 'DA6BD581', '2024-10-01 07:51:41'),
(15, 'DA6BD581', '2024-10-01 07:51:44'),
(16, 'DA6BD581', '2024-10-01 07:51:46'),
(17, 'DA6BD581', '2024-10-01 07:51:47'),
(18, '030FC70A', '2024-10-01 07:51:49'),
(19, '030FC70A', '2024-10-01 07:51:50'),
(20, 'DA6BD581', '2024-10-01 07:51:56'),
(21, 'DA6BD581', '2024-10-01 07:51:57'),
(22, '030FC70A', '2024-10-01 08:14:44'),
(23, 'DA6BD581', '2024-10-01 08:14:48'),
(24, 'DA6BD581', '2024-10-01 08:15:27'),
(25, 'DA6BD581', '2024-10-01 08:15:32'),
(26, 'DA6BD581', '2024-10-01 08:15:33'),
(27, 'DA6BD581', '2024-10-01 08:15:34'),
(28, 'DA6BD581', '2024-10-01 08:15:35'),
(29, '030FC70A', '2024-10-01 08:18:13'),
(30, '030FC70A', '2024-10-01 08:18:16'),
(31, '030FC70A', '2024-10-01 08:18:20'),
(32, '030FC70A', '2024-10-01 08:18:21'),
(33, 'DA6BD581', '2024-10-01 08:30:08'),
(34, 'DA6BD581', '2024-10-01 08:30:13'),
(35, 'DA6BD581', '2024-10-01 08:30:19'),
(36, 'DA6BD581', '2024-10-01 08:30:20'),
(37, 'DA6BD581', '2024-10-01 08:35:01'),
(38, 'DA6BD581', '2024-10-01 08:35:03'),
(39, 'DA6BD581', '2024-10-01 08:35:10'),
(40, 'DA6BD581', '2024-10-01 08:35:13'),
(41, 'DA6BD581', '2024-10-01 08:35:18'),
(42, 'DA6BD581', '2024-10-01 08:35:20'),
(43, 'DA6BD581', '2024-10-01 08:35:21'),
(44, 'DA6BD581', '2024-10-01 08:35:28'),
(45, 'DA6BD581', '2024-10-01 08:35:29'),
(46, 'DA6BD581', '2024-10-01 08:35:30'),
(47, 'DA6BD581', '2024-10-01 08:37:19'),
(48, 'DA6BD581', '2024-10-01 08:37:20'),
(49, 'DA6BD581', '2024-10-01 08:37:21'),
(50, 'DA6BD581', '2024-10-01 08:37:29'),
(51, '030FC70A', '2024-10-01 08:37:35'),
(52, 'DA6BD581', '2024-10-01 08:37:45'),
(53, 'DA6BD581', '2024-10-01 08:37:46'),
(54, 'DA6BD581', '2024-10-01 08:37:58'),
(55, 'DA6BD581', '2024-10-01 08:38:02'),
(56, '030FC70A', '2024-10-01 08:38:06'),
(57, 'DA6BD581', '2024-10-01 08:38:08'),
(58, '030FC70A', '2024-10-01 08:38:09'),
(59, '030FC70A', '2024-10-01 08:38:16'),
(60, 'DA6BD581', '2024-10-01 08:38:18'),
(61, 'DA6BD581', '2024-10-01 08:38:24'),
(62, '030FC70A', '2024-10-01 08:38:25'),
(63, '030FC70A', '2024-10-01 08:39:13'),
(64, 'DA6BD581', '2024-10-01 08:39:14'),
(65, '030FC70A', '2024-10-01 08:39:20'),
(66, 'DA6BD581', '2024-10-01 08:39:21'),
(67, 'DA6BD581', '2024-10-01 08:39:26'),
(68, '030FC70A', '2024-10-01 08:39:27');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `rfid_azon` varchar(255) NOT NULL,
  `statusz` enum('be','ki','zarva') DEFAULT 'ki'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `student`
--

INSERT INTO `student` (`id`, `nev`, `rfid_azon`, `statusz`) VALUES
(1, 'Szalkai-Szabó Ádám', 'DA6BD581', 'ki'),
(2, 'Nagy Gábor', '030FC70A', 'ki');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `student`
--
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rfid_azon` (`rfid_azon`),
  ADD KEY `idx_rfid_azon` (`rfid_azon`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `logs`
--
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

--
-- AUTO_INCREMENT a táblához `student`
--
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
