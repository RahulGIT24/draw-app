-- DropIndex
DROP INDEX "User_userToken_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "forgotPasswordToken" TEXT DEFAULT '',
ADD COLUMN     "forgotPasswordTokenExpiry" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "User_email_username_idx" ON "User"("email", "username");
