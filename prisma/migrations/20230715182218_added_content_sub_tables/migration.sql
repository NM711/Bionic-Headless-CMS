/*
  Warnings:

  - You are about to drop the column `headers` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `textareas` on the `content` table. All the data in the column will be lost.
  - You are about to drop the column `workspace_id` on the `content` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "content_workspace_id_key";

-- AlterTable
ALTER TABLE "content" DROP COLUMN "headers",
DROP COLUMN "images",
DROP COLUMN "textareas",
DROP COLUMN "workspace_id";

-- CreateTable
CREATE TABLE "header" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "header_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "textarea" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,

    CONSTRAINT "textarea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "content_id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "byte_data" BYTEA NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workspace_content" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "workspace_id" TEXT NOT NULL,
    "content_id" TEXT NOT NULL,

    CONSTRAINT "workspace_content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "header_id_key" ON "header"("id");

-- CreateIndex
CREATE INDEX "header_content_id_idx" ON "header"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "textarea_id_key" ON "textarea"("id");

-- CreateIndex
CREATE INDEX "textarea_content_id_idx" ON "textarea"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "image_id_key" ON "image"("id");

-- CreateIndex
CREATE INDEX "image_content_id_idx" ON "image"("content_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_content_id_key" ON "workspace_content"("id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_content_workspace_id_key" ON "workspace_content"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_content_content_id_key" ON "workspace_content"("content_id");

-- CreateIndex
CREATE INDEX "workspace_content_content_id_idx" ON "workspace_content"("content_id");
