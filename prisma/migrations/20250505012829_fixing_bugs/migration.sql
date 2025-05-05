/*
  Warnings:

  - You are about to drop the column `priority` on the `Tasks` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Tasks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Tasks" DROP COLUMN "priority",
DROP COLUMN "status";
