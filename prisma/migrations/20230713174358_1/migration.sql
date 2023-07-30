/*
  Warnings:

  - You are about to drop the `Content` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User_Workspace` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Workspace` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Workspace" DROP CONSTRAINT "User_Workspace_user_id_fkey";

-- DropForeignKey
ALTER TABLE "User_Workspace" DROP CONSTRAINT "User_Workspace_workspace_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_key" DROP CONSTRAINT "auth_key_user_id_fkey";

-- DropForeignKey
ALTER TABLE "auth_session" DROP CONSTRAINT "auth_session_user_id_fkey";

-- AlterTable
ALTER TABLE "auth_user" ADD CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Content";

-- DropTable
DROP TABLE "User_Workspace";

-- DropTable
DROP TABLE "Workspace";

-- CreateTable
CREATE TABLE "workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "content" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "headers" TEXT[],
    "textareas" TEXT[],
    "images" TEXT[]
);

-- CreateTable
CREATE TABLE "user_workspace" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "workspace_id_key" ON "workspace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_key_key" ON "workspace"("key");

-- CreateIndex
CREATE UNIQUE INDEX "content_id_key" ON "content"("id");

-- CreateIndex
CREATE UNIQUE INDEX "content_workspace_id_key" ON "content"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_workspace_id_key" ON "user_workspace"("id");
