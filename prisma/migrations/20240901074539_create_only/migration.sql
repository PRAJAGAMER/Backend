/*
  Warnings:

  - A unique constraint covering the columns `[nik]` on the table `Profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[nim]` on the table `University` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Profile_nik_key` ON `Profile`(`nik`);

-- CreateIndex
CREATE UNIQUE INDEX `University_nim_key` ON `University`(`nim`);
