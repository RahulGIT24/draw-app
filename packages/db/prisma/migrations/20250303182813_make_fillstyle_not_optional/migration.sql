-- AlterTable
ALTER TABLE "Shape" ALTER COLUMN "fillStyle" DROP NOT NULL,
ALTER COLUMN "endX" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "endY" SET DATA TYPE DOUBLE PRECISION;
