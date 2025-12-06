-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Dec 06, 2025 at 03:55 AM
-- Server version: 8.0.30
-- PHP Version: 8.1.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `be_sistem_erp`
--

-- --------------------------------------------------------

--
-- Table structure for table `blacklist_tokens`
--

CREATE TABLE `blacklist_tokens` (
  `id` int UNSIGNED NOT NULL,
  `token` text NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `expired_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `blacklist_tokens`
--

INSERT INTO `blacklist_tokens` (`id`, `token`, `created_at`, `expired_at`) VALUES
(1, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MDM0MDM4MiwiZXhwIjoxNzYwNDI2NzgyfQ.B8yqU1Zn-ul9K7orotW_veGvHxUFZVMp0-uwweW0BRt2QMwa56rWDLgSyTjTJsXGgHxVTp5JKwLlZMl942301w', '2025-10-13 07:26:26', '2025-10-14 14:26:22'),
(2, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MDM0MDQxOSwiZXhwIjoxNzYwNDI2ODE5fQ.cW2qXd2bIam8Dv5pSiQI1y_CydDMkjCF0tcs4bCcmqQvwbJRSKhu0vq8_JdAYNUES892atZlZHyEJQOSp1zTZQ', '2025-10-13 07:35:14', '2025-10-14 14:26:59'),
(3, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJNQU5BR0VSX1BST0RVS1NJIiwiaWF0IjoxNzYwMzQwOTI0LCJleHAiOjE3NjA0MjczMjR9.MzXV13Piywl2kYSYEKoLjL9NjCQvZ7Icd72KuKjfEJrrocNHFRWfcikgW7hTzf3s9DBwQUPHtP0PRdVpifwhWQ', '2025-10-13 07:36:01', '2025-10-14 14:35:24'),
(4, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MDM0MDk3MCwiZXhwIjoxNzYwNDI3MzcwfQ._npqK0bWWTdnOBC-kG3_JegP8ZzfPy1PrXSR0icunkPf4uLIfexpm3RULeLtrnBH4EG81RpT1MVLoM0b2XcLxA', '2025-10-13 07:45:39', '2025-10-14 14:36:10'),
(5, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjMsInJvbGUiOiJQRU5HQVdBU19LVUFMSVRBUyIsImlhdCI6MTc2MDM0MTU0NiwiZXhwIjoxNzYwNDI3OTQ2fQ.FEOco3V7M1-N9cz9PA0r8tduOJBtDmy0nwlgnh-hf0tinFYe1nVPNvmeJGI2QbIQW2l_MCRSsuxtNC1FwpkJig', '2025-10-13 07:45:53', '2025-10-14 14:45:46'),
(6, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MDM0MTU2MSwiZXhwIjoxNzYwNDI3OTYxfQ.gGc18_e96SRAYI-fPHRU-pMB4QOp-rOM391Vj0SiGneI4PIOCvnZSJtkHFuI9vjSjlhLx3EH7g3ASBWqSU_oeg', '2025-10-13 07:49:39', '2025-10-14 14:46:01'),
(7, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJHVURBTkciLCJpYXQiOjE3NjAzNDE3OTEsImV4cCI6MTc2MDQyODE5MX0.UO_4JCz6B0AFZzj2WtQafEguSdFkkeS4gWcPMtsbD1cjnviOAo2Gp4A_uxJD84hGCunZ5XAY8_7EwkSt9rxrOg', '2025-10-13 07:52:34', '2025-10-14 14:49:51'),
(8, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MDM0MTk4OSwiZXhwIjoxNzYwNDI4Mzg5fQ.2Un76kBePp9U9MOBL5072Jdu4TDEqEg6AIJjeTsG2uFt_nUjHqBlGLmM3_YG-OGDLpCne2G8wbkbNynBaL_nWg', '2025-10-13 08:26:24', '2025-10-14 14:53:09'),
(9, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MDM1MDI0NywiZXhwIjoxNzYwNDM2NjQ3fQ.o_LaNrnQKTNvTPFEF3HUUn0N7rahhnJFTH8Vy6e94gKstx-uo3_v-O6P1VICvxvx7VHylAoicXeCSgpbUpJ8KA', '2025-10-13 10:14:32', '2025-10-14 17:10:47'),
(10, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJHVURBTkciLCJpYXQiOjE3NjAzNTA0ODIsImV4cCI6MTc2MDQzNjg4Mn0.bxH8Bpi70r4FB77yu7G5Lmz-TWeKipa7okEgSirR_2TvHzjpQtXmPqYY-n5IgKmyuvFfV-KXZP1Wsf4N8uF_NA', '2025-10-13 10:14:47', '2025-10-14 17:14:42'),
(11, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjQsInJvbGUiOiJHVURBTkciLCJpYXQiOjE3NjAzNTA1MzksImV4cCI6MTc2MDQzNjkzOX0.7vifr9YmDEG2MlqV4Z6VYFZkdpPJpS-jKc_7l_HzirrnfRBhe-rgy5QWMLRlmHv0lVTxE41CO-qqiiW8msC2gw', '2025-10-13 10:15:45', '2025-10-14 17:15:39'),
(12, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MDM1MDgwNSwiZXhwIjoxNzYwNDM3MjA1fQ.k9Y9Cnp_5h8VEtKugLv9GhVYQQit1UgAXXOEcrM2E9m4D9RLSS-Sp561yAaEi5VqppnGF7G8zx-WFwWqz9iggw', '2025-10-13 11:10:40', '2025-10-14 17:20:05'),
(13, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MDM1NTIwNiwiZXhwIjoxNzYwNDQxNjA2fQ.uLuuT2ZwEn9BUlhKH6nC7xbobnv6BrgzqUtiiRJ0igLF0a8cyMLxU7Ccj444PcS8NZoWUmPpAHBI1dKNtkTPXw', '2025-10-14 02:15:32', '2025-10-14 18:33:26'),
(14, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MjM0MTUwMSwiZXhwIjoxNzYyNDI3OTAxfQ.eZxBxl6ocoppEr2-ejTqJ7WuyW8Qi6NZEhw5HrnsRamITlchWM07Bbj9Y61PCc0p8-JABLGXRf5C3TcKNpmuVA', '2025-11-05 13:55:22', '2025-11-06 18:18:21'),
(15, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MjQzMTQyNiwiZXhwIjoxNzYyNTE3ODI2fQ.JuLgGvbYzP2RGsXYEncxanG1xsap2g75_oziLsJf6TOOASJCwsgtm39aeO12xx_ZUKH4TI8bi6rkRnkoWZucxw', '2025-11-06 14:04:54', '2025-11-07 19:17:06'),
(16, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MjYyMTgwOCwiZXhwIjoxNzYyNzA4MjA4fQ.IYS-6RHo-a1-Izr5cGbRmH_D835DdBKMavRaySsH0PI5eK_pWZgRQoJVB2Vd0KLeVKcGGhAHqB6sNSQgNxYV-w', '2025-11-08 18:29:57', '2025-11-10 00:10:08'),
(17, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MjYyNjYwMywiZXhwIjoxNzYyNzEzMDAzfQ.I0-ZC4PVA-zNjITrfqVpO3h9l0xIl17KXvAiiC-W39ueFA1dbnZn-frNSo9CVI6-ui2K8RpbtQakjS-oXrV1PA', '2025-11-08 18:59:48', '2025-11-10 01:30:03'),
(18, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MjYyODM5NSwiZXhwIjoxNzYyNzE0Nzk1fQ.rotU449ZrA42dydANpfxcm07S0F-w1Kxpj5GA-JmfmrCCEEHviRzQ6e_NHUehp3tz5rKAcEUrYNWX6Ot7hmW_g', '2025-11-08 19:06:58', '2025-11-10 01:59:55'),
(19, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MjY2Mjc0OCwiZXhwIjoxNzYyNzQ5MTQ4fQ.ZkEOuF2NPkSLFbjX-zZhKig3Vu6XleK-UfzIRAmmT1uOlI5B9_3ndigJL2V5WORnR6-47e0nJQFKPxW-wFOsnA', '2025-11-09 05:53:00', '2025-11-10 11:32:28'),
(20, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2MjY2ODYzMywiZXhwIjoxNzYyNzU1MDMzfQ.JxsdNh0anQG5zdXKyPgjq--TiIHY1PsgzjNz5gEhKi4F0QqW8b2eNrke6RfHyjezIecZztRnEWt70i-z5dtD9w', '2025-11-09 12:43:11', '2025-11-10 13:10:33'),
(21, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjksInJvbGUiOiJVU0VSIiwiaWF0IjoxNzYyODE3OTAyLCJleHAiOjE3NjI5MDQzMDJ9.HEie6QZkPWCvaeXzvf1i9Gc4dHfQ8LQhfWE7r5cOYmWsuetayW2H8Xz8kqGMTX8k4HF4Jk2lVbK_aaAYmBRT8A', '2025-11-10 23:42:10', '2025-11-12 06:38:22'),
(22, 'eyJhbGciOiJIUzUxMiJ9.eyJ1c2VySWQiOjEsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc2Mjg0OTYzNywiZXhwIjoxNzYyOTM2MDM3fQ.vBgIIc5ct2A8Y6GPsEevk4rygxKSjfqms32zWAUSRE9t-YQ7gPbiKCAeAQMzbiwt9ivC2H22VEmCmEVVfoQw3w', '2025-11-11 08:27:22', '2025-11-12 15:27:17');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations`
--

CREATE TABLE `knex_migrations` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) DEFAULT NULL,
  `batch` int DEFAULT NULL,
  `migration_time` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `knex_migrations`
--

INSERT INTO `knex_migrations` (`id`, `name`, `batch`, `migration_time`) VALUES
(1, '20251013063015_create_users_table.js', 1, '2025-10-13 06:38:51'),
(2, '20251013063042_create_login_history_table.js', 1, '2025-10-13 06:38:51'),
(3, '20251013063103_create_blacklist_tokens.js', 1, '2025-10-13 06:38:51'),
(4, '20251013102753_create_master_hari.js', 2, '2025-10-13 10:28:08'),
(5, '20251013110701_create_master_kodebarang.js', 3, '2025-10-13 11:10:01'),
(8, '20251014033412_create_master_kategoribarang.js', 4, '2025-10-14 04:03:03'),
(9, '20251015025109_create_master_satuanbarang.js', 5, '2025-10-15 03:01:14'),
(10, '20251027144444_create_master_gudang.js', 6, '2025-10-27 14:45:02'),
(11, '20251027162123_create_master_rak.js', 7, '2025-10-27 16:41:44'),
(13, '20251028034750_create_master_bank.js', 8, '2025-11-03 14:31:40'),
(14, '20251103145438_create_master_barcode.js', 9, '2025-11-03 14:56:00'),
(15, '20251103160032_create_master_jenis_supplier.js', 10, '2025-11-03 16:05:43'),
(18, '20251105125541_create_master_supplier.js', 11, '2025-11-05 13:23:48'),
(20, '20251105144622_create_master_stock_supplier.js', 12, '2025-11-05 14:51:32'),
(21, '20251106020205_create_master_coa.js', 13, '2025-11-06 02:02:27'),
(28, '20251108172523_create_master_produk.js', 14, '2025-11-09 11:23:57'),
(29, '20251109112407_create_master_bahan_baku.js', 15, '2025-11-09 11:43:35'),
(33, '20251120064331_create_master_alamat.js', 16, '2025-11-20 06:43:46'),
(42, '20251203152153_create_master_klien.js', 17, '2025-12-04 02:47:03'),
(43, '20251204024749_create_transaksi_projek.js', 18, '2025-12-04 02:48:02'),
(44, '20251204082035_create_transaksi_billing.js', 19, '2025-12-04 08:33:20'),
(45, '20251205005222_create_transaksi_blog.js', 20, '2025-12-05 01:08:11');

-- --------------------------------------------------------

--
-- Table structure for table `knex_migrations_lock`
--

