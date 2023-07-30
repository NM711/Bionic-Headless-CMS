-- DropIndex
DROP INDEX "user_workspace_user_id_workspace_id_idx";

-- CreateIndex
CREATE INDEX "user_workspace_user_id_idx" ON "user_workspace"("user_id");

-- CreateIndex
CREATE INDEX "user_workspace_workspace_id_idx" ON "user_workspace"("workspace_id");
