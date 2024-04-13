-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 12 avr. 2024 à 23:54
-- Version du serveur : 8.0.31
-- Version de PHP : 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `employeems`
--

-- --------------------------------------------------------

--
-- Structure de la table `admin`
--

DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(50) NOT NULL,
  `password` varchar(140) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`) VALUES
(1, 'admin@gmail.com', '123456'),
(2, 'admin1@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Structure de la table `category`
--

DROP TABLE IF EXISTS `category`;
CREATE TABLE IF NOT EXISTS `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `category`
--

INSERT INTO `category` (`id`, `name`) VALUES
(1, 'ingenieur'),
(5, 'Developpement IT'),
(4, 'Marketing'),
(6, 'Big Data');

-- --------------------------------------------------------

--
-- Structure de la table `conges`
--

DROP TABLE IF EXISTS `conges`;
CREATE TABLE IF NOT EXISTS `conges` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `date_debut` date NOT NULL,
  `date_fin` date NOT NULL,
  `statut` varchar(255) COLLATE utf8mb4_general_ci DEFAULT 'En attente',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `duree` int DEFAULT NULL,
  `type` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `conges`
--

INSERT INTO `conges` (`id`, `employee_id`, `date_debut`, `date_fin`, `statut`, `created_at`, `duree`, `type`) VALUES
(42, 6, '2024-08-19', '2024-08-23', 'accepted', '2024-03-19 12:51:52', 5, 'Annual'),
(43, 6, '2024-07-15', '2024-07-20', 'accepted', '2024-03-19 12:52:27', 6, 'Annual'),
(44, 6, '2024-03-22', '2024-03-26', 'accepted', '2024-03-19 12:53:17', 5, 'Sick'),
(45, 6, '2024-03-28', '2024-03-30', 'accepted', '2024-03-23 23:42:37', 3, 'Annual'),
(46, 8, '2024-08-19', '2024-08-23', 'accepted', '2024-03-24 23:13:28', 5, 'Annual'),
(47, 8, '2024-03-27', '2024-03-31', 'accepted', '2024-03-24 23:14:36', 5, 'Sick'),
(48, 7, '2024-03-27', '2024-03-29', 'accepted', '2024-03-25 23:31:16', 3, 'Annual'),
(50, 6, '2024-04-09', '2024-04-19', 'accepted', '2024-04-02 23:29:36', 11, 'Annual');

-- --------------------------------------------------------

--
-- Structure de la table `deplacement`
--

DROP TABLE IF EXISTS `deplacement`;
CREATE TABLE IF NOT EXISTS `deplacement` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `departure_date` date NOT NULL,
  `return_date` date NOT NULL,
  `destination` varchar(255) NOT NULL,
  `reason` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `status` varchar(255) NOT NULL DEFAULT 'Pending',
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=MyISAM AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `deplacement`
--

INSERT INTO `deplacement` (`id`, `employee_id`, `departure_date`, `return_date`, `destination`, `reason`, `created_at`, `status`) VALUES
(5, 6, '2024-02-09', '2024-02-27', 'France', 'd', '2024-02-27 21:16:02', 'Validated'),
(6, 6, '2024-02-29', '2024-02-28', 'Canada', 'p', '2024-02-27 21:18:36', 'Validated'),
(8, 6, '2024-03-14', '2024-03-29', 'Tunisie', 'k', '2024-03-18 22:11:12', 'Not Validated'),
(9, 6, '2024-03-09', '2024-03-17', 'Tunisie', 'kk', '2024-03-18 22:12:16', 'Not Validated');

-- --------------------------------------------------------

--
-- Structure de la table `employee`
--

DROP TABLE IF EXISTS `employee`;
CREATE TABLE IF NOT EXISTS `employee` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  `salary` int NOT NULL,
  `address` varchar(50) NOT NULL,
  `image` varchar(50) NOT NULL,
  `category_id` int NOT NULL,
  `total_conges` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `employee`
--

INSERT INTO `employee` (`id`, `name`, `email`, `password`, `salary`, `address`, `image`, `category_id`, `total_conges`) VALUES
(7, 'Ahmed', 'Ahmed@gmail.com', '$2b$10$cNxhLpduILUqy81VkGTdAeKl1InoYCFYHw2lnm7boDUHQc0SkiGvq', 1500, 'Sfax , Soukra ', 'image_1706897693110.webp', 4, 0),
(8, 'Aicha', 'Aicha@gmail.com', '$2b$10$R7yW/OT2oCuhjBK41AIPlOGBZpFNpHPy42FRMoq3rLYhQ/iY9PVHy', 2500, 'Sfax , Soukra ', 'image_1706897749041.png', 5, 0),
(6, 'Dorsaf', 'dorsaf@gmail.com', '$2b$10$bg85vQIqCd1s3QucaC4adeRt753iysbhB9qkX8LUoS5Z0EQF30XBW', 2000, 'Sfax , Soukra ', 'image_1706897630751.png', 0, 0);

-- --------------------------------------------------------

--
-- Structure de la table `leader`
--

DROP TABLE IF EXISTS `leader`;
CREATE TABLE IF NOT EXISTS `leader` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `leader`
--

