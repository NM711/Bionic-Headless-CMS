/*
  Warnings:

  - You are about to drop the `Auth_User` table. If the table is not empty, all the data it contains will be lost.
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

-- DropTable
DROP TABLE "Auth_User";

-- DropTable
DROP TABLE "Content";

-- DropTable
DROP TABLE "User_Workspace";

-- DropTable
DROP TABLE "Workspace";

-- CreateTable
CREATE TABLE "auth_session" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "active_expires" BIGINT NOT NULL,
    "idle_expires" BIGINT NOT NULL,

    CONSTRAINT "auth_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_key" (
    "id" TEXT NOT NULL,
    "hashed_password" TEXT,
    "user_id" TEXT NOT NULL,
    "primary_key" BOOLEAN NOT NULL,
    "expires" BIGINT,

    CONSTRAINT "auth_key_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_user" (
    "id" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

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
CREATE UNIQUE INDEX "auth_session_id_key" ON "auth_session"("id");

-- CreateIndex
CREATE INDEX "auth_session_user_id_idx" ON "auth_session"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_key_id_key" ON "auth_key"("id");

-- CreateIndex
CREATE INDEX "auth_key_user_id_idx" ON "auth_key"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_id_key" ON "auth_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_email_key" ON "auth_user"("email");

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

-- CreateIndex
CREATE UNIQUE INDEX "user_workspace_user_id_key" ON "user_workspace"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_workspace_workspace_id_key" ON "user_workspace"("workspace_id");

-- AddForeignKey
ALTER TABLE "auth_session" ADD CONSTRAINT "auth_session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_key" ADD CONSTRAINT "auth_key_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "content" ADD CONSTRAINT "content_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspace" ADD CONSTRAINT "user_workspace_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_workspace" ADD CONSTRAINT "user_workspace_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
