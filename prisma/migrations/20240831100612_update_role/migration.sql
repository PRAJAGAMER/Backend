/*
  Warnings:

  - You are about to alter the column `status` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('Pending', 'Verifying', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending';
