CREATE TABLE `bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`consultant_id` int NOT NULL,
	`client_name` varchar(255) NOT NULL,
	`client_email` varchar(255) NOT NULL,
	`client_phone` varchar(20) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`booking_date` varchar(50) NOT NULL,
	`booking_time` varchar(20) NOT NULL,
	`status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
	`notes` text,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `bookings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `consultants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`name_en` varchar(255) NOT NULL,
	`specialty` varchar(255) NOT NULL,
	`specialty_en` varchar(255) NOT NULL,
	`bio` text NOT NULL,
	`bio_en` text NOT NULL,
	`image` varchar(500) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`zoho_duration` int DEFAULT 60,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `consultants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `contact_messages` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`subject` varchar(500) NOT NULL,
	`message` text NOT NULL,
	`status` enum('new','read','replied') DEFAULT 'new',
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `contact_messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `offers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`store_id` int NOT NULL,
	`product_id` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`discount_type` enum('percentage','fixed') DEFAULT 'percentage',
	`discount_value` decimal(10,2) NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp NOT NULL,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `offers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `order_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`order_id` int NOT NULL,
	`product_id` int NOT NULL,
	`quantity` int NOT NULL,
	`unit_price` decimal(10,2) NOT NULL,
	`total_price` decimal(10,2) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `order_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` int AUTO_INCREMENT NOT NULL,
	`user_id` int NOT NULL,
	`store_id` int NOT NULL,
	`total_price` decimal(10,2) NOT NULL,
	`points_earned` int DEFAULT 0,
	`status` enum('pending','processing','completed','cancelled') DEFAULT 'pending',
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `orders_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` int AUTO_INCREMENT NOT NULL,
	`store_id` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`price` decimal(10,2) NOT NULL,
	`image` varchar(500) NOT NULL,
	`category` varchar(100) NOT NULL,
	`stock` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `products_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `stores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`name_en` varchar(255) NOT NULL,
	`description` text NOT NULL,
	`description_en` text NOT NULL,
	`category` varchar(100) NOT NULL,
	`category_en` varchar(100) NOT NULL,
	`image` varchar(500) NOT NULL,
	`owner_name` varchar(255) NOT NULL,
	`owner_email` varchar(255) NOT NULL,
	`owner_phone` varchar(20) NOT NULL,
	`rating` decimal(3,1) DEFAULT '0',
	`review_count` int DEFAULT 0,
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `stores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`points` int DEFAULT 0,
	`balance` decimal(10,2) DEFAULT '0',
	`role` enum('user','admin') DEFAULT 'user',
	`is_active` boolean DEFAULT true,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `users_id` PRIMARY KEY(`id`),
	CONSTRAINT `users_email_unique` UNIQUE(`email`)
);
