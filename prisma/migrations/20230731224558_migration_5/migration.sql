/*
  Warnings:

  - You are about to drop the column `creator_id` on the `content` table. All the data in the column will be lost.
  - You are about to drop the `workspace_content` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[workspace_id]` on the table `content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspace_id` to the `content` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "content" DROP COLUMN "creator_id",
ADD COLUMN     "workspace_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "workspace_content";

-- CreateIndex
CREATE UNIQUE INDEX "content_workspace_id_key" ON "content"("workspace_id");
