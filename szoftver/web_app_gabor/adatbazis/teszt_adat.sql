INSERT INTO `lockers` (`locker_id`, `status`) VALUES
(2, 'ki'),-- Szalkai-Szabó Ádám
(5, 'ki'),-- Pál Edvin
(6, 'ki'),-- Nagy Gábor
(7, 'ki');-- Bodri Dévid


INSERT INTO `students` (`student_id`, `full_name`, `class`, `rfid_tag`) VALUES
('OM11111','Szalkai-Szabó Ádám','13.I', 'DA6BD581'),
('OM22222','Nagy Gábor', '13.I','030FC70A'),
('OM33333','Bodri Dévid', '12.I','F7F59C7A'),
('OM44444','Pál Edvin', '12.I','53D00E3E');


INSERT INTO `locker_relationships` (`relationship_id`, `rfid_tag`, `locker_id`) VALUES
(1, 'DA6BD581', 2),
(2, '030FC70A', 6),
(3, 'F7F59C7A', 7),
(4, '53D00E3E', 5);


INSERT INTO `admins` (`admin_id`,`full_name`, `password`,`position`) VALUES
(1,'szalkai', 'piciakukija','senki'),
(2,'nagy', 'nagyakukija','igazgató');
