/*
  Warnings:

  - You are about to drop the `auth_key` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `auth_session` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "content" ADD CONSTRAINT "content_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_workspace" ADD CONSTRAINT "user_workspace_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "workspace" ADD CONSTRAINT "workspace_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "auth_key";

-- DropTable
DROP TABLE "auth_session";

-- CreateIndex
CREATE INDEX "user_workspace_user_id_idx" ON "user_workspace"("user_id");
