/*
  Warnings:

  - You are about to drop the column `content_id` on the `collection` table. All the data in the column will be lost.
  - You are about to drop the column `content_id` on the `header` table. All the data in the column will be lost.
  - You are about to drop the column `content_id` on the `textarea` table. All the data in the column will be lost.
  - You are about to drop the `content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `image` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `collection_id` to the `header` table without a default value. This is not possible if the table is not empty.
  - Added the required column `collection_id` to the `textarea` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "collection_content_id_key";

-- DropIndex
DROP INDEX "collection_workspace_id_key";

-- DropIndex
DROP INDEX "header_content_id_idx";

-- DropIndex
DROP INDEX "textarea_content_id_idx";

-- AlterTable
ALTER TABLE "collection" DROP COLUMN "content_id";

-- AlterTable
ALTER TABLE "header" DROP COLUMN "content_id",
ADD COLUMN     "collection_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "textarea" DROP COLUMN "content_id",
ADD COLUMN     "collection_id" TEXT NOT NULL;

-- DropTable
DROP TABLE "content";

-- DropTable
DROP TABLE "image";

-- CreateTable
CREATE TABLE "collection_media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "media_id" TEXT NOT NULL,
    "collection_id" TEXT NOT NULL,

    CONSTRAINT "collection_media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "media_collection_id" TEXT NOT NULL,
    "byte" BYTEA NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "collection_media_id_key" ON "collection_media"("id");

-- CreateIndex
CREATE UNIQUE INDEX "collection_media_media_id_key" ON "collection_media"("media_id");

-- CreateIndex
CREATE INDEX "collection_media_collection_id_idx" ON "collection_media"("collection_id");

-- CreateIndex
CREATE UNIQUE INDEX "media_id_key" ON "media"("id");

-- CreateIndex
CREATE INDEX "media_media_collection_id_idx" ON "media"("media_collection_id");

-- CreateIndex
CREATE INDEX "collection_workspace_id_idx" ON "collection"("workspace_id");

-- CreateIndex
CREATE INDEX "header_collection_id_idx" ON "header"("collection_id");

-- CreateIndex
CREATE INDEX "textarea_collection_id_idx" ON "textarea"("collection_id");
