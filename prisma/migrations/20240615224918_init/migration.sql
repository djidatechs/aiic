/*
  Warnings:

  - A unique constraint covering the columns `[link]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - The required column `link` was added to the `Appointment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE `appointment` ADD COLUMN `link` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Appointment_link_key` ON `Appointment`(`link`);
