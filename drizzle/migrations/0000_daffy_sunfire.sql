CREATE TABLE `pages` (
	`story_id` int NOT NULL,
	`page_id` int NOT NULL,
	`embeds` json DEFAULT ('[]'),
	`vars_actions` json DEFAULT ('[]'),
	`choices` json DEFAULT ('[]'),
	CONSTRAINT `users_pk` PRIMARY KEY(`story_id`,`page_id`)
);
--> statement-breakpoint
CREATE TABLE `stories` (
	`story_id` int NOT NULL,
	`color` int NOT NULL DEFAULT 16777215,
	`name` varchar(4096) NOT NULL DEFAULT 'A description has not been set',
	`first_page` int NOT NULL DEFAULT 0,
	CONSTRAINT `stories_story_id` PRIMARY KEY(`story_id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`guild_id` bigint unsigned NOT NULL,
	`story_id` int,
	`page_id` int,
	CONSTRAINT `users_guild_id` PRIMARY KEY(`guild_id`)
);
--> statement-breakpoint
CREATE TABLE `user_vars` (
	`guild_id` bigint unsigned NOT NULL,
	`key` varchar(128) NOT NULL,
	`value` int NOT NULL DEFAULT 0,
	CONSTRAINT `user_vars_guild_id` PRIMARY KEY(`guild_id`)
);
--> statement-breakpoint
ALTER TABLE `pages` ADD CONSTRAINT `pages_story_id_stories_story_id_fk` FOREIGN KEY (`story_id`) REFERENCES `stories`(`story_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_story_id_page_id_pages_story_id_page_id_fk` FOREIGN KEY (`story_id`,`page_id`) REFERENCES `pages`(`story_id`,`page_id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_vars` ADD CONSTRAINT `user_vars_guild_id_users_guild_id_fk` FOREIGN KEY (`guild_id`) REFERENCES `users`(`guild_id`) ON DELETE no action ON UPDATE no action;