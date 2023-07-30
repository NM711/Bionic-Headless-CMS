/*
  Warnings:

  - The primary key for the `auth_user` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `auth_user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `content` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `content` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `user_workspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `user_workspace` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `workspace` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `workspace` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "auth_user" DROP CONSTRAINT "auth_user_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "auth_user_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "content" DROP CONSTRAINT "content_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "content_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "user_workspace" DROP CONSTRAINT "user_workspace_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "user_workspace_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "workspace" DROP CONSTRAINT "workspace_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "workspace_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "auth_user_id_key" ON "auth_user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "content_id_key" ON "content"("id");

-- CreateIndex
CREATE UNIQUE INDEX "user_workspace_id_key" ON "user_workspace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "workspace_id_key" ON "workspace"("id");
