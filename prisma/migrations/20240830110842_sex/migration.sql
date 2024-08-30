/*
  Warnings:

  - You are about to drop the column `userPaymentStarted` on the `SongGeneration` table. All the data in the column will be lost.
  - You are about to drop the `Clips` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[taskID]` on the table `SongGeneration` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `Clips` DROP FOREIGN KEY `Clips_userId_fkey`;

-- AlterTable
ALTER TABLE `SongGeneration` DROP COLUMN `userPaymentStarted`;

-- DropTable
DROP TABLE `Clips`;

-- CreateTable
CREATE TABLE `Clip` (
    `id` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NOT NULL,
    `clipId` VARCHAR(191) NOT NULL,
    `clipVideoUrl` VARCHAR(191) NOT NULL,
    `clipAudioUrl` VARCHAR(191) NOT NULL,
    `clipCoverUrl` VARCHAR(191) NOT NULL,
    `clipTitle` VARCHAR(191) NOT NULL,
    `clipTags` VARCHAR(191) NOT NULL,
    `isChosen` BOOLEAN NOT NULL DEFAULT false,
    `isRejected` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `songGenerationId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Clip_userId_clipId_key`(`userId`, `clipId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `SongGeneration_taskID_key` ON `SongGeneration`(`taskID`);

-- AddForeignKey
ALTER TABLE `Clip` ADD CONSTRAINT `Clip_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Clip` ADD CONSTRAINT `Clip_songGenerationId_fkey` FOREIGN KEY (`songGenerationId`) REFERENCES `SongGeneration`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
