-- CreateTable
CREATE TABLE `Movie` (
    `id` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `deleted` BOOLEAN NOT NULL DEFAULT false,
    `name` VARCHAR(64) NOT NULL,
    `studioId` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Movie` ADD CONSTRAINT `Movie_studioId_fkey` FOREIGN KEY (`studioId`) REFERENCES `Studio`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
