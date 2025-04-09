/*
  Warnings:

  - The primary key for the `Shape` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Shape" DROP CONSTRAINT "Shape_pkey",
ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Shape_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Shape_id_seq";
