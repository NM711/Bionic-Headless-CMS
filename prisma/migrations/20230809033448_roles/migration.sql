/*
  Warnings:

  - A unique constraint covering the columns `[user_id,workspace_id]` on the table `user_workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `role_id` to the `user_workspace` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "user_workspace_user_id_idx";

-- DropIndex
DROP INDEX "user_workspace_workspace_id_key";

-- AlterTable
ALTER TABLE "user_workspace" ADD COLUMN     "role_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "workspace" ADD COLUMN     "creation_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "key_constraint" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "key" DROP NOT NULL;

-- CreateTable
CREATE TABLE "role" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,

    CONSTRAINT "role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "role_id_key" ON "role"("id");

-- CreateIndex
CREATE UNIQUE INDEX "role_name_key" ON "role"("name");

-- CreateIndex
CREATE INDEX "user_workspace_user_id_workspace_id_role_id_idx" ON "user_workspace"("user_id", "workspace_id", "role_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_workspace_user_id_workspace_id_key" ON "user_workspace"("user_id", "workspace_id");
