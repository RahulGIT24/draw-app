-- DropIndex
DROP INDEX "Room_collaborationToken_idx";

-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "userToken" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "Room_collaborationToken_userToken_idx" ON "Room"("collaborationToken", "userToken");
