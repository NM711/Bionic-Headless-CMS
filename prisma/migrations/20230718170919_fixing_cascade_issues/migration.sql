/*
  Warnings:

  - A unique constraint covering the columns `[workspace_id]` on the table `user_workspace` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_workspace_workspace_id_idx";

-- CreateIndex
CREATE UNIQUE INDEX "user_workspace_workspace_id_key" ON "user_workspace"("workspace_id");
