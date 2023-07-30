/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "User_Workspace" DROP CONSTRAINT "User_Workspace_user_id_fkey";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Auth_User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_User_id_key" ON "Auth_User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_User_email_key" ON "Auth_User"("email");

-- AddForeignKey
ALTER TABLE "User_Workspace" ADD CONSTRAINT "User_Workspace_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "Auth_User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
