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
-- (további adatok)

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `student`
--

CREATE TABLE `student` (
  `id` int(11) NOT NULL,
  `nev` varchar(255) NOT NULL,
  `rfid_azon` varchar(255) NOT NULL,
  `statusz` enum('be','ki','zarva') DEFAULT 'ki',
  `pin` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `student`
--

INSERT INTO `student` (`id`, `nev`, `rfid_azon`, `statusz`,`pin`) VALUES
(1, 'Szalkai-Szabó Ádám', 'DA6BD581', 'ki',4),
(2, 'Nagy Gábor', '030FC70A', 'ki',6);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `admins`
--

CREATE TABLE `admins` (
    `username` VARCHAR(255) NOT NULL,
    `password` VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `admins`
--

INSERT INTO `admins` (`username`, `password`) VALUES
('szalkai', 'piciakukija'),
('nagy', 'nagyakukija');

-- --------------------------------------------------------

--
-- Indexek a kiírt táblákhoz
--

-- A tábla indexei `logs`
ALTER TABLE `logs`
  ADD PRIMARY KEY (`id`);

-- A tábla indexei `student`
ALTER TABLE `student`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `rfid_azon` (`rfid_azon`),
  ADD KEY `idx_rfid_azon` (`rfid_azon`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

-- AUTO_INCREMENT a táblához `logs`
ALTER TABLE `logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=69;

-- AUTO_INCREMENT a táblához `student`
ALTER TABLE `student`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
