-- AlterTable
ALTER TABLE `user` MODIFY `status` ENUM('Pending', 'Verifying', 'NotVerifying', 'Accepted', 'Rejected') NOT NULL DEFAULT 'Pending';
