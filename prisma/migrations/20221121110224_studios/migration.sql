-- CreateTable
CREATE TABLE `Studio` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(64) NOT NULL,
    `genre` VARCHAR(64) NOT NULL,
    `existencePeriod` VARCHAR(64) NOT NULL,
    `rating` VARCHAR(64) NOT NULL,
    `grade` VARCHAR(64) NOT NULL,
    `timekeeping` VARCHAR(64) NOT NULL,
    `thumbnail` TEXT NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
