/*
  Warnings:

  - Made the column `songTitle` on table `SongProgress` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `SongProgress` MODIFY `songTitle` VARCHAR(191) NOT NULL;
