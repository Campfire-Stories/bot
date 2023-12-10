CREATE TABLE `books` (
	`book_id` int NOT NULL,
	`page_id` int NOT NULL DEFAULT 0,
	`color` int NOT NULL DEFAULT 16777215,
	`name` varchar(256) NOT NULL DEFAULT 'A book name has not been set',
	`description` varchar(4096) NOT NULL DEFAULT 'A description has not been set',
	CONSTRAINT `books_book_id` PRIMARY KEY(`book_id`)
);
--> statement-breakpoint
CREATE TABLE `pages` (
	`book_id` int NOT NULL,
	`page_id` int NOT NULL,
	`embeds` json NOT NULL DEFAULT ('[]'),
	`vars_actions` json NOT NULL DEFAULT ('[]'),
	`choices` json NOT NULL DEFAULT ('[]'),
	CONSTRAINT `users_pk` PRIMARY KEY(`book_id`,`page_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`user_id` bigint unsigned NOT NULL,
	`book_id` int NOT NULL,
	`page_id` int NOT NULL,
	CONSTRAINT `users_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `user_vars` (
	`user_id` bigint unsigned NOT NULL,
	`name` varchar(128) NOT NULL,
	`value` int NOT NULL DEFAULT 0,
	CONSTRAINT `user_vars_user_id` PRIMARY KEY(`user_id`)
);
--> statement-breakpoint
ALTER TABLE `pages` ADD CONSTRAINT `pages_book_id_books_book_id_fk` FOREIGN KEY (`book_id`) REFERENCES `books`(`book_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_book_id_page_id_pages_book_id_page_id_fk` FOREIGN KEY (`book_id`,`page_id`) REFERENCES `pages`(`book_id`,`page_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_vars` ADD CONSTRAINT `user_vars_user_id_users_user_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE no action ON UPDATE no action;