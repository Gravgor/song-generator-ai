/*
  Warnings:

  - You are about to drop the column `customerDetails` on the `UserPayment` table. All the data in the column will be lost.
  - You are about to drop the column `priceId` on the `UserPayment` table. All the data in the column will be lost.
  - Added the required column `paymentIntent` to the `UserPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userCountry` to the `UserPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userEmail` to the `UserPayment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userName` to the `UserPayment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `UserPayment` DROP COLUMN `customerDetails`,
    DROP COLUMN `priceId`,
    ADD COLUMN `paymentIntent` LONGTEXT NOT NULL,
    ADD COLUMN `userCountry` VARCHAR(191) NOT NULL,
    ADD COLUMN `userEmail` VARCHAR(191) NOT NULL,
    ADD COLUMN `userName` VARCHAR(191) NOT NULL;
