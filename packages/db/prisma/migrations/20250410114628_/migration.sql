/*
  Warnings:

  - You are about to drop the column `userToken` on the `Room` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Room_collaborationToken_userToken_idx";

-- AlterTable
ALTER TABLE "Room" DROP COLUMN "userToken";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userToken" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Room_collaborationToken_idx" ON "Room"("collaborationToken");

-- CreateIndex
CREATE INDEX "User_userToken_idx" ON "User"("userToken");
