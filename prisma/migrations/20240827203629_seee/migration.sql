-- CreateTable
CREATE TABLE `Clips` (
    `id` VARCHAR(191) NOT NULL,
    `clipId` VARCHAR(191) NOT NULL,
    `clipVideoUrl` VARCHAR(191) NOT NULL,
    `clipAudioUrl` VARCHAR(191) NOT NULL,
    `clipCoverUrl` VARCHAR(191) NOT NULL,
    `clipTitle` VARCHAR(191) NOT NULL,
    `clipTags` VARCHAR(191) NOT NULL,
    `userId` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Clips` ADD CONSTRAINT `Clips_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
