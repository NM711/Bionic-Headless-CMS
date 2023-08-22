/*
  Warnings:

  - You are about to drop the column `workspace_id` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `image` table. All the data in the column will be lost.
  - You are about to drop the column `role_id` on the `user_workspace` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[workspace_content_collection_id]` on the table `content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workspace_content_collection_id` to the `content` table without a default value. This is not possible if the table is not empty.
  - Added the required column `byte` to the `image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `role_name` to the `user_workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "content_workspace_id_key";

-- DropIndex
DROP INDEX "user_workspace_user_id_workspace_id_role_id_idx";

-- AlterTable
ALTER TABLE "content" DROP COLUMN "workspace_id",
ADD COLUMN     "workspace_content_collection_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "image" DROP COLUMN "url",
ADD COLUMN     "byte" BYTEA NOT NULL;

-- AlterTable
ALTER TABLE "user_workspace" DROP COLUMN "role_id",
ADD COLUMN     "role_name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "workspace_content_collection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,

    CONSTRAINT "workspace_content_collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_content_collection_id_key" ON "workspace_content_collection"("id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_content_collection_workspace_id_key" ON "workspace_content_collection"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_content_collection_content_id_key" ON "workspace_content_collection"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_workspace_content_collection_id_key" ON "content"("workspace_content_collection_id");

-- CreateIndex
CREATE INDEX "user_workspace_user_id_workspace_id_idx" ON "user_workspace"("user_id", "workspace_id");
