/*
  Warnings:

  - You are about to drop the column `workspace_content_collection_id` on the `content` table. All the data in the column will be lost.
  - You are about to drop the `workspace_content_collection` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[collection_id]` on the table `content` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `collection_id` to the `content` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "content_workspace_content_collection_id_key";

-- AlterTable
ALTER TABLE "content" DROP COLUMN "workspace_content_collection_id",
ADD COLUMN     "collection_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "workspace_content_collection";

-- CreateTable
CREATE TABLE "collection" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "collection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_id_key" ON "collection"("id");

-- CreateIndex
CREATE UNIQUE INDEX "collection_workspace_id_key" ON "collection"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "collection_content_id_key" ON "collection"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "content_collection_id_key" ON "content"("collection_id");
