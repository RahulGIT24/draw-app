/*
  Warnings:

  - You are about to drop the column `endAngle` on the `Shape` table. All the data in the column will be lost.
  - You are about to drop the column `startAngle` on the `Shape` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Shape" DROP COLUMN "endAngle",
DROP COLUMN "startAngle";
