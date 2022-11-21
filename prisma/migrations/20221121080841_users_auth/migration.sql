-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(64) NOT NULL,
    `email` VARCHAR(320) NOT NULL,
    `password` VARCHAR(60) NULL,
    `secret2fa` VARCHAR(20) NULL,
    `avatar` TEXT NULL,
    `banner` TEXT NULL,
    `birthday` DATE NULL,
    `gender` ENUM('UNSPECIFIED', 'MALE', 'FEMALE', 'CUSTOM') NOT NULL DEFAULT 'UNSPECIFIED',
    `customGender` VARCHAR(64) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SiteAuthSession` (
    `id` VARCHAR(191) NOT NULL,
    `agent` TEXT NOT NULL,
    `ip` VARCHAR(64) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SiteAuthSession` ADD CONSTRAINT `SiteAuthSession_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