CREATE TABLE `knex_migrations_lock` (
  `index` int UNSIGNED NOT NULL,
  `is_locked` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `knex_migrations_lock`
--

INSERT INTO `knex_migrations_lock` (`index`, `is_locked`) VALUES
(1, 0);

-- --------------------------------------------------------

--
-- Table structure for table `login_history`
--

CREATE TABLE `login_history` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `action` enum('LOGIN','LOGOUT') NOT NULL,
  `ip_address` varchar(50) DEFAULT NULL,
  `user_agent` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `login_history`
--

INSERT INTO `login_history` (`id`, `user_id`, `action`, `ip_address`, `user_agent`, `created_at`) VALUES
(102, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 02:54:45'),
(104, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 03:17:31'),
(109, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 03:51:54'),
(121, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 04:57:30'),
(130, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 05:34:23'),
(131, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 05:49:04'),
(132, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 05:50:23'),
(133, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 05:50:33'),
(135, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 05:52:09'),
(136, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 05:58:55'),
(137, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 06:00:29'),
(138, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 06:00:56'),
(139, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 06:02:01'),
(140, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 06:02:26'),
(141, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 06:02:42'),
(142, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 06:03:17'),
(143, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 06:15:19'),
(144, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 07:25:41'),
(145, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 07:26:25'),
(147, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 07:31:54'),
(149, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 07:44:32'),
(150, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-11-27 08:18:07'),
(151, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 01:44:27'),
(152, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-01 04:00:36'),
(153, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-03 14:58:53'),
(155, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-03 15:52:32'),
(157, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-03 16:39:12'),
(160, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-03 16:55:38'),
(167, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-03 17:11:38'),
(175, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-03 17:31:25'),
(182, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-03 23:59:41'),
(190, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', '2025-12-04 00:37:37'),
(193, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-04 02:52:29'),
(197, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-04 03:45:48'),
(203, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-04 04:02:51'),
(208, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-04 06:34:40'),
(209, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-04 07:29:04'),
(211, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-04 23:07:36'),
(212, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-05 00:05:29'),
(213, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-05 01:40:28'),
(214, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-05 02:48:21'),
(215, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-05 06:28:55'),
(222, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-05 22:34:34'),
(223, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-05 23:02:51'),
(229, 18, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-06 00:07:10'),
(230, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-06 01:59:15'),
(231, 18, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-06 02:01:23'),
(232, 8, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-06 02:04:23'),
(233, 18, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-06 02:22:15'),
(234, 18, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-06 02:40:11'),
(235, 18, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-06 02:47:11'),
(236, 18, 'LOGIN', '::1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36 Edg/142.0.0.0', '2025-12-06 03:32:19');

-- --------------------------------------------------------

--
-- Table structure for table `master_alamat`
--

CREATE TABLE `master_alamat` (
  `ALAMAT_ID` bigint UNSIGNED NOT NULL,
  `EMAIL` varchar(120) NOT NULL,
  `LABEL_ALAMAT` varchar(50) DEFAULT 'Rumah',
  `NAMA_PENERIMA` varchar(100) NOT NULL,
  `NO_HP_PENERIMA` varchar(20) NOT NULL,
  `ALAMAT_LENGKAP` text NOT NULL,
  `KELURAHAN` varchar(100) DEFAULT NULL,
  `KECAMATAN` varchar(100) DEFAULT NULL,
  `KOTA_KABUPATEN` varchar(100) DEFAULT NULL,
  `PROVINSI` varchar(100) DEFAULT NULL,
  `KODE_POS` varchar(10) DEFAULT NULL,
  `IS_UTAMA` tinyint(1) DEFAULT '0',
  `CATATAN` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `master_bahan_baku`
--

CREATE TABLE `master_bahan_baku` (
  `id` bigint UNSIGNED NOT NULL,
  `kode` varchar(50) NOT NULL,
  `kode_barcode` varchar(50) DEFAULT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `jenis` enum('Barang','Jasa') DEFAULT 'Barang',
  `kode_kategori` varchar(50) DEFAULT NULL,
  `kode_rak` varchar(50) DEFAULT NULL,
  `kode_gudang` varchar(50) DEFAULT NULL,
  `kode_satuan` varchar(50) DEFAULT NULL,
  `tanggal_kadaluarsa` date DEFAULT NULL,
  `berat` decimal(10,2) DEFAULT '0.00',
  `stok_awal` decimal(15,2) DEFAULT '0.00',
  `harga_beli` decimal(19,4) DEFAULT '0.0000',
  `harga_jual` decimal(19,4) DEFAULT '0.0000',
  `path_gambar` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_bahan_baku`
--

INSERT INTO `master_bahan_baku` (`id`, `kode`, `kode_barcode`, `nama_produk`, `jenis`, `kode_kategori`, `kode_rak`, `kode_gudang`, `kode_satuan`, `tanggal_kadaluarsa`, `berat`, `stok_awal`, `harga_beli`, `harga_jual`, `path_gambar`, `created_at`, `updated_at`) VALUES
(1, 'BBK-251109-151721', 'BC002', 'Gula Pasir Kristal Putih', 'Barang', 'A001', 'R004', 'G002', 'BTG', '2025-11-25', '1000.00', '1000.00', '1.0000', '10.0000', '/api/uploads/bahanbaku/path_gambar-1762701441908-541330309.jpeg', '2025-11-09 15:17:22', '2025-11-09 15:17:22'),
(3, 'BBK-251109-152926', 'BC004', 'LINGGIS', 'Barang', 'A005', 'R003', 'G002', 'BJ', '2025-11-25', '1000.00', '10.00', '10.0000', '10.0000', '/api/uploads/bahanbaku/path_gambar-1762702166591-564246002.jpg', '2025-11-09 15:29:27', '2025-11-09 15:29:26');

-- --------------------------------------------------------

--
-- Table structure for table `master_bank`
--

CREATE TABLE `master_bank` (
  `id` int UNSIGNED NOT NULL,
  `kode` varchar(50) NOT NULL,
  `rekening` varchar(100) NOT NULL,
  `penarikan_tunai` tinyint(1) DEFAULT '0',
  `administrasi` decimal(14,2) DEFAULT '0.00',
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_bank`
--

INSERT INTO `master_bank` (`id`, `kode`, `rekening`, `penarikan_tunai`, `administrasi`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 'BSI', '09653234567865', 1, '200.00', 'Bank', '2025-11-03 14:32:30', '2025-11-03 14:32:53');

-- --------------------------------------------------------

--
-- Table structure for table `master_barcode`
--

CREATE TABLE `master_barcode` (
  `id` int UNSIGNED NOT NULL,
  `kode_barcode` varchar(50) NOT NULL,
  `nama` varchar(100) NOT NULL,
  `barcode` varchar(100) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_barcode`
--

INSERT INTO `master_barcode` (`id`, `kode_barcode`, `nama`, `barcode`, `status`, `keterangan`, `created_at`, `updated_at`) VALUES
(2, 'BC001', 'Produk Contoh', '1234567890123', 1, 'Barang aktif', '2025-11-03 15:54:30', '2025-11-03 15:59:17'),
(3, 'BC002', 'Biskuit Cokelat Premium 150g', '8992765432101', 1, 'Stok aman, cek tanggal kadaluarsa.', '2025-11-04 03:15:00', '2025-11-04 03:15:00'),
(4, 'BC003', 'Sabun Mandi Cair Lemon 500ml', '8991122334455', 1, 'Diskon 10% minggu ini.', '2025-11-04 07:22:15', '2025-11-06 02:30:45'),
(5, 'BC004', 'Kabel Charger USB Type-C', '0001987654321', 0, 'Non-aktif (Habis/Discontinue).', '2025-11-05 01:05:50', '2025-11-05 11:00:00'),
(6, 'BC005', 'Air Mineral Botol 600ml (Dus)', '8995001002003', 1, 'Item bulk, harga grosir terpisah.', '2025-11-05 04:40:00', '2025-11-05 04:40:00'),
(7, 'BC006', 'Buku Tulis Hardcover A5', '9786025547012', 1, 'Barang baru masuk gudang.', '2025-11-06 09:30:22', '2025-11-07 00:10:11'),
(8, 'BC007', 'Kopi Instan 3-in-1 Sachet', '8994567800000', 1, 'Cek promosi bundling.', '2025-11-07 02:00:00', '2025-11-07 02:00:00'),
(9, 'BC008', 'Pena Tinta Gel Hitam 0.5mm', '4891234567890', 0, 'Non-aktif (Ganti merek).', '2025-11-08 06:55:00', '2025-11-08 07:05:00'),
(10, 'BC009', 'Mie Instan Rasa Ayam Bawang', '8998001002010', 1, 'Barang fast-moving, stok harus ditambah.', '2025-11-08 08:00:00', '2025-11-08 08:00:00'),
(11, 'BC010', 'Shampoo Anti-Ketombe 170ml', '8991000200030', 1, 'Normal stock.', '2025-11-08 08:10:00', '2025-11-08 08:10:00'),
(12, 'BC011', 'Susu UHT Full Cream 1L', '8993000400050', 1, 'Perlu pengecekan suhu penyimpanan.', '2025-11-08 08:20:00', '2025-11-08 08:20:00'),
(13, 'BC012', 'Tisu Wajah 250 sheets', '8994000600070', 1, 'Stok gudang melimpah.', '2025-11-08 08:30:00', '2025-11-08 08:30:00'),
(14, 'BC013', 'Pengharum Ruangan Spray Apel', '8995000800090', 0, 'Non-aktif (Musiman).', '2025-11-08 08:40:00', '2025-11-08 09:00:00'),
(15, 'BC014', 'Beras Premium 5 Kg', '8996001000110', 1, 'Harga naik 2%.', '2025-11-09 01:00:00', '2025-11-09 01:00:00'),
(16, 'BC015', 'Telur Ayam Omega-3 (Pack)', '8997001200130', 1, 'Perishable item.', '2025-11-09 01:15:00', '2025-11-09 01:15:00'),
(17, 'BC016', 'Gula Pasir 1 Kg', '8998001400150', 1, 'Basic needs, always stock.', '2025-11-09 01:30:00', '2025-11-09 01:30:00'),
(18, 'BC017', 'Teh Celup Hijau (Kotak)', '8999001600170', 1, 'Ada promo beli 2 gratis 1.', '2025-11-09 01:45:00', '2025-11-09 01:45:00'),
(19, 'BC018', 'Pembersih Lantai Karbol', '8990001800190', 1, 'Sisa stok 20 unit.', '2025-11-09 02:00:00', '2025-11-09 02:00:00'),
(20, 'BC019', 'Lampu LED 10 Watt', '0010002000210', 1, 'Garansi 1 tahun.', '2025-11-09 02:15:00', '2025-11-09 02:15:00'),
(21, 'BC020', 'Obat Sakit Kepala (Strip)', '0011002200230', 1, 'Produk farmasi, cek izin.', '2025-11-09 02:30:00', '2025-11-09 02:30:00'),
(22, 'BC021', 'Sandal Jepit Ukuran 40', '0012002400250', 1, 'Varian warna berbeda.', '2025-11-09 02:45:00', '2025-11-09 02:45:00'),
(23, 'BC022', 'Handuk Mandi Putih', '0013002600270', 1, 'Good quality.', '2025-11-09 03:00:00', '2025-11-09 03:00:00'),
(24, 'BC023', 'Selai Strawberry 200g', '0014002800290', 1, 'Expired date 2026-05-20.', '2025-11-09 03:15:00', '2025-11-09 03:15:00'),
(25, 'BC024', 'Kecap Manis Botol 600ml', '0015003000310', 1, 'Stok terbatas.', '2025-11-09 03:30:00', '2025-11-09 03:30:00'),
(26, 'BC025', 'Piring Keramik Ukuran M', '0016003200330', 1, 'Fragile item.', '2025-11-09 03:45:00', '2025-11-09 03:45:00'),
(27, 'BC026', 'Mangkok Plastik Serbaguna', '0017003400350', 1, 'Varian warna hijau.', '2025-11-09 04:00:00', '2025-11-09 12:58:36'),
(28, 'BC027', 'Sendok Garpu Set (12 Pcs)', '0018003600370', 1, 'Stainless steel.', '2025-11-09 04:15:00', '2025-11-09 12:58:36'),
(29, 'BC028', 'Deterjen Bubuk 800g', '0019003800390', 1, 'Ada bonus piring kecil.', '2025-11-09 04:30:00', '2025-11-09 12:58:36'),
(30, 'BC029', 'Pelembut Pakaian Konsentrat', '0020004000410', 1, 'Aroma floral.', '2025-11-09 04:45:00', '2025-11-09 12:58:36'),
(31, 'BC030', 'Kopi Bubuk Murni 250g', '0021004200430', 1, 'Dari biji kopi lokal.', '2025-11-09 05:00:00', '2025-11-09 12:58:36'),
(32, 'BC031', 'Gorengan Instan Tepung', '0022004400450', 1, 'Disimpan di freezer.', '2025-11-09 06:00:00', '2025-11-09 12:58:36'),
(33, 'BC032', 'Minuman Isotonik 500ml', '0023004600470', 1, 'Rasa jeruk.', '2025-11-09 06:15:00', '2025-11-09 12:58:36'),
(34, 'BC033', 'Permen Mint Segar', '0024004800490', 1, 'Stok display penuh.', '2025-11-09 06:30:00', '2025-11-09 12:58:36'),
(35, 'BC034', 'Mainan Anak Mobil Remote', '0025005000510', 0, 'Non-aktif (Musiman/Natal).', '2025-11-09 06:45:00', '2025-11-09 12:58:36'),
(36, 'BC035', 'Senter LED Kecil', '0026005200530', 1, 'Termasuk baterai.', '2025-11-09 07:15:00', '2025-11-09 12:58:36'),
(37, 'BC036', 'Lem Serbaguna 50ml', '0027005400550', 1, 'Barang kebutuhan kantor.', '2025-11-09 07:30:00', '2025-11-09 12:58:36'),
(38, 'BC037', 'Crayon Warna Set 12', '0028005600570', 1, 'Alat tulis sekolah.', '2025-11-09 07:45:00', '2025-11-09 07:45:00'),
(39, 'BC038', 'Kertas HVS A4 (Rim)', '0029005800590', 1, 'Stok di gudang atas.', '2025-11-09 08:00:00', '2025-11-09 08:00:00'),
(40, 'BC039', 'Flashdisk 32GB USB 3.0', '0030006000610', 1, 'Garansi resmi.', '2025-11-09 08:15:00', '2025-11-09 08:15:00'),
(41, 'BC040', 'Mouse Wireless Optik', '0031006200630', 1, 'Warna hitam.', '2025-11-09 08:30:00', '2025-11-09 08:30:00'),
(42, 'BC041', 'Keyboard Standard USB', '0032006400650', 1, 'Barang PO.', '2025-11-09 08:45:00', '2025-11-09 08:45:00'),
(43, 'BC042', 'Headset Gaming Murah', '0033006600670', 1, 'Promo akhir bulan.', '2025-11-09 09:00:00', '2025-11-09 09:00:00'),
(44, 'BC043', 'Tas Ransel Sekolah', '0034006800690', 1, 'Ada diskon seragam.', '2025-11-09 09:15:00', '2025-11-09 09:15:00'),
(45, 'BC044', 'Sepatu Olahraga Pria Uk. 42', '0035007000710', 1, 'Warna biru dongker.', '2025-11-09 09:30:00', '2025-11-09 09:30:00'),
(46, 'BC045', 'Kaos Kaki Sport Putih', '0036007200730', 1, 'Bahan katun.', '2025-11-09 09:45:00', '2025-11-09 09:45:00'),
(47, 'BC046', 'Payung Lipat Otomatis', '0037007400750', 1, 'Musim hujan.', '2025-11-09 10:00:00', '2025-11-09 10:00:00'),
(48, 'BC047', 'Masker Kain Non-Medis', '0038007600770', 1, 'Ready stock banyak.', '2025-11-09 10:15:00', '2025-11-09 10:15:00'),
(49, 'BC048', 'Hand Sanitizer Gel 100ml', '0039007800790', 1, 'Perlu di-restock.', '2025-11-09 10:30:00', '2025-11-09 10:30:00'),
(50, 'BC049', 'Vitamin C 500mg (Botol)', '0040008000810', 1, 'Suplemen kesehatan.', '2025-11-09 10:45:00', '2025-11-09 10:45:00'),
(51, 'BC050', 'Termometer Digital', '0041008200830', 1, 'Barang medis.', '2025-11-09 11:00:00', '2025-11-09 11:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `master_coa`
--

CREATE TABLE `master_coa` (
  `id` int UNSIGNED NOT NULL,
  `kode_rekening` varchar(20) NOT NULL,
  `keterangan` varchar(150) NOT NULL,
  `jenis_rekening` enum('Induk','Detail') NOT NULL DEFAULT 'Detail',
  `kelompok_rekening` enum('Aset','Kewajiban','Modal','Pendapatan','Biaya') NOT NULL,
  `parent_id` int UNSIGNED DEFAULT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_coa`
--

INSERT INTO `master_coa` (`id`, `kode_rekening`, `keterangan`, `jenis_rekening`, `kelompok_rekening`, `parent_id`, `status`, `created_at`, `updated_at`) VALUES
(8, '1', 'ASET', 'Induk', 'Aset', NULL, 1, '2025-11-06 02:16:17', '2025-11-06 02:16:17'),
(9, '1.100', 'Kas', 'Induk', 'Aset', 8, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(10, '1.200', 'Bank', 'Induk', 'Aset', 8, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(11, '1.300', 'Piutang', 'Induk', 'Aset', 8, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(12, '1.400', 'Aktiva Lancar Lain', 'Induk', 'Aset', 8, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(13, '1.100.01', 'Kas Besar', 'Detail', 'Aset', 9, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(14, '1.100.02', 'Kas Kecil', 'Detail', 'Aset', 9, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(15, '1.200.01', 'Bank Bsi', 'Detail', 'Aset', 10, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(16, '1.300.01', 'Piutang Usaha', 'Detail', 'Aset', 11, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(17, '1.400.01', 'PPN Masukan', 'Detail', 'Aset', 12, 1, '2025-11-06 02:16:18', '2025-11-06 02:16:18'),
(18, '2', 'LIABILITAS', 'Induk', 'Kewajiban', NULL, 1, '2025-11-06 02:16:36', '2025-11-06 02:16:36'),
(19, '2.100', 'Hutang Jangka Pendek', 'Induk', 'Kewajiban', 18, 1, '2025-11-06 02:16:36', '2025-11-06 02:16:36'),
(20, '2.100.01', 'PPN Keluaran', 'Detail', 'Kewajiban', 19, 1, '2025-11-06 02:16:36', '2025-11-06 02:16:36'),
(21, '2.100.02', 'Hutang Dagang', 'Detail', 'Kewajiban', 19, 1, '2025-11-06 02:16:36', '2025-11-06 02:16:36'),
(22, '2.100.03', 'Poin Belanja', 'Detail', 'Kewajiban', 19, 1, '2025-11-06 02:16:36', '2025-11-06 02:16:36'),
(23, '2.100.04', 'Donasi', 'Detail', 'Kewajiban', 19, 1, '2025-11-06 02:16:36', '2025-11-06 02:16:36'),
(24, '3', 'EKUITAS', 'Induk', 'Modal', NULL, 1, '2025-11-06 02:16:47', '2025-11-06 02:16:47'),
(25, '3.100', 'Modal', 'Induk', 'Modal', 24, 1, '2025-11-06 02:16:48', '2025-11-06 02:16:48'),
(26, '3.300', 'Dana Cadangan', 'Induk', 'Modal', 24, 1, '2025-11-06 02:16:48', '2025-11-06 02:16:48'),
(27, '3.400', 'Laba Rugi Tahun Lalu', 'Induk', 'Modal', 24, 1, '2025-11-06 02:16:48', '2025-11-06 02:16:48'),
(28, '3.500', 'Laba Rugi Tahun Berjalan', 'Induk', 'Modal', 24, 1, '2025-11-06 02:16:48', '2025-11-06 02:16:48'),
(29, '3.100.04', 'Dana Hibah', 'Detail', 'Modal', 25, 1, '2025-11-06 02:16:48', '2025-11-06 02:16:48'),
(30, '3.300.01', 'Cadangan Resiko', 'Detail', 'Modal', 26, 1, '2025-11-06 02:16:48', '2025-11-06 02:16:48'),
(31, '3.400.01', 'Laba Rugi Tahun Lalu', 'Detail', 'Modal', 27, 1, '2025-11-06 02:16:48', '2025-11-06 02:16:48'),
(32, '3.501', 'Laba Rugi Tahun Berjalan', 'Detail', 'Modal', 28, 1, '2025-11-06 02:16:48', '2025-11-06 02:16:48'),
(33, '4', 'PENDAPATAN', 'Induk', 'Pendapatan', NULL, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(34, '4.100', 'Peredaran Usaha Pendapatan', 'Induk', 'Pendapatan', 33, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(35, '4.300', 'Pembelian Barang', 'Induk', 'Pendapatan', 33, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(36, '4.100.01', 'Penjualan Tunai', 'Detail', 'Pendapatan', 34, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(37, '4.100.02', 'Penjualan Non Tunai', 'Detail', 'Pendapatan', 34, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(38, '4.100.03', 'Diskon', 'Detail', 'Pendapatan', 34, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(39, '4.100.04', 'Selisih Penjualan', 'Detail', 'Pendapatan', 34, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(40, '4.300.01', 'Pembelian Barang Kredit', 'Detail', 'Pendapatan', 35, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(41, '4.300.02', 'Pembelian Barang Tunai', 'Detail', 'Pendapatan', 35, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(42, '4.300.03', 'Pembelian Bahan Baku', 'Detail', 'Pendapatan', 35, 1, '2025-11-06 02:16:57', '2025-11-06 02:16:57'),
(43, '5', 'BIAYA', 'Induk', 'Biaya', NULL, 1, '2025-11-06 02:17:06', '2025-11-06 02:17:06'),
(44, '5.100', 'Beban Usaha', 'Induk', 'Biaya', 43, 1, '2025-11-06 02:17:06', '2025-11-06 02:17:06'),
(45, '5.200', 'Beban Administrasi', 'Induk', 'Biaya', 43, 1, '2025-11-06 02:17:06', '2025-11-06 02:17:06'),
(46, '5.300', 'Beban Lain-lain', 'Induk', 'Biaya', 43, 1, '2025-11-06 02:17:06', '2025-11-06 02:17:06'),
(47, '5.400', 'HPP', 'Induk', 'Biaya', 43, 1, '2025-11-06 02:17:06', '2025-11-06 02:17:06'),
(48, '5.100.01', 'Biaya Gaji', 'Detail', 'Biaya', 44, 1, '2025-11-06 02:17:07', '2025-11-06 02:17:07'),
(49, '5.100.26', 'Biaya Penyusutan Peralatan', 'Detail', 'Biaya', 44, 1, '2025-11-06 02:17:07', '2025-11-06 02:17:07'),
(50, '5.200.01', 'Biaya Administrasi Bank', 'Detail', 'Biaya', 45, 1, '2025-11-06 02:17:07', '2025-11-06 02:17:07'),
(51, '5.200.02', 'Biaya Transfer', 'Detail', 'Biaya', 45, 1, '2025-11-06 02:17:07', '2025-11-06 02:17:07'),
(52, '5.300.08', 'Biaya Lainnya', 'Detail', 'Biaya', 46, 1, '2025-11-06 02:17:07', '2025-11-06 02:17:07'),
(53, '5.400.01', 'HPP Barang Dagang', 'Detail', 'Biaya', 47, 1, '2025-11-06 02:17:07', '2025-11-06 02:17:07');

-- --------------------------------------------------------

--
-- Table structure for table `master_gudang`
--

CREATE TABLE `master_gudang` (
  `id_gudang` int UNSIGNED NOT NULL,
  `kode` varchar(50) NOT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_gudang`
--

INSERT INTO `master_gudang` (`id_gudang`, `kode`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 'G001', 'Gudang', '2025-10-27 15:34:06', '2025-10-27 15:36:30'),
(2, 'G002', 'Gudang Bahan Baku', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(3, 'G003', 'Gudang Barang Jadi', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(4, 'G004', 'Gudang Transit (Penerimaan)', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(5, 'G005', 'Gudang Retur & Barang Rusak', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(6, 'G006', 'Gudang Area A (Kering)', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(7, 'G007', 'Gudang Area B (Cold Storage)', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(8, 'G008', 'Gudang Bahan Pengemas', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(9, 'G009', 'Gudang Spare Part Mesin', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(10, 'G010', 'Gudang Alat Tulis Kantor (ATK)', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(11, 'G011', 'Gudang Material Promosi', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(12, 'G012', 'Gudang Arsip Dokumen', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(13, 'G013', 'Gudang Cabang Jakarta', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(14, 'G014', 'Gudang Cabang Surabaya', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(15, 'G015', 'Gudang Produksi', '2025-11-09 08:02:51', '2025-11-09 08:02:51'),
(16, 'G016', 'Gudang Ekspedisi (Pengiriman)', '2025-11-09 08:02:51', '2025-11-09 08:02:51');

-- --------------------------------------------------------

--
-- Table structure for table `master_hari`
--

CREATE TABLE `master_hari` (
  `HARI_ID` int UNSIGNED NOT NULL,
  `NAMA_HARI` varchar(20) NOT NULL,
  `URUTAN` int NOT NULL,
  `STATUS` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_hari`
--

INSERT INTO `master_hari` (`HARI_ID`, `NAMA_HARI`, `URUTAN`, `STATUS`, `created_at`, `updated_at`) VALUES
(1, 'Senin', 1, 'Aktif', '2025-10-13 10:28:38', '2025-10-13 10:28:38'),
(2, 'Selasa', 2, 'Aktif', '2025-10-13 10:28:59', '2025-10-13 10:28:59'),
(3, 'Rabu', 3, 'Aktif', '2025-10-13 10:29:30', '2025-10-13 10:29:30'),
(4, 'Kamis', 4, 'Aktif', '2025-10-13 10:29:54', '2025-10-13 10:29:54'),
(5, 'Jumat', 5, 'Aktif', '2025-10-13 10:30:03', '2025-10-13 10:30:03'),
(6, 'Sabtu', 6, 'Tidak Aktif', '2025-10-13 10:30:16', '2025-10-13 10:30:16'),
(7, 'Minggu', 7, 'Tidak Aktif', '2025-10-13 10:30:30', '2025-10-13 10:30:30');

-- --------------------------------------------------------

--
-- Table structure for table `master_jenis_supplier`
--

CREATE TABLE `master_jenis_supplier` (
  `id` int UNSIGNED NOT NULL,
  `kode` varchar(50) NOT NULL,
  `keterangan` varchar(150) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_jenis_supplier`
--

INSERT INTO `master_jenis_supplier` (`id`, `kode`, `keterangan`, `status`, `created_at`, `updated_at`) VALUES
(2, 'SUP001', 'Supplier Elektronik', 1, '2025-11-03 23:12:50', '2025-11-03 23:12:50'),
(3, 'JSPU01', 'Bahan Bangunan', 1, '2025-11-08 17:21:24', '2025-11-08 17:21:24'),
(4, 'JSUP-001', 'Supplier Bahan Pokok', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(5, 'JSUP-002', 'Supplier Alat Tulis Kantor (ATK)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(6, 'JSUP-003', 'Supplier Farmasi / Obat-obatan', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(7, 'JSUP-004', 'Supplier Makanan Ringan & Minuman', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(8, 'JSUP-005', 'Supplier Produk Segar (Buah/Sayur)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(9, 'JSUP-006', 'Supplier Daging dan Ikan', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(10, 'JSUP-007', 'Supplier Perlengkapan Komputer', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(11, 'JSUP-008', 'Supplier Pakaian dan Tekstil', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(12, 'JSUP-009', 'Supplier Otomotif (Suku Cadang)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(13, 'JSUP-010', 'Supplier Jasa (Contoh: Kebersihan)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(14, 'JSUP-011', 'Supplier Furnitur dan Mebel', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(15, 'JSUP-012', 'Supplier Bahan Kimia Industri', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(16, 'JSUP-013', 'Supplier Peralatan Dapur (Horeca)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(17, 'JSUP-014', 'Supplier Mainan Anak', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(18, 'JSUP-015', 'Supplier Kosmetik dan Perawatan Tubuh', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(19, 'JSUP-016', 'Supplier Material Promosi (Percetakan)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(20, 'JSUP-017', 'Supplier Impor (Umum)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(21, 'JSUP-018', 'Supplier Lokal (UMKM)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(22, 'JSUP-019', 'Supplier Alat Olahraga', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(23, 'JSUP-020', 'Supplier Perlengkapan Bayi', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(24, 'JSUP-021', 'Supplier Jasa Logistik', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(25, 'JSUP-022', 'Supplier Peralatan Listrik', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(26, 'JSUP-023', 'Supplier Kemasan (Packaging)', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(27, 'JSUP-024', 'Supplier Bahan Baku Manufaktur', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52'),
(28, 'JSUP-025', 'Supplier Lain-lain', 1, '2025-11-09 08:00:52', '2025-11-09 08:00:52');

-- --------------------------------------------------------

--
-- Table structure for table `master_kategori_barang`
--

CREATE TABLE `master_kategori_barang` (
  `id_kategori` int UNSIGNED NOT NULL,
  `kode_barang` varchar(50) NOT NULL,
  `kategori_barang` varchar(50) NOT NULL,
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `keterangan` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_kategori_barang`
--

INSERT INTO `master_kategori_barang` (`id_kategori`, `kode_barang`, `kategori_barang`, `status`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 'A002', 'Furnituree', 'Aktif', 'This category includes various furniture items.', '2025-10-14 04:20:44', '2025-10-14 04:20:44'),
(4, 'A004', 'Elektronik', 'Aktif', 'kkk', '2025-10-14 04:54:15', '2025-10-14 04:54:15'),
(5, 'A001', 'Alat Tulis Kantor (ATK)', 'Aktif', 'Kategori untuk Alat Tulis Kantor', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(6, 'A003', 'Perlengkapan Komputer', 'Aktif', 'Kategori untuk Perlengkapan Komputer', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(7, 'A005', 'Bahan Bangunan', 'Aktif', 'Kategori untuk Bahan Bangunan', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(8, 'A006', 'Makanan Ringan', 'Aktif', 'Kategori untuk Makanan Ringan', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(9, 'A007', 'Minuman Kemasan', 'Aktif', 'Kategori untuk Minuman Kemasan', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(10, 'A008', 'Produk Susu', 'Aktif', 'Kategori untuk Produk Susu', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(11, 'A009', 'Bumbu Dapur', 'Aktif', 'Kategori untuk Bumbu Dapur', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(12, 'A010', 'Obat-obatan', 'Aktif', 'Kategori untuk Obat-obatan', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(13, 'A011', 'Perlengkapan Mandi', 'Aktif', 'Kategori untuk Perlengkapan Mandi', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(14, 'A012', 'Produk Pembersih', 'Aktif', 'Kategori untuk Produk Pembersih', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(15, 'A013', 'Pakaian Pria', 'Aktif', 'Kategori untuk Pakaian Pria', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(16, 'A014', 'Pakaian Wanita', 'Aktif', 'Kategori untuk Pakaian Wanita', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(17, 'A015', 'Pakaian Anak', 'Aktif', 'Kategori untuk Pakaian Anak', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(18, 'A016', 'Sepatu dan Sandal', 'Aktif', 'Kategori untuk Sepatu dan Sandal', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(19, 'A017', 'Tas dan Aksesoris', 'Aktif', 'Kategori untuk Tas dan Aksesoris', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(20, 'A018', 'Peralatan Olahraga', 'Aktif', 'Kategori untuk Peralatan Olahraga', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(21, 'A019', 'Mainan Anak', 'Aktif', 'Kategori untuk Mainan Anak', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(22, 'A020', 'Buku dan Majalah', 'Aktif', 'Kategori untuk Buku dan Majalah', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(23, 'A021', 'Peralatan Dapur', 'Aktif', 'Kategori untuk Peralatan Dapur', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(24, 'A022', 'Dekorasi Rumah', 'Aktif', 'Kategori untuk Dekorasi Rumah', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(25, 'A023', 'Otomotif - Oli', 'Aktif', 'Kategori untuk Otomotif - Oli', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(26, 'A024', 'Otomotif - Suku Cadang', 'Aktif', 'Kategori untuk Otomotif - Suku Cadang', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(27, 'A025', 'Perkakas', 'Aktif', 'Kategori untuk Perkakas', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(28, 'A026', 'Perlengkapan Kebun', 'Aktif', 'Kategori untuk Perlengkapan Kebun', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(29, 'A027', 'Makanan Hewan', 'Aktif', 'Kategori untuk Makanan Hewan', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(30, 'A028', 'Buah-buahan', 'Aktif', 'Kategori untuk Buah-buahan', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(31, 'A029', 'Sayuran', 'Aktif', 'Kategori untuk Sayuran', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(32, 'A030', 'Daging dan Ikan', 'Aktif', 'Kategori untuk Daging dan Ikan', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(33, 'A031', 'Makanan Beku (Frozen)', 'Aktif', 'Kategori untuk Makanan Beku', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(34, 'A032', 'Roti dan Kue', 'Aktif', 'Kategori untuk Roti dan Kue', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(35, 'A033', 'Kopi dan Teh', 'Aktif', 'Kategori untuk Kopi dan Teh', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(36, 'A034', 'Produk Bayi', 'Aktif', 'Kategori untuk Produk Bayi', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(37, 'A035', 'Kesehatan & Kecantikan', 'Aktif', 'Kategori untuk Kesehatan & Kecantikan', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(38, 'A036', 'Hobi dan Koleksi', 'Aktif', 'Kategori untuk Hobi dan Koleksi', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(39, 'A037', 'Musik dan Film', 'Aktif', 'Kategori untuk Musik dan Film', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(40, 'A038', 'Perlengkapan Pesta', 'Aktif', 'Kategori untuk Perlengkapan Pesta', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(41, 'A039', 'Baterai', 'Aktif', 'Kategori untuk Baterai', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(42, 'A040', 'Lampu', 'Aktif', 'Kategori untuk Lampu', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(43, 'A041', 'Perlengkapan Jahit', 'Aktif', 'Kategori untuk Perlengkapan Jahit', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(44, 'A042', 'Tekstil Rumah', 'Aktif', 'Kategori untuk Tekstil Rumah', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(45, 'A043', 'Koper dan Tas Travel', 'Aktif', 'Kategori untuk Koper dan Tas Travel', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(46, 'A045', 'Alat Musik', 'Aktif', 'Kategori untuk Alat Musik', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(47, 'A046', 'Perlengkapan Lukis', 'Aktif', 'Kategori untuk Perlengkapan Lukis', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(48, 'A047', 'Souvenir', 'Aktif', 'Kategori untuk Souvenir', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(49, 'A048', 'Perlengkapan Ibadah', 'Aktif', 'Kategori untuk Perlengkapan Ibadah', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(50, 'A049', 'Listrik', 'Aktif', 'Kategori untuk Listrik', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(51, 'A050', 'Material Promosi', 'Aktif', 'Kategori untuk Material Promosi', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(52, 'A051', 'Barang Pecah Belah', 'Aktif', 'Kategori untuk Barang Pecah Belah', '2025-11-09 07:59:59', '2025-11-09 07:59:59'),
(53, 'A052', 'Plastik Rumah Tangga', 'Aktif', 'Kategori untuk Plastik Rumah Tangga', '2025-11-09 07:59:59', '2025-11-09 07:59:59');

-- --------------------------------------------------------

--
-- Table structure for table `master_klien`
--

CREATE TABLE `master_klien` (
  `KLIEN_ID` bigint UNSIGNED NOT NULL,
  `EMAIL` varchar(120) NOT NULL,
  `NAMA` varchar(120) NOT NULL,
  `NO_TELP` varchar(20) NOT NULL,
  `ALAMAT` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_klien`
--

INSERT INTO `master_klien` (`KLIEN_ID`, `EMAIL`, `NAMA`, `NO_TELP`, `ALAMAT`, `created_at`, `updated_at`) VALUES
(2, 'neelam@gmail.com', 'KHANZA NEELAM', '085607910959', 'madiun', '2025-12-05 22:55:14', '2025-12-05 22:55:14');

-- --------------------------------------------------------

--
-- Table structure for table `master_kodebarang`
--

CREATE TABLE `master_kodebarang` (
  `id_kode_barang` int UNSIGNED NOT NULL,
  `kode_barang` varchar(50) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_kodebarang`
--

INSERT INTO `master_kodebarang` (`id_kode_barang`, `kode_barang`, `created_at`, `updated_at`) VALUES
(2, 'A002', '2025-10-13 11:53:08', '2025-10-13 11:53:08'),
(3, 'A004', '2025-10-14 02:43:24', '2025-10-14 02:43:24'),
(4, 'A001', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(5, 'A003', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(6, 'A005', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(7, 'A006', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(8, 'A007', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(9, 'A008', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(10, 'A009', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(11, 'A010', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(12, 'A011', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(13, 'A012', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(14, 'A013', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(15, 'A014', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(16, 'A015', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(17, 'A016', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(18, 'A017', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(19, 'A018', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(20, 'A019', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(21, 'A020', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(22, 'A021', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(23, 'A022', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(24, 'A023', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(25, 'A024', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(26, 'A025', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(27, 'A026', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(28, 'A027', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(29, 'A028', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(30, 'A029', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(31, 'A030', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(32, 'A031', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(33, 'A032', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(34, 'A033', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(35, 'A034', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(36, 'A035', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(37, 'A036', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(38, 'A037', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(39, 'A038', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(40, 'A039', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(41, 'A040', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(42, 'A041', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(43, 'A042', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(44, 'A043', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(45, 'A044', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(46, 'A045', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(47, 'A046', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(48, 'A047', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(49, 'A048', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(50, 'A049', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(51, 'A050', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(52, 'A051', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(53, 'A052', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(54, 'A053', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(55, 'A054', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(56, 'A055', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(57, 'A056', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(58, 'A057', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(59, 'A058', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(60, 'A059', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(61, 'A060', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(62, 'A061', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(63, 'A062', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(64, 'A063', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(65, 'A064', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(66, 'A065', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(67, 'A066', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(68, 'A067', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(69, 'A068', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(70, 'A069', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(71, 'A070', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(72, 'A071', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(73, 'A072', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(74, 'A073', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(75, 'A074', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(76, 'A075', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(77, 'A076', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(78, 'A077', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(79, 'A078', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(80, 'A079', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(81, 'A080', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(82, 'A081', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(83, 'A082', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(84, 'A083', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(85, 'A084', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(86, 'A085', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(87, 'A086', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(88, 'A087', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(89, 'A088', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(90, 'A089', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(91, 'A090', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(92, 'A091', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(93, 'A092', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(94, 'A093', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(95, 'A094', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(96, 'A095', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(97, 'A096', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(98, 'A097', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(99, 'A098', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(100, 'A099', '2025-11-09 07:58:08', '2025-11-09 07:58:08'),
(101, 'A100', '2025-11-09 07:58:08', '2025-11-09 07:58:08');

-- --------------------------------------------------------

--
-- Table structure for table `master_produk`
--

CREATE TABLE `master_produk` (
  `id_produk` bigint UNSIGNED NOT NULL,
  `kode_produk` varchar(255) NOT NULL,
  `nama_produk` varchar(255) NOT NULL,
  `kode_barcode` varchar(50) DEFAULT NULL,
  `jenis` enum('Barang','Jasa') DEFAULT 'Barang',
  `kode_kategori` varchar(50) DEFAULT NULL,
  `kode_gudang` varchar(50) DEFAULT NULL,
  `kode_rak` varchar(50) DEFAULT NULL,
  `kode_supplier` varchar(15) DEFAULT NULL,
  `tanggal_kadaluarsa` date DEFAULT NULL,
  `punya_kadaluarsa` tinyint(1) DEFAULT '0',
  `berat` decimal(10,2) DEFAULT '0.00',
  `diskon` decimal(5,2) DEFAULT '0.00',
  `kena_pajak` tinyint(1) DEFAULT '0',
  `kode_satuan_1` varchar(50) DEFAULT NULL,
  `konversi_1` decimal(10,2) DEFAULT '1.00',
  `stok_awal_1` decimal(15,2) DEFAULT '0.00',
  `min_stock_1` decimal(15,2) DEFAULT '0.00',
  `max_stock_1` decimal(15,2) DEFAULT '0.00',
  `harga_beli_1` decimal(19,4) DEFAULT '0.0000',
  `harga_jual_1` decimal(19,4) DEFAULT '0.0000',
  `kode_satuan_2` varchar(50) DEFAULT NULL,
  `konversi_2` decimal(10,2) DEFAULT NULL,
  `stok_awal_2` decimal(15,2) DEFAULT NULL,
  `min_stock_2` decimal(15,2) DEFAULT NULL,
  `max_stock_2` decimal(15,2) DEFAULT NULL,
  `harga_beli_2` decimal(19,4) DEFAULT NULL,
  `harga_jual_2` decimal(19,4) DEFAULT NULL,
  `kode_satuan_3` varchar(50) DEFAULT NULL,
  `konversi_3` decimal(10,2) DEFAULT NULL,
  `stok_awal_3` decimal(15,2) DEFAULT NULL,
  `min_stock_3` decimal(15,2) DEFAULT NULL,
  `max_stock_3` decimal(15,2) DEFAULT NULL,
  `harga_beli_3` decimal(19,4) DEFAULT NULL,
  `harga_jual_3` decimal(19,4) DEFAULT NULL,
  `file_gambar_1` varchar(255) DEFAULT NULL,
  `file_gambar_2` varchar(255) DEFAULT NULL,
  `file_gambar_3` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_produk`
--

INSERT INTO `master_produk` (`id_produk`, `kode_produk`, `nama_produk`, `kode_barcode`, `jenis`, `kode_kategori`, `kode_gudang`, `kode_rak`, `kode_supplier`, `tanggal_kadaluarsa`, `punya_kadaluarsa`, `berat`, `diskon`, `kena_pajak`, `kode_satuan_1`, `konversi_1`, `stok_awal_1`, `min_stock_1`, `max_stock_1`, `harga_beli_1`, `harga_jual_1`, `kode_satuan_2`, `konversi_2`, `stok_awal_2`, `min_stock_2`, `max_stock_2`, `harga_beli_2`, `harga_jual_2`, `kode_satuan_3`, `konversi_3`, `stok_awal_3`, `min_stock_3`, `max_stock_3`, `harga_beli_3`, `harga_jual_3`, `file_gambar_1`, `file_gambar_2`, `file_gambar_3`, `created_at`, `updated_at`) VALUES
(201, 'BB001', 'Tepung Terigu Segitiga Biru', 'BC026', 'Barang', 'A006', 'G002', 'R003', 'S-002', '2026-12-31', 1, '1000.00', '0.05', 1, 'GR', '1.00', '50000.00', '1000.00', '100000.00', '8000.0000', '10000.0000', 'KG', '1000.00', '50.00', '5.00', '100.00', '750000.0000', '950000.0000', 'ZAK', '25000.00', '2.00', '0.00', '5.00', '1800000.0000', '2200000.0000', 'tepung_terigu_sb.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(202, 'BB002', 'Gula Pasir Kristal Putih', 'BC027', 'Barang', 'A006', 'G002', 'R004', 'S-002', '2025-11-25', 1, '1000.00', '0.00', 1, 'GR', '1.00', '10000.00', '500.00', '20000.00', '13000.0000', '15000.0000', 'KG', '1000.00', '10.00', '1.00', '30.00', '125000.0000', '145000.0000', 'KRG', '50000.00', '1.00', '0.00', '3.00', '6000000.0000', '7000000.0000', '/uploads/produk/file_gambar_1-1762693348699-151498390.jpeg', '/uploads/produk/file_gambar_2-1762693348700-556871652.jpeg', '/uploads/produk/file_gambar_3-1762693348702-593114763.jpg', '2025-11-09 12:58:50', '2025-11-09 13:02:29'),
(203, 'BB003', 'Minyak Goreng Sawit 2 Liter', 'BC028', 'Barang', 'A009', 'G006', 'R005', 'S-002', '2025-10-30', 1, '1800.00', '0.10', 1, 'ML', '1.00', '20000.00', '500.00', '40000.00', '25000.0000', '30000.0000', 'LTR', '1000.00', '20.00', '2.00', '50.00', '12000.0000', '14000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'minyak_goreng.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(204, 'BB004', 'Telur Ayam Grade A', NULL, 'Barang', 'A008', 'G007', 'R018', 'S-006', '2025-01-15', 1, '60.00', '0.00', 0, 'BUTIR', '1.00', '500.00', '50.00', '1000.00', '2000.0000', '2500.0000', 'KG', '16.00', '30.00', '3.00', '50.00', '32000.0000', '40000.0000', 'TRAY', '480.00', '10.00', '1.00', '20.00', '60000.0000', '75000.0000', 'telur_ayam.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(205, 'BB005', 'Garam Beryodium Halus', 'BC029', 'Barang', 'A009', 'G002', 'R003', 'S-002', NULL, 0, '500.00', '0.00', 1, 'GR', '1.00', '10000.00', '500.00', '20000.00', '2000.0000', '3000.0000', 'ZAK', '50000.00', '5.00', '1.00', '10.00', '150000.0000', '200000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'garam.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(206, 'BB006', 'Jasa Pemotongan Daging', NULL, 'Jasa', 'A025', NULL, NULL, NULL, NULL, 0, '0.00', '0.00', 0, 'JAM', '1.00', '0.00', '0.00', '0.00', '50000.0000', '75000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', NULL, NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(207, 'BB007', 'Coklat Bubuk Murni', 'BC030', 'Barang', 'A006', 'G002', 'R004', 'S-002', '2026-10-01', 1, '100.00', '0.00', 1, 'GR', '1.00', '2000.00', '100.00', '5000.00', '25000.0000', '35000.0000', 'KG', '1000.00', '2.00', '0.00', '5.00', '240000.0000', '320000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'coklat_bubuk.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(208, 'BB008', 'Plastik Kemasan 10x15cm', NULL, 'Barang', 'A025', 'G008', 'R012', 'S-023', NULL, 0, '5.00', '0.00', 0, 'PCS', '1.00', '5000.00', '500.00', '10000.00', '100.0000', '150.0000', 'PK', '100.00', '50.00', '5.00', '100.00', '9000.0000', '14000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'plastik_kemasan.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(209, 'BB009', 'Mentega Blue Band 200gr', 'BC031', 'Barang', 'A009', 'G007', 'R019', 'S-002', '2025-06-20', 1, '200.00', '0.00', 1, 'GR', '1.00', '500.00', '50.00', '1000.00', '10000.0000', '13000.0000', 'PCS', '200.00', '2.00', '0.00', '5.00', '19000.0000', '25000.0000', 'DUS', '2400.00', '1.00', '0.00', '2.00', '220000.0000', '300000.0000', 'mentega.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(210, 'BB010', 'Keju Cheddar Prochiz 160gr', 'BC032', 'Barang', 'A008', 'G007', 'R019', 'S-006', '2025-08-01', 1, '160.00', '0.05', 1, 'GR', '1.00', '1000.00', '100.00', '2000.00', '12000.0000', '15000.0000', 'PCS', '160.00', '5.00', '1.00', '10.00', '19000.0000', '24000.0000', 'KRTN', '9600.00', '1.00', '0.00', '1.00', '1100000.0000', '1500000.0000', 'keju_cheddar.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(211, 'BB011', 'Biang Ragi Instan', NULL, 'Barang', 'A006', 'G002', 'R003', 'S-002', '2026-05-01', 1, '11.00', '0.00', 1, 'GR', '1.00', '500.00', '50.00', '1000.00', '3000.0000', '4500.0000', 'SACHET', '11.00', '45.00', '5.00', '90.00', '33000.0000', '48000.0000', 'DUS', '450.00', '5.00', '1.00', '10.00', '1300000.0000', '1900000.0000', 'ragi.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(212, 'BB012', 'Pewarna Makanan Merah Cabe', NULL, 'Barang', 'A009', 'G006', 'R005', 'S-002', '2027-01-01', 1, '30.00', '0.00', 1, 'ML', '1.00', '100.00', '10.00', '300.00', '5000.0000', '8000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'pewarna.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(213, 'BB013', 'Susu Bubuk Full Cream', 'BC033', 'Barang', 'A008', 'G002', 'R004', 'S-006', '2025-07-01', 1, '500.00', '0.10', 1, 'GR', '1.00', '10000.00', '500.00', '20000.00', '40000.0000', '50000.0000', 'KG', '1000.00', '10.00', '1.00', '20.00', '75000.0000', '95000.0000', 'BOX', '10000.00', '1.00', '0.00', '5.00', '700000.0000', '900000.0000', 'susu_bubuk.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(214, 'BB014', 'Daun Bawang Segar', NULL, 'Barang', 'A009', 'G007', 'R018', 'S-006', '2024-11-15', 1, '100.00', '0.00', 0, 'GR', '1.00', '5000.00', '500.00', '10000.00', '2000.0000', '3000.0000', 'IKAT', '1000.00', '5.00', '1.00', '10.00', '15000.0000', '25000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'daun_bawang.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(215, 'BB015', 'Tinta Printer Hitam A10', 'BC001', 'Barang', 'A001', 'G010', 'R015', 'S-008', NULL, 0, '50.00', '0.00', 1, 'ML', '1.00', '100.00', '10.00', '200.00', '5000.0000', '8000.0000', 'PCS', '50.00', '2.00', '0.00', '5.00', '240000.0000', '350000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'tinta_printer.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(216, 'BB016', 'Jasa Konsultasi Pajak', NULL, 'Jasa', 'A001', NULL, NULL, NULL, NULL, 0, '0.00', '0.00', 1, 'JAM', '1.00', '0.00', '0.00', '0.00', '500000.0000', '750000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', NULL, NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(217, 'BB017', 'Kentang Dieng Grade B', NULL, 'Barang', 'A006', 'G007', 'R018', 'S-006', '2024-12-30', 1, '1000.00', '0.00', 0, 'GR', '1.00', '50000.00', '5000.00', '100000.00', '8000.0000', '10000.0000', 'KG', '1000.00', '50.00', '5.00', '100.00', '7500.0000', '9500.0000', 'KRG', '25000.00', '2.00', '0.00', '5.00', '175000.0000', '220000.0000', 'kentang.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(218, 'BB018', 'Kopi Arabika Giling Halus', 'BC034', 'Barang', 'A007', 'G006', 'R004', 'S-002', NULL, 0, '250.00', '0.00', 1, 'GR', '1.00', '10000.00', '100.00', '20000.00', '50000.0000', '70000.0000', 'PCS', '250.00', '40.00', '4.00', '80.00', '120000.0000', '170000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'kopi_bubuk.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(219, 'BB019', 'Soda Kue (Baking Soda)', 'BC035', 'Barang', 'A009', 'G002', 'R003', 'S-002', '2027-03-01', 1, '500.00', '0.00', 1, 'GR', '1.00', '5000.00', '500.00', '10000.00', '15000.0000', '20000.0000', 'KG', '1000.00', '5.00', '1.00', '10.00', '13000.0000', '18000.0000', NULL, '0.00', '0.00', '0.00', '0.00', '0.0000', '0.0000', 'soda_kue.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(220, 'BB020', 'Kotak Kardus Kemasan Coklat', NULL, 'Barang', 'A025', 'G008', 'R011', 'S-023', NULL, 0, '200.00', '0.00', 0, 'PCS', '1.00', '1000.00', '100.00', '2000.00', '3000.0000', '4500.0000', 'PK', '10.00', '100.00', '10.00', '200.00', '25000.0000', '40000.0000', 'KRTN', '100.00', '5.00', '1.00', '10.00', '200000.0000', '350000.0000', 'kotak_kardus.jpg', NULL, NULL, '2025-11-09 12:58:50', '2025-11-09 12:58:50'),
(221, 'PRD-251109-200548', 'Gula Pasir Kristal Putih', 'BC003', 'Jasa', 'A005', 'G003', 'R003', 'S-003', '2025-11-18', 1, '1000.00', '10.00', 1, 'BJ', '1.00', '10000000.00', '100000.00', '100000.00', '200.0000', '1000.0000', 'BTL', '2.00', '1000.00', '10000.00', '1000.00', '222.0000', '10.0000', 'BTG', '3.00', '1.00', '1.00', '1.00', '10.0000', '20.0000', '/uploads/produk/file_gambar_1-1762693807965-239806609.jpeg', '/uploads/produk/file_gambar_2-1762693807966-765283619.jpg', '/uploads/produk/file_gambar_3-1762693807971-216429089.jpg', '2025-11-09 13:05:48', '2025-11-09 13:10:08'),
(222, 'PRD-251109-212351', 'TEPUNG', 'BC002', 'Barang', 'A005', 'G004', 'R003', 'S-003', '2025-11-26', 1, '1000.00', '10.00', 1, 'BTL', '1.00', '1000.00', '100.00', '1000.00', '2000.0000', '2200.0000', 'BTG', '2.00', '1.00', '1.00', '1.00', '10.0000', '10.0000', 'BTG', '3.00', '10.00', '10.00', '10.00', '10.0000', '10.0000', '/uploads/produk/file_gambar_1-1762698231113-147846959.png', '/uploads/produk/file_gambar_2-1762698231114-288949830.png', '/uploads/produk/file_gambar_3-1762698231117-988473960.png', '2025-11-09 14:23:51', '2025-11-09 14:23:51');

-- --------------------------------------------------------

--
-- Table structure for table `master_rak`
--

CREATE TABLE `master_rak` (
  `id_rak` int UNSIGNED NOT NULL,
  `kode` varchar(50) NOT NULL,
  `keterangan` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_rak`
--

INSERT INTO `master_rak` (`id_rak`, `kode`, `keterangan`, `created_at`, `updated_at`) VALUES
(1, 'R001', 'Rak', '2025-10-27 16:41:56', '2025-10-27 16:41:56'),
(2, 'R002', 'Rak', '2025-10-27 16:42:42', '2025-10-28 03:31:59'),
(3, 'R003', 'Rak A-01 (Bahan Baku Kering)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(4, 'R004', 'Rak A-02 (Bahan Baku Kering)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(5, 'R005', 'Rak A-03 (Bahan Baku Cair)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(6, 'R006', 'Rak B-01 (Barang Jadi Box)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(7, 'R007', 'Rak B-02 (Barang Jadi Box)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(8, 'R008', 'Rak B-03 (Barang Jadi Ecer)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(9, 'R009', 'Rak C-01 (Retur / Karantina)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(10, 'R010', 'Rak C-02 (Barang Rusak)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(11, 'R011', 'Rak D-01 (Bahan Pengemas)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(12, 'R012', 'Rak D-02 (Kardus & Plastik)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(13, 'R013', 'Rak E-01 (Spare Part Mesin)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(14, 'R014', 'Rak E-02 (Oli & Pelumas)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(15, 'R015', 'Rak F-01 (ATK & Kertas)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(16, 'R016', 'Rak F-02 (Arsip)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(17, 'R017', 'Rak G-01 (Material Promosi)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(18, 'R018', 'Rak CS-01 (Cold Storage - Daging)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(19, 'R019', 'Rak CS-02 (Cold Storage - Susu)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(20, 'R020', 'Rak TR-01 (Area Transit In)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(21, 'R021', 'Rak TR-02 (Area Transit Out)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(22, 'R022', 'Rak H-01 (Alat Kebersihan)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(23, 'R023', 'Rak J-01 (Bahan Kimia)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(24, 'R024', 'Rak J-02 (Bahan Mudah Terbakar)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(25, 'R025', 'Rak K-01 (Peralatan Produksi)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(26, 'R026', 'Rak L-01 (Dokumen Aktif)', '2025-11-09 08:03:26', '2025-11-09 08:03:26'),
(27, 'R027', 'Rak M-01 (Seragam & APD)', '2025-11-09 08:03:26', '2025-11-09 08:03:26');

-- --------------------------------------------------------

--
-- Table structure for table `master_satuan_barang`
--

CREATE TABLE `master_satuan_barang` (
  `id_satuan` int UNSIGNED NOT NULL,
  `kode` varchar(50) NOT NULL,
  `satuan_barang` varchar(50) NOT NULL,
  `keterangan` varchar(255) DEFAULT NULL,
  `status` enum('Aktif','Tidak Aktif') DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_satuan_barang`
--

INSERT INTO `master_satuan_barang` (`id_satuan`, `kode`, `satuan_barang`, `keterangan`, `status`, `created_at`, `updated_at`) VALUES
(1, 'PCS', 'Pieces', 'Satuan default barang', 'Aktif', '2025-10-15 03:34:44', '2025-10-15 03:35:10'),
(2, 'BJ', 'BIJI', 'Biji', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(3, 'BKS', 'BUNGKUS', 'Bungkusan', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(4, 'BTG', 'BATANG', 'Batang', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(5, 'BTL', 'BOTOL', 'Botol', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(6, 'CP', 'CUP', 'Cangkir', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(7, 'DUS', 'DUS', 'Dus', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(8, 'GLS', 'GELAS', 'Gelas', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(9, 'KG', 'KILOGRAM', 'Kilogram', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:58:22'),
(10, 'KRG', 'KARUNG', 'Karung', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(11, 'KRTN', 'KARTON', 'Karton', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(12, 'LBR', 'LEMBAR', 'Lembar', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(13, 'LTR', 'LITER', 'Liter', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(14, 'MGK', 'MANGKUK', 'Mangkuk', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(15, 'PK', 'PAK', 'Pak', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(16, 'PRG', 'PIRING', 'Piring', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(17, 'PTG', 'POTONG', 'Potong', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(18, 'SLP', 'SLOP', 'Slop', 'Aktif', '2025-10-15 03:57:27', '2025-10-15 03:57:27'),
(19, 'GR', 'GRAM', 'Satuan berat', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08'),
(20, 'ZAK', 'ZAK', 'Satuan karung besar/berat', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08'),
(21, 'JAM', 'JAM', 'Satuan waktu (untuk jasa)', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08'),
(22, 'BUTIR', 'BUTIR', 'Satuan hitung untuk telur, dll.', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08'),
(23, 'TRAY', 'TRAY', 'Satuan wadah telur', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08'),
(24, 'SACHET', 'SACHET', 'Satuan kemasan kecil', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08'),
(25, 'BOX', 'BOX', 'Satuan kemasan kotak', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08'),
(26, 'ML', 'MILILITER', 'Satuan volume', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08'),
(27, 'IKAT', 'IKAT', 'Satuan untuk sayuran, dll.', 'Aktif', '2025-11-09 12:57:08', '2025-11-09 12:57:08');

-- --------------------------------------------------------

--
-- Table structure for table `master_stok_supplier`
--

CREATE TABLE `master_stok_supplier` (
  `id` int UNSIGNED NOT NULL,
  `kode_supplier` varchar(15) NOT NULL,
  `kode_barcode` varchar(50) NOT NULL,
  `reorder_point` decimal(10,2) DEFAULT '0.00',
  `sisa_stok` decimal(10,2) DEFAULT '0.00',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `master_stok_supplier`
--

INSERT INTO `master_stok_supplier` (`id`, `kode_supplier`, `kode_barcode`, `reorder_point`, `sisa_stok`, `created_at`, `updated_at`) VALUES
(2, 'S-001', 'BC001', '200.00', '200.00', '2025-11-05 15:24:16', '2025-11-05 15:24:16');

-- --------------------------------------------------------

--
-- Table structure for table `master_supplier`
--

CREATE TABLE `master_supplier` (
  `id` int UNSIGNED NOT NULL,
  `kode_supplier` varchar(15) NOT NULL,
  `nama_supplier` varchar(150) NOT NULL,
  `alamat` text,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pic` varchar(100) DEFAULT NULL,
  `kode_jenis` varchar(50) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_billing`
--

CREATE TABLE `transaksi_billing` (
  `BILLING_ID` int UNSIGNED NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `PROJEK_ID` bigint UNSIGNED NOT NULL COMMENT 'Kunci asing dari tabel transaksi_projek',
  `TIPE_TRANSAKSI` varchar(50) NOT NULL COMMENT 'Jenis record: "INVOICE" atau "PAYMENT"',
  `NOMOR_INVOICE` varchar(100) DEFAULT NULL COMMENT 'Nomor tagihan/invoice (misal: INV-2025-001)',
  `JUMLAH_TAGIHAN` decimal(14,2) DEFAULT NULL COMMENT 'Jumlah uang yang ditagihkan untuk termin ini',
  `TANGGAL_JATUH_TEMPO` date DEFAULT NULL COMMENT 'Tanggal terakhir pembayaran',
  `STATUS_TAGIHAN` varchar(50) DEFAULT NULL COMMENT 'Status tagihan: "Unpaid", "Paid", "Overdue"',
  `JUMLAH_PEMBAYARAN` decimal(14,2) DEFAULT NULL COMMENT 'Jumlah uang yang masuk pada transaksi ini',
  `METODE_PEMBAYARAN` varchar(50) DEFAULT NULL COMMENT 'Metode pembayaran (misal: Bank Transfer, E-Wallet)',
  `REF_TRANSAKSI` varchar(100) DEFAULT NULL COMMENT 'Nomor referensi dari bank atau penyedia pembayaran',
  `CATATAN` text COMMENT 'Catatan tambahan untuk transaksi atau tagihan ini'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaksi_billing`
--

INSERT INTO `transaksi_billing` (`BILLING_ID`, `created_at`, `updated_at`, `PROJEK_ID`, `TIPE_TRANSAKSI`, `NOMOR_INVOICE`, `JUMLAH_TAGIHAN`, `TANGGAL_JATUH_TEMPO`, `STATUS_TAGIHAN`, `JUMLAH_PEMBAYARAN`, `METODE_PEMBAYARAN`, `REF_TRANSAKSI`, `CATATAN`) VALUES
(4, '2025-12-06 02:21:43', '2025-12-06 03:47:30', 5, 'INVOICE', 'INV-2025-003', '499000.00', '2025-12-04', 'Paid', '300000.00', 'Cash', NULL, 'pembayaran termin 1');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_blog`
--

CREATE TABLE `transaksi_blog` (
  `BLOG_ID` bigint UNSIGNED NOT NULL,
  `TITLE` varchar(255) NOT NULL,
  `SLUG` varchar(255) NOT NULL,
  `CONTENT` text NOT NULL,
  `EXCERPT` text,
  `AUTHOR_NAME` varchar(100) NOT NULL,
  `FEATURED_IMAGE_URL` varchar(500) DEFAULT NULL,
  `AUTHOR_IMAGE_URL` varchar(500) DEFAULT NULL,
  `CATEGORY` varchar(100) DEFAULT NULL,
  `TAGS` varchar(500) DEFAULT NULL,
  `PUBLISHED_DATE` timestamp NULL DEFAULT NULL,
  `VIEW_COUNT` bigint NOT NULL DEFAULT '0',
  `STATUS` varchar(50) NOT NULL DEFAULT 'Draft',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaksi_blog`
--

INSERT INTO `transaksi_blog` (`BLOG_ID`, `TITLE`, `SLUG`, `CONTENT`, `EXCERPT`, `AUTHOR_NAME`, `FEATURED_IMAGE_URL`, `AUTHOR_IMAGE_URL`, `CATEGORY`, `TAGS`, `PUBLISHED_DATE`, `VIEW_COUNT`, `STATUS`, `created_at`, `updated_at`) VALUES
(4, 'Create.tif: Solusi Web Development Berbasis AR dari Mahasiswa UNS untuk UMKM', 'create-tif-web-umkm-uns-ar', 'Halo pelaku UMKM! Apakah Anda kesulitan membawa produk lokal Anda ke ranah digital? Jangan khawatir, karena hadir Create.tif, sebuah platform web development khusus UMKM yang siap menjadi jembatan digital Anda. Create.tif adalah hasil inovasi dari tim hebat beranggotakan lima mahasiswa Universitas Sebelas Maret (UNS) Program Studi di Luar Kampus Utama (PSDKU) yang memiliki misi membantu UMKM lokal bertumbuh. Mereka tidak hanya menawarkan website biasa. Create.tif hadir dengan sentuhan kreativitas dan inovasi yang dilengkapi fitur teknologi canggih Augmented Reality (AR). Fitur AR ini memungkinkan konsumen melihat produk Anda dalam tampilan 3D yang interaktif, meningkatkan pengalaman belanja, dan tentu saja, peluang penjualan! Komitmen mereka dalam memajukan UMKM ini juga telah mengantarkan tim Create.tif menjadi peserta dalam ajang bergengsi WIBawa UNS 2025. Ini membuktikan bahwa Create.tif bukan sekadar proyek, melainkan solusi serius yang siap bersaing. Mengapa Create.tif? * Kreativitas & Inovasi: Website didesain unik, tidak template, mencerminkan brand Anda. * Teknologi AR: Fitur Augmented Reality untuk presentasi produk yang lebih menarik dan mendalam. * Fokus pada UMKM: Memahami kebutuhan, keterbatasan, dan potensi UMKM Indonesia. * Tim Berkomitmen: Dibuat oleh mahasiswa UNS PSDKU yang berdedikasi tinggi. Jangan tunda lagi! Saatnya UMKM Anda naik kelas dengan website profesional yang dilengkapi teknologi masa depan. Dukung inovasi mahasiswa Indonesia dan mari tumbuh bersama Create.tif!', 'Create.tif adalah platform web development khusus UMKM dengan fitur inovatif Augmented Reality (AR), dibuat oleh 5 mahasiswa UNS . Solusi digital kreatif untuk memajukan produk UMKM lokal.', 'Aulia Diva S', '/api/uploads/blog/featured_image-1764903129538-425462975.png', NULL, 'Technology', 'Create.tif, UNS, PSDKU, WIBawa UNS 2025, UMKM, Web Development, Augmented Reality, AR, Inovasi, Mahasiswa', '2025-11-30 17:00:00', 53, 'Published', '2025-12-05 02:52:10', '2025-12-05 23:03:19'),
(5, 'Mengapa Website Bukan Lagi Pilihan, Tapi Kewajiban Mutlak bagi Bisnis Modern', 'website-kewajiban-bisnis-modern', 'Di era digital ini, kehadiran online bukan lagi sekadar tren, melainkan fondasi utama keberhasilan bisnis. Sosial media memang penting, tetapi website adalah rumah digital Anda—aset paling berharga yang Anda kontrol sepenuhnya. Artikel ini akan mengupas tuntas alasan fundamental mengapa setiap bisnis, dari UMKM hingga korporasi besar, harus memiliki website profesional.\r\n\r\n\r\n\r\n---\r\n\r\n\r\n\r\n1. Kredibilitas dan Profesionalisme\r\n\r\n\r\nKonsumen modern cenderung mencari informasi dan membandingkan produk secara online. Sebuah website yang profesional, rapi, dan informatif memberikan kesan kredibilitas instan. Tanpa website, bisnis Anda mungkin dianggap tidak serius atau bahkan tidak nyata, terutama jika dibandingkan dengan kompetitor yang memilikinya.\r\n\r\n\r\n\r\n2. Kontrol Penuh atas Merek dan Data\r\n\r\n\r\nDi platform pihak ketiga (seperti media sosial), Anda terikat oleh aturan dan algoritma mereka. Website memberikan Anda kontrol 100% atas branding, tata letak, dan cara Anda menyajikan produk. Lebih penting lagi, Anda memiliki akses penuh ke data pengunjung (first-party data), yang sangat berharga untuk strategi pemasaran di masa depan.\r\n\r\n\r\n\r\n3. Akses Pasar 24/7 dan Jangkauan Global\r\n\r\n\r\nToko fisik tutup, tetapi website Anda buka 24 jam sehari, 7 hari seminggu. Ini berarti potensi pelanggan dapat menemukan, mempelajari, dan bahkan membeli produk atau jasa Anda kapan saja, di mana saja. Website menghilangkan batasan geografis dan membuka pintu menuju pasar global.\r\n\r\n\r\n\r\n4. Efisiensi Biaya Pemasaran Jangka Panjang\r\n\r\n\r\nMeskipun ada biaya awal dalam pembuatan website, investasi ini jauh lebih efisien dalam jangka panjang dibandingkan iklan tradisional. Melalui SEO (Search Engine Optimization), website memungkinkan Anda menarik trafik organik (gratis) yang tertarget secara konsisten, menjadikan website sebagai salesman terbaik Anda yang bekerja non-stop.\r\n\r\n\r\n\r\n5. Media Pamer Portofolio dan Testimoni\r\n\r\n\r\nWebsite adalah platform terbaik untuk memamerkan portofolio, studi kasus, dan testimoni pelanggan. Ini adalah bukti sosial yang kuat yang dapat meyakinkan calon klien. Anda tidak hanya \'mengatakan\' bahwa Anda hebat, tetapi Anda \'menunjukkan\' bukti keberhasilan Anda secara terstruktur.\r\n\r\n\r\n\r\n---\r\n\r\n\r\n\r\nKesimpulan\r\n\r\n\r\nWebsite bukan sekadar brosur digital; ia adalah pusat operasional, alat pemasaran, dan mesin kredibilitas Anda. Jika bisnis Anda ingin bertahan, tumbuh, dan bersaing di masa depan, berinvestasi dalam website yang kuat adalah langkah yang tidak bisa ditunda lagi.', 'Ketahui lima alasan fundamental mengapa setiap bisnis, dari UMKM hingga korporasi, wajib memiliki website profesional. Website adalah aset digital krusial untuk kredibilitas, kontrol data, dan pertumbuhan jangka panjang di era digital.', 'Aulia Diva', '/api/uploads/blog/featured_image-1764975685212-453586301.jpg', NULL, 'Bisnis Digital', 'Bisnis Digital, Strategi Pemasaran, Web Development', '2025-12-05 17:00:00', 0, 'Published', '2025-12-05 23:01:25', '2025-12-05 23:01:25'),
(6, 'Dari Lokal ke Nasional: Tiga Pilar Strategis UMKM Naik Kelas di Era Digital', 'pilar-strategis-umkm-naik-kelas-digital', 'Setiap pelaku UMKM bermimpi untuk tidak hanya bertahan, tetapi juga berkembang pesat. Proses \"naik kelas\" membutuhkan lebih dari sekadar produk bagus—dibutuhkan strategi yang terencana. Terdapat tiga pilar utama yang wajib diperkuat oleh UMKM untuk transisi dari bisnis lokal menjadi pemain di pasar yang lebih luas.\r\n\r\n\r\n\r\n---\r\n\r\n\r\n\r\nPilar 1: Digitalisasi dan Kehadiran Resmi (Website)\r\n\r\n\r\nDi tengah persaingan ketat, kehadiran digital yang resmi menjadi pembeda utama. Media sosial bersifat sementara, sedangkan Website adalah aset permanen yang mencerminkan profesionalisme dan kesiapan skala:\r\n\r\n\r\nKredibilitas: Website memberikan kesan bahwa Anda adalah entitas bisnis yang serius dan terpercaya, memudahkan kolaborasi B2B atau pengajuan modal.\r\n\r\n\r\nEtalase Mandiri: Ini adalah platform tempat Anda mengontrol penuh branding dan presentasi produk, tanpa terpotong biaya komisi marketplace.\r\n\r\nOtomasi Layanan: Website memungkinkan integrasi sistem pemesanan, chatbot, hingga FAQ (Frequently Asked Questions), yang sangat mengurangi beban kerja administrasi harian dan memungkinkan UMKM fokus pada produksi.\r\n\r\n\r\n\r\nPilar 2: Inovasi Produk dan Standardisasi Mutu\r\n\r\n\r\nNaik kelas berarti harus mampu bersaing dalam hal kualitas dan keunikan. UMKM perlu secara berkelanjutan melakukan inovasi, baik pada produk inti maupun kemasan:\r\n\r\n\r\n Diferensiasi: Temukan keunikan produk yang tidak dimiliki kompetitor (Unique Selling Proposition). Apakah itu ramah lingkungan, bahan baku lokal, atau proses pembuatan yang unik?\r\n\r\n\r\n Sertifikasi: Standardisasi mutu, seperti izin PIRT, BPOM, atau sertifikasi Halal, membuka pintu pasar modern dan ritel besar. Standar yang jelas menunjukkan komitmen pada kualitas.\r\n\r\n\r\n\r\nPilar 3: Penguatan Manajemen Keuangan dan SDM\r\n\r\n\r\nTransisi dari kecil ke menengah sering terhambat oleh manajemen internal yang lemah. Bisnis yang ingin naik kelas harus memiliki sistem yang kuat:\r\n\r\n\r\nPencatatan Keuangan Digital: Tinggalkan pencatatan manual. Gunakan aplikasi akuntansi sederhana untuk memisahkan keuangan pribadi dan bisnis, serta melacak arus kas dengan akurat.\r\n\r\n\r\n Pembagian Tugas Jelas: Tentukan peran tim secara spesifik. Ketika owner mulai mendelegasikan tugas operasional, waktu dapat digunakan untuk perencanaan strategis, yang merupakan ciri khas bisnis yang sedang tumbuh.\r\n\r\n\r\n\r\n---\r\n\r\n\r\n\r\nWebsite adalah langkah awal yang krusial untuk mendigitalisasi dan membangun kredibilitas. Namun, keberhasilan UMKM naik kelas adalah kombinasi sinergis antara fondasi digital (website), mutu produk yang unggul, dan manajemen internal yang profesional. Fokus pada ketiga pilar ini akan memposisikan UMKM Anda untuk pertumbuhan yang stabil dan berkelanjutan.', 'Ketahui tiga pilar strategis yang dibutuhkan UMKM untuk naik kelas, mulai dari memiliki website sebagai fondasi kredibilitas dan kontrol branding, hingga standardisasi mutu produk dan penguatan manajemen keuangan internal.', 'Create.tif', '/api/uploads/blog/featured_image-1764976160710-353021652.jpg', NULL, 'Technology', 'Create.tif, UNS, PSDKU, WIBawa UNS 2025, UMKM, Web Development, Augmented Reality, AR, Inovasi, Mahasiswa', '2025-11-20 17:00:00', 0, 'Published', '2025-12-05 23:09:21', '2025-12-05 23:09:21');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_projek`
--

CREATE TABLE `transaksi_projek` (
  `PROJEK_ID` bigint UNSIGNED NOT NULL,
  `KLIEN_ID` bigint UNSIGNED NOT NULL,
  `NAMA_PROJEK` varchar(200) NOT NULL,
  `DESKRIPSI` text,
  `STATUS` varchar(50) DEFAULT 'Pending Review',
  `PROGRESS` int DEFAULT '0',
  `NILAI_PROJEK` decimal(15,2) DEFAULT NULL,
  `TANGGAL_MULAI` date DEFAULT NULL,
  `TANGGAL_SELESAI` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaksi_projek`
--

INSERT INTO `transaksi_projek` (`PROJEK_ID`, `KLIEN_ID`, `NAMA_PROJEK`, `DESKRIPSI`, `STATUS`, `PROGRESS`, `NILAI_PROJEK`, `TANGGAL_MULAI`, `TANGGAL_SELESAI`, `created_at`, `updated_at`) VALUES
(5, 2, 'Desain Ulang Website Portofolio', 'Merancang dan mengembangkan tampilan baru untuk website portofolio klien, termasuk migrasi konten lama dan peningkatan performa.', 'In Progress', 20, '999000.00', '2025-12-06', '2025-12-27', '2025-12-06 00:04:46', '2025-12-06 00:05:35');

-- --------------------------------------------------------

--
-- Table structure for table `transaksi_supplier`
--

CREATE TABLE `transaksi_supplier` (
  `id` int UNSIGNED NOT NULL,
  `kode_supplier` varchar(15) NOT NULL,
  `nama_supplier` varchar(150) NOT NULL,
  `alamat` text,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `pic` varchar(100) DEFAULT NULL,
  `kode_jenis` varchar(50) NOT NULL,
  `status` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `transaksi_supplier`
--

INSERT INTO `transaksi_supplier` (`id`, `kode_supplier`, `nama_supplier`, `alamat`, `telepon`, `email`, `pic`, `kode_jenis`, `status`, `created_at`, `updated_at`) VALUES
(2, 'S-001', 'PT. Sukses Jaya Elektronik', 'Jl. Glodok No. 123', '021-555-1234', 'saless@suksesjaya.com', 'Bapak Anton', 'SUP001', 1, '2025-11-05 13:46:44', '2025-11-05 13:55:59'),
(3, 'S-002', 'CV. Mitra Pangan Sejahtera', 'Jl. Raya Bogor Km. 20, Jakarta Timur', '021-8775678', 'order@mitrapangan.id', 'Ibu Rina', 'JSUP-001', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(4, 'S-003', 'PT. Kerta Jaya ATK', 'Jl. Mangga Dua No. 45, Jakarta Pusat', '021-6129876', 'sales@kertajaya.com', 'Bapak Budi', 'JSUP-002', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(5, 'S-004', 'PT. Farma Medika', 'Kawasan Industri Pulogadung Blok III, JIEP', '021-4601234', 'info@farmamedika.com', 'Bapak Doni', 'JSUP-003', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(6, 'S-005', 'UD. Sumber Rejeki Snack', 'Jl. Cikupa Raya No. 18, Tangerang', '021-5940088', 'ud.sumberrejeki@gmail.com', 'Ibu Wati', 'JSUP-004', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(7, 'S-006', 'CV. Segar Alam', 'Jl. Raya Lembang No. 90, Bandung', '022-2789901', 'order@segaralam.com', 'Bapak Heru', 'JSUP-005', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(8, 'S-007', 'PT. Bahari Daging Nusantara', 'Jl. Muara Baru Blok A No. 5, Jakarta Utara', '021-6690011', 'sales@baharidaging.com', 'Bapak Fajar', 'JSUP-006', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(9, 'S-008', 'PT. Solusi Komputindo', 'Harco Mangga Dua Lt. 3 Blok B', '021-6230112', 'solusikom@yahoo.com', 'Bapak Johan', 'JSUP-007', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(10, 'S-009', 'PT. Garmentindo Tekstil', 'Jl. Pahlawan No. 8, Bandung', '022-7203344', 'cs@garmentindo.com', 'Ibu Sinta', 'JSUP-008', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(11, 'S-010', 'CV. Auto Parts Prima', 'Jl. Kedungdoro No. 101, Surabaya', '031-5341111', 'autoparts.prima@gmail.com', 'Bapak Hengky', 'JSUP-009', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(12, 'S-011', 'PT. Mebelindo Jaya', 'Jl. Solo-Sragen Km. 14, Karanganyar', '0271-825500', 'marketing@mebelindo.com', 'Bapak Rian', 'JSUP-011', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(13, 'S-012', 'UD. Sumber Kimia', 'Kawasan Industri Cikarang Blok F5', '021-8991122', 'info@sumberkimia.co.id', 'Bapak Chandra', 'JSUP-012', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(14, 'S-013', 'PT. Horeca Sukses Mandiri', 'Jl. Sunset Road No. 88, Kuta, Bali', '0361-755888', 'sales.bali@horecasukses.com', 'Ibu Ayu', 'JSUP-013', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(15, 'S-014', 'CV. Mainan Edukasi', 'Jl. Fatmawati No. 30, Jakarta Selatan', '021-7501234', 'info@mainanedukasi.id', 'Ibu Vina', 'JSUP-014', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(16, 'S-015', 'PT. Cantika Kosmetik', 'Jl. TB Simatupang, Gedung CIBIS 9', '021-7880011', 'partner@cantika.com', 'Ibu Dewi', 'JSUP-015', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(17, 'S-016', 'Percetakan Digital Prima', 'Jl. Percetakan Negara No. 10', '021-4205566', 'cetak@digitalprima.com', 'Bapak Eko', 'JSUP-016', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(18, 'S-017', 'PT. Importir Umum Asia', 'Jl. Pelabuhan Tanjung Priok No. 1', '021-4301188', 'admin@importirasia.com', 'Mr. Lee', 'JSUP-017', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(19, 'S-018', 'UMKM Keripik Singkong Jaya', 'Jl. Desa Cikoneng RT 02/01', '081234567890', 'keripikjaya@gmail.com', 'Ibu Siti', 'JSUP-018', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(20, 'S-019', 'PT. Sport Vision Indonesia', 'Jl. Asia Afrika, Senayan', '021-5709988', 'info@sportvision.id', 'Bapak Adi', 'JSUP-019', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(21, 'S-020', 'CV. Perlengkapan Bayi Ceria', 'ITC Kuningan Lt. 4 Blok C', '021-5793001', 'sales@bayiceria.com', 'Ibu Linda', 'JSUP-020', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(22, 'S-021', 'PT. Logistik Express Nusantara', 'Jl. Bandara Soetta, Cengkareng', '021-5501122', 'cs@logistikexpress.com', 'Bapak Toni', 'JSUP-021', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(23, 'S-022', 'PT. Sinar Listrik Abadi', 'Glodok Jaya Lt. 2', '021-6258899', 'sinarlistrik@gmail.com', 'Koh Acung', 'JSUP-022', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(24, 'S-023', 'CV. Kemasindo Pratama', 'Jl. Raya Narogong Km. 10, Bekasi', '021-8260011', 'order@kemasindo.com', 'Bapak Sandi', 'JSUP-023', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(25, 'S-024', 'PT. Manufaktur Baja Perkasa', 'Kawasan Industri MM2100', '021-8980033', 'purchasing@bajaperkasa.com', 'Bapak Irwan', 'JSUP-024', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03'),
(26, 'S-025', 'Toko Bangunan Harapan Kita', 'Jl. Pangeran Jayakarta No. 77', '021-6889900', 'tb.harapankita@yahoo.com', 'Engkoh Budi', 'JSPU01', 1, '2025-11-09 08:02:03', '2025-11-09 08:02:03');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `google_id` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('SUPER_ADMIN','MANAGER_PRODUKSI','PENGAWAS_KUALITAS','GUDANG','KEUANGAN','PENJUALAN','PEMBELIAN','ADMIN','USER') NOT NULL DEFAULT 'USER',
  `status` varchar(50) NOT NULL DEFAULT 'Aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `google_id`, `password`, `role`, `status`, `created_at`, `updated_at`) VALUES
(8, 'Admin', 'admin@gmail.com', NULL, '$2b$10$l1024OCc9AX53sA.xB7Zk.2XUOhW2rngFO9ajSY.MNiG5xZerGt1i', 'ADMIN', 'Aktif', '2025-10-13 10:13:27', '2025-10-13 10:13:27'),
(18, 'KHANZA NEELAM', 'neelam@gmail.com', NULL, '$2b$10$R7Ie9GiyL/OLjCVGskD9W.osBD7UyZlAaI93Lianckemy4qJzGmxq', 'USER', 'Aktif', '2025-12-05 22:55:14', '2025-12-05 22:55:14');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `blacklist_tokens`
--
ALTER TABLE `blacklist_tokens`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  ADD PRIMARY KEY (`index`);

--
-- Indexes for table `login_history`
--
ALTER TABLE `login_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `login_history_user_id_foreign` (`user_id`);

--
-- Indexes for table `master_alamat`
--
ALTER TABLE `master_alamat`
  ADD PRIMARY KEY (`ALAMAT_ID`),
  ADD KEY `master_alamat_email_foreign` (`EMAIL`);

--
-- Indexes for table `master_bahan_baku`
--
ALTER TABLE `master_bahan_baku`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `master_bahan_baku_kode_unique` (`kode`),
  ADD UNIQUE KEY `master_bahan_baku_kode_barcode_unique` (`kode_barcode`),
  ADD KEY `master_bahan_baku_kode_kategori_foreign` (`kode_kategori`),
  ADD KEY `master_bahan_baku_kode_rak_foreign` (`kode_rak`),
  ADD KEY `master_bahan_baku_kode_gudang_foreign` (`kode_gudang`),
  ADD KEY `master_bahan_baku_kode_satuan_foreign` (`kode_satuan`);

--
-- Indexes for table `master_bank`
--
ALTER TABLE `master_bank`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `master_bank_kode_unique` (`kode`);

--
-- Indexes for table `master_barcode`
--
ALTER TABLE `master_barcode`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `master_barcode_kode_barcode_unique` (`kode_barcode`);

--
-- Indexes for table `master_coa`
--
ALTER TABLE `master_coa`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `master_coa_kode_rekening_unique` (`kode_rekening`),
  ADD KEY `master_coa_parent_id_foreign` (`parent_id`);

--
-- Indexes for table `master_gudang`
--
ALTER TABLE `master_gudang`
  ADD PRIMARY KEY (`id_gudang`),
  ADD UNIQUE KEY `master_gudang_kode_unique` (`kode`);

--
-- Indexes for table `master_hari`
--
ALTER TABLE `master_hari`
  ADD PRIMARY KEY (`HARI_ID`),
  ADD UNIQUE KEY `master_hari_nama_hari_unique` (`NAMA_HARI`);

--
-- Indexes for table `master_jenis_supplier`
--
ALTER TABLE `master_jenis_supplier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `master_jenis_supplier_kode_unique` (`kode`);

--
-- Indexes for table `master_kategori_barang`
--
ALTER TABLE `master_kategori_barang`
  ADD PRIMARY KEY (`id_kategori`),
  ADD KEY `master_kategori_barang_kode_barang_foreign` (`kode_barang`);

--
-- Indexes for table `master_klien`
--
ALTER TABLE `master_klien`
  ADD PRIMARY KEY (`KLIEN_ID`),
  ADD UNIQUE KEY `master_klien_email_unique` (`EMAIL`);

--
-- Indexes for table `master_kodebarang`
--
ALTER TABLE `master_kodebarang`
  ADD PRIMARY KEY (`id_kode_barang`),
  ADD UNIQUE KEY `master_kodebarang_kode_barang_unique` (`kode_barang`);

--
-- Indexes for table `master_produk`
--
ALTER TABLE `master_produk`
  ADD PRIMARY KEY (`id_produk`),
  ADD UNIQUE KEY `master_produk_kode_produk_unique` (`kode_produk`),
  ADD KEY `master_produk_kode_kategori_foreign` (`kode_kategori`),
  ADD KEY `master_produk_kode_gudang_foreign` (`kode_gudang`),
  ADD KEY `master_produk_kode_rak_foreign` (`kode_rak`),
  ADD KEY `master_produk_kode_supplier_foreign` (`kode_supplier`),
  ADD KEY `master_produk_kode_satuan_1_foreign` (`kode_satuan_1`),
  ADD KEY `master_produk_kode_satuan_2_foreign` (`kode_satuan_2`),
  ADD KEY `master_produk_kode_satuan_3_foreign` (`kode_satuan_3`),
  ADD KEY `master_produk_kode_barcode_foreign` (`kode_barcode`);

--
-- Indexes for table `master_rak`
--
ALTER TABLE `master_rak`
  ADD PRIMARY KEY (`id_rak`),
  ADD UNIQUE KEY `master_rak_kode_unique` (`kode`);

--
-- Indexes for table `master_satuan_barang`
--
ALTER TABLE `master_satuan_barang`
  ADD PRIMARY KEY (`id_satuan`),
  ADD UNIQUE KEY `master_satuan_barang_kode_unique` (`kode`),
  ADD UNIQUE KEY `master_satuan_barang_satuan_barang_unique` (`satuan_barang`);

--
-- Indexes for table `master_stok_supplier`
--
ALTER TABLE `master_stok_supplier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `master_stok_supplier_kode_supplier_kode_barcode_unique` (`kode_supplier`,`kode_barcode`),
  ADD KEY `master_stok_supplier_kode_supplier_index` (`kode_supplier`),
  ADD KEY `master_stok_supplier_kode_barcode_index` (`kode_barcode`);

--
-- Indexes for table `master_supplier`
--
ALTER TABLE `master_supplier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `master_supplier_kode_supplier_unique` (`kode_supplier`),
  ADD KEY `master_supplier_kode_jenis_index` (`kode_jenis`);

--
-- Indexes for table `transaksi_billing`
--
ALTER TABLE `transaksi_billing`
  ADD PRIMARY KEY (`BILLING_ID`),
  ADD UNIQUE KEY `transaksi_billing_nomor_invoice_unique` (`NOMOR_INVOICE`),
  ADD UNIQUE KEY `transaksi_billing_ref_transaksi_unique` (`REF_TRANSAKSI`),
  ADD KEY `transaksi_billing_projek_id_foreign` (`PROJEK_ID`);

--
-- Indexes for table `transaksi_blog`
--
ALTER TABLE `transaksi_blog`
  ADD PRIMARY KEY (`BLOG_ID`),
  ADD UNIQUE KEY `transaksi_blog_slug_unique` (`SLUG`),
  ADD KEY `transaksi_blog_slug_index` (`SLUG`),
  ADD KEY `transaksi_blog_category_index` (`CATEGORY`),
  ADD KEY `transaksi_blog_status_index` (`STATUS`);

--
-- Indexes for table `transaksi_projek`
--
ALTER TABLE `transaksi_projek`
  ADD PRIMARY KEY (`PROJEK_ID`),
  ADD KEY `transaksi_projek_klien_id_foreign` (`KLIEN_ID`);

--
-- Indexes for table `transaksi_supplier`
--
ALTER TABLE `transaksi_supplier`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `transaksi_supplier_kode_supplier_unique` (`kode_supplier`),
  ADD KEY `transaksi_supplier_kode_jenis_index` (`kode_jenis`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blacklist_tokens`
--
ALTER TABLE `blacklist_tokens`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `knex_migrations`
--
ALTER TABLE `knex_migrations`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=46;

--
-- AUTO_INCREMENT for table `knex_migrations_lock`
--
ALTER TABLE `knex_migrations_lock`
  MODIFY `index` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `login_history`
--
ALTER TABLE `login_history`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=237;

--
-- AUTO_INCREMENT for table `master_alamat`
--
ALTER TABLE `master_alamat`
  MODIFY `ALAMAT_ID` bigint UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `master_bahan_baku`
--
ALTER TABLE `master_bahan_baku`
  MODIFY `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `master_bank`
--
ALTER TABLE `master_bank`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `master_barcode`
--
ALTER TABLE `master_barcode`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=53;

--
-- AUTO_INCREMENT for table `master_coa`
--
ALTER TABLE `master_coa`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `master_gudang`
--
ALTER TABLE `master_gudang`
  MODIFY `id_gudang` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `master_hari`
--
ALTER TABLE `master_hari`
  MODIFY `HARI_ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `master_jenis_supplier`
--
ALTER TABLE `master_jenis_supplier`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

--
-- AUTO_INCREMENT for table `master_kategori_barang`
--
ALTER TABLE `master_kategori_barang`
  MODIFY `id_kategori` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `master_klien`
--
ALTER TABLE `master_klien`
  MODIFY `KLIEN_ID` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `master_kodebarang`
--
ALTER TABLE `master_kodebarang`
  MODIFY `id_kode_barang` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=102;

--
-- AUTO_INCREMENT for table `master_produk`
--
ALTER TABLE `master_produk`
  MODIFY `id_produk` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=223;

--
-- AUTO_INCREMENT for table `master_rak`
--
ALTER TABLE `master_rak`
  MODIFY `id_rak` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `master_satuan_barang`
--
ALTER TABLE `master_satuan_barang`
  MODIFY `id_satuan` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `master_stok_supplier`
--
ALTER TABLE `master_stok_supplier`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `master_supplier`
--
ALTER TABLE `master_supplier`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `transaksi_billing`
--
ALTER TABLE `transaksi_billing`
  MODIFY `BILLING_ID` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `transaksi_blog`
--
ALTER TABLE `transaksi_blog`
  MODIFY `BLOG_ID` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `transaksi_projek`
--
ALTER TABLE `transaksi_projek`
  MODIFY `PROJEK_ID` bigint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `transaksi_supplier`
--
ALTER TABLE `transaksi_supplier`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `login_history`
--
ALTER TABLE `login_history`
  ADD CONSTRAINT `login_history_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `master_alamat`
--
ALTER TABLE `master_alamat`
  ADD CONSTRAINT `master_alamat_email_foreign` FOREIGN KEY (`EMAIL`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_bahan_baku`
--
ALTER TABLE `master_bahan_baku`
  ADD CONSTRAINT `master_bahan_baku_kode_barcode_foreign` FOREIGN KEY (`kode_barcode`) REFERENCES `master_barcode` (`kode_barcode`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `master_bahan_baku_kode_gudang_foreign` FOREIGN KEY (`kode_gudang`) REFERENCES `master_gudang` (`kode`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `master_bahan_baku_kode_kategori_foreign` FOREIGN KEY (`kode_kategori`) REFERENCES `master_kategori_barang` (`kode_barang`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `master_bahan_baku_kode_rak_foreign` FOREIGN KEY (`kode_rak`) REFERENCES `master_rak` (`kode`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `master_bahan_baku_kode_satuan_foreign` FOREIGN KEY (`kode_satuan`) REFERENCES `master_satuan_barang` (`kode`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `master_coa`
--
ALTER TABLE `master_coa`
  ADD CONSTRAINT `master_coa_parent_id_foreign` FOREIGN KEY (`parent_id`) REFERENCES `master_coa` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `master_kategori_barang`
--
ALTER TABLE `master_kategori_barang`
  ADD CONSTRAINT `master_kategori_barang_kode_barang_foreign` FOREIGN KEY (`kode_barang`) REFERENCES `master_kodebarang` (`kode_barang`) ON DELETE CASCADE;

--
-- Constraints for table `master_klien`
--
ALTER TABLE `master_klien`
  ADD CONSTRAINT `master_klien_email_foreign` FOREIGN KEY (`EMAIL`) REFERENCES `users` (`email`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_produk`
--
ALTER TABLE `master_produk`
  ADD CONSTRAINT `master_produk_kode_barcode_foreign` FOREIGN KEY (`kode_barcode`) REFERENCES `master_barcode` (`kode_barcode`),
  ADD CONSTRAINT `master_produk_kode_gudang_foreign` FOREIGN KEY (`kode_gudang`) REFERENCES `master_gudang` (`kode`),
  ADD CONSTRAINT `master_produk_kode_kategori_foreign` FOREIGN KEY (`kode_kategori`) REFERENCES `master_kategori_barang` (`kode_barang`),
  ADD CONSTRAINT `master_produk_kode_rak_foreign` FOREIGN KEY (`kode_rak`) REFERENCES `master_rak` (`kode`),
  ADD CONSTRAINT `master_produk_kode_satuan_1_foreign` FOREIGN KEY (`kode_satuan_1`) REFERENCES `master_satuan_barang` (`kode`),
  ADD CONSTRAINT `master_produk_kode_satuan_2_foreign` FOREIGN KEY (`kode_satuan_2`) REFERENCES `master_satuan_barang` (`kode`),
  ADD CONSTRAINT `master_produk_kode_satuan_3_foreign` FOREIGN KEY (`kode_satuan_3`) REFERENCES `master_satuan_barang` (`kode`),
  ADD CONSTRAINT `master_produk_kode_supplier_foreign` FOREIGN KEY (`kode_supplier`) REFERENCES `transaksi_supplier` (`kode_supplier`);

--
-- Constraints for table `master_stok_supplier`
--
ALTER TABLE `master_stok_supplier`
  ADD CONSTRAINT `master_stok_supplier_kode_barcode_foreign` FOREIGN KEY (`kode_barcode`) REFERENCES `master_barcode` (`kode_barcode`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `master_stok_supplier_kode_supplier_foreign` FOREIGN KEY (`kode_supplier`) REFERENCES `transaksi_supplier` (`kode_supplier`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `master_supplier`
--
ALTER TABLE `master_supplier`
  ADD CONSTRAINT `master_supplier_kode_jenis_foreign` FOREIGN KEY (`kode_jenis`) REFERENCES `master_jenis_supplier` (`kode`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- Constraints for table `transaksi_billing`
--
ALTER TABLE `transaksi_billing`
  ADD CONSTRAINT `transaksi_billing_projek_id_foreign` FOREIGN KEY (`PROJEK_ID`) REFERENCES `transaksi_projek` (`PROJEK_ID`) ON DELETE CASCADE;

--
-- Constraints for table `transaksi_projek`
--
ALTER TABLE `transaksi_projek`
  ADD CONSTRAINT `transaksi_projek_klien_id_foreign` FOREIGN KEY (`KLIEN_ID`) REFERENCES `master_klien` (`KLIEN_ID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `transaksi_supplier`
--
ALTER TABLE `transaksi_supplier`
  ADD CONSTRAINT `transaksi_supplier_kode_jenis_foreign` FOREIGN KEY (`kode_jenis`) REFERENCES `master_jenis_supplier` (`kode`) ON DELETE RESTRICT ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
