-- AlterTable
ALTER TABLE `Songs` ADD COLUMN `status` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `SongGeneration` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `songTitle` VARCHAR(191) NOT NULL,
    `generationProgress` VARCHAR(191) NOT NULL,
    `taskID` VARCHAR(191) NOT NULL,
    `userPaymentStarted` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `SongGeneration` ADD CONSTRAINT `SongGeneration_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
