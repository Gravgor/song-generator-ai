/*
  Warnings:

  - You are about to drop the column `paymentId` on the `UserPayment` table. All the data in the column will be lost.
  - Added the required column `amount` to the `UserPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `currency` to the `UserPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customerDetails` to the `UserPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceId` to the `UserPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `SongProgress` ADD COLUMN `userPaymentStarted` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `UserPayment` DROP COLUMN `paymentId`,
    ADD COLUMN `amount` INTEGER NOT NULL,
    ADD COLUMN `currency` VARCHAR(191) NOT NULL,
    ADD COLUMN `customerDetails` VARCHAR(191) NOT NULL,
    ADD COLUMN `priceId` VARCHAR(191) NOT NULL;
