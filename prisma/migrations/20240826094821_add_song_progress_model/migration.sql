-- CreateTable
CREATE TABLE `SongProgress` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `songIdea` VARCHAR(191) NOT NULL,
    `style` VARCHAR(191) NULL,
    `tone` VARCHAR(191) NULL,
    `vocalStyle` VARCHAR(191) NULL,
    `influences` VARCHAR(191) NULL,
    `lyrics` VARCHAR(191) NULL,
    `step` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SongProgress` ADD CONSTRAINT `SongProgress_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
