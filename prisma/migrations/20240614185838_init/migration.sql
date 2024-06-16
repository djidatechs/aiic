/*
  Warnings:

  - You are about to drop the column `time` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `appointment` table. All the data in the column will be lost.
  - You are about to drop the column `cv` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `diploma` on the `client` table. All the data in the column will be lost.
  - The values [CCP,BaridiMob] on the enum `Payment_paymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `WorkingHoursId` to the `Appointment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `payed` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recite` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `name` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `appointment` DROP COLUMN `time`,
    DROP COLUMN `type`,
    ADD COLUMN `WorkingHoursId` INTEGER NOT NULL,
    MODIFY `date` DATE NOT NULL;

-- AlterTable
ALTER TABLE `client` DROP COLUMN `cv`,
    DROP COLUMN `diploma`;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `payed` DOUBLE NOT NULL,
    ADD COLUMN `recite` BLOB NOT NULL,
    MODIFY `paymentMethod` ENUM('CCPBaridiMob', 'OnSite') NOT NULL;

-- CreateTable
CREATE TABLE `WorkingHours` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATE NOT NULL,
    `startTime` TIME NOT NULL,
    `type` ENUM('InPerson', 'Online') NOT NULL,
    `duration` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Appointment` ADD CONSTRAINT `Appointment_WorkingHoursId_fkey` FOREIGN KEY (`WorkingHoursId`) REFERENCES `WorkingHours`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
