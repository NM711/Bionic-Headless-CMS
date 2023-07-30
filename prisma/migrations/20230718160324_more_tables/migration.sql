/*
  Warnings:

  - You are about to drop the column `email` on the `auth_user` table. All the data in the column will be lost.
  - You are about to drop the column `byte_data` on the `image` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[username]` on the table `auth_user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creator_id` to the `content` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "auth_user_email_key";

-- AlterTable
ALTER TABLE "auth_user" DROP COLUMN "email";

-- AlterTable
ALTER TABLE "content" ADD COLUMN     "creator_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "image" DROP COLUMN "byte_data";

-- AlterTable
ALTER TABLE "workspace_content" ALTER COLUMN "content_id" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_username_key" ON "auth_user"("username");
