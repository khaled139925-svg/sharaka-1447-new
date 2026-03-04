CREATE TABLE `consultant_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`specialization` varchar(255) NOT NULL,
	`specialization_en` varchar(255),
	`years_of_experience` int NOT NULL,
	`bio` text NOT NULL,
	`bio_en` text,
	`hourly_rate` decimal(10,2) NOT NULL,
	`profile_image` varchar(500),
	`certifications` text,
	`languages` varchar(255),
	`rating` decimal(3,1) DEFAULT '0',
	`total_sessions` int DEFAULT 0,
	`is_available` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultant_profiles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `notifications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`message` text NOT NULL,
	`type` varchar(50) NOT NULL,
	`is_read` boolean DEFAULT false,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `notifications_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`client_id` int NOT NULL,
	`consultant_id` int NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` varchar(10) DEFAULT 'SAR',
	`status` enum('pending','completed','failed','refunded') DEFAULT 'pending',
	`stripe_payment_id` varchar(255),
	`invoice_number` varchar(50),
	`payment_method` varchar(50),
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`session_id` int NOT NULL,
	`consultant_id` int NOT NULL,
	`client_id` int NOT NULL,
	`rating` int NOT NULL,
	`comment` text,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultant_id` int NOT NULL,
	`client_id` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`scheduled_date` datetime NOT NULL,
	`duration` int NOT NULL,
	`status` enum('pending','confirmed','in_progress','completed','cancelled') DEFAULT 'pending',
	`meeting_type` enum('zoom','google_meet','teams','phone') DEFAULT 'zoom',
	`meeting_link` varchar(500),
	`recording_url` varchar(500),
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `password` varchar(500);--> statement-breakpoint
ALTER TABLE `users` ADD `user_type` enum('client','consultant','admin') DEFAULT 'client';--> statement-breakpoint
ALTER TABLE `users` ADD `is_verified` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `users` ADD `verification_token` varchar(500);