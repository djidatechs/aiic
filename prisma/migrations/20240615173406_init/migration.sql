/*
  Warnings:

  - A unique constraint covering the columns `[WorkingHoursId]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Appointment_WorkingHoursId_key` ON `Appointment`(`WorkingHoursId`);
