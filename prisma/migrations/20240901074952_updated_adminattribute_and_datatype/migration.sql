/*
  Warnings:

  - A unique constraint covering the columns `[nip]` on the table `Admin` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nip` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telp_admin` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admin` ADD COLUMN `nip` VARCHAR(191) NOT NULL,
    ADD COLUMN `telp_admin` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Admin_nip_key` ON `Admin`(`nip`);