INSERT INTO `leader` (`id`, `name`, `email`, `password`) VALUES
(1, 'leader', 'leader@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Structure de la table `manager`
--

DROP TABLE IF EXISTS `manager`;
CREATE TABLE IF NOT EXISTS `manager` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(150) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `manager`
--

INSERT INTO `manager` (`id`, `name`, `email`, `password`) VALUES
(1, 'manager', 'manager@gmail.com', '123456');

-- --------------------------------------------------------

--
-- Structure de la table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `projects`
--

INSERT INTO `projects` (`id`, `name`) VALUES
(1, 'SmartCar'),
(5, 'Application Mobile wassalni'),
(8, 'SmartHouse'),
(7, 'Application Web E-health');

-- --------------------------------------------------------

--
-- Structure de la table `sorties`
--

DROP TABLE IF EXISTS `sorties`;
CREATE TABLE IF NOT EXISTS `sorties` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `heure_debut` time DEFAULT NULL,
  `heure_fin` time DEFAULT NULL,
  `description` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` varchar(50) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `duree` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `sorties`
--

INSERT INTO `sorties` (`id`, `employee_id`, `date`, `heure_debut`, `heure_fin`, `description`, `status`, `duree`) VALUES
(34, 8, '2024-03-29', '15:39:00', '16:39:00', 'Consultation', 'accepted', 1),
(35, 6, '2024-04-03', '02:09:00', '03:10:00', 'Engagement Familiale', 'accepted', 1),
(36, 6, '2024-04-09', '20:43:00', '21:43:00', 'Consultation', 'accepted', 1);

-- --------------------------------------------------------

--
-- Structure de la table `surveyquestions`
--

DROP TABLE IF EXISTS `surveyquestions`;
CREATE TABLE IF NOT EXISTS `surveyquestions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `question_text` text COLLATE utf8mb4_general_ci NOT NULL,
  `category` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `surveyquestions`
--

INSERT INTO `surveyquestions` (`id`, `question_text`, `category`) VALUES
(1, 'How would you rate the overall work environment?', 'Workplace Feedback'),
(2, 'Do you have any suggestions for improving the workplace?', 'Workplace Improvement'),
(3, 'How effective do you find the current training programs?', 'Training Evaluation'),
(4, 'Do you have any suggestions for future training programs?', 'Training Improvement'),
(5, 'How would you rate your supervisor?', 'Supervisor Evaluation'),
(6, 'Any comments on the leadership within the company?', 'Leadership Evaluation'),
(7, 'Are there specific aspects of the company you think can be improved?', 'Continuous Improvement'),
(8, 'What improvements or changes would you suggest to enhance the overall workplace environment and employee experience?', 'Workplace Feedback');

-- --------------------------------------------------------

--
-- Structure de la table `surveyresponses`
--

DROP TABLE IF EXISTS `surveyresponses`;
CREATE TABLE IF NOT EXISTS `surveyresponses` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int NOT NULL,
  `question_id` int NOT NULL,
  `response` text COLLATE utf8mb4_general_ci,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`),
  KEY `question_id` (`question_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `surveyresponses`
--

INSERT INTO `surveyresponses` (`id`, `employee_id`, `question_id`, `response`) VALUES
(2, 12, 4, 'Offer specialized workshops or courses to enhance technical skills relevant to our industry. This could include training on the latest software, tools, or technologies.'),
(3, 12, 2, 'Foster transparent communication between management and employees.'),
(14, 12, 2, 'cc'),
(15, 12, 2, 'cc'),
(16, 10, 5, 'oui'),
(17, 12, 6, 'oo'),
(18, 6, 1, 'yes'),
(19, 6, 8, 'yes');

-- --------------------------------------------------------

--
-- Structure de la table `task`
--

DROP TABLE IF EXISTS `task`;
CREATE TABLE IF NOT EXISTS `task` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL,
  `projectID` int NOT NULL,
  `employeeID` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `projectID` (`projectID`),
  KEY `employeeID` (`employeeID`) USING BTREE
) ENGINE=MyISAM AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Déchargement des données de la table `task`
--

INSERT INTO `task` (`id`, `name`, `status`, `projectID`, `employeeID`) VALUES
(16, 'Developpement UI ', 'Completed', 7, 6),
(11, 'Developpement UI ', 'Completed', 1, 7),
(12, 'Developpement backend', 'In Progress', 1, 8),
(13, 'Class Diagram', 'Pending', 5, 6),
(14, 'Use Case Diagram', 'Completed', 8, 8),
(15, 'Developpement backend', 'In Progress', 5, 7),
(10, 'conception', 'Completed', 1, 6),
(17, 'Developpement UI ', 'In Progress', 5, 6),
(18, 'conception', 'Completed', 5, 8);

-- --------------------------------------------------------

--
-- Structure de la table `time_entries`
--

DROP TABLE IF EXISTS `time_entries`;
CREATE TABLE IF NOT EXISTS `time_entries` (
  `id` int NOT NULL AUTO_INCREMENT,
  `employee_id` int DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  `hours_worked` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `status` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `employee_id` (`employee_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `time_entries`
--

INSERT INTO `time_entries` (`id`, `employee_id`, `start_time`, `end_time`, `hours_worked`, `date`, `status`) VALUES
(4, 6, '17:04:28', '23:04:00', 4, '2024-03-31', 0),
(5, 8, '17:06:44', '23:06:00', 4, '2024-03-31', 0),
(8, 6, '01:04:56', '14:05:00', 11, '2024-04-04', 0),
(9, 6, '14:52:20', '20:52:00', 4, '2024-04-07', 0),
(10, 6, '17:02:21', '23:02:00', 4, '2024-04-09', 0),
(11, 6, '20:43:57', NULL, NULL, '2024-04-12', 0);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
