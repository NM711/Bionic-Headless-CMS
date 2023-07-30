-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Workspace" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL,
    "headers" TEXT[],
    "textareas" TEXT[],
    "images" TEXT[]
);

-- CreateTable
CREATE TABLE "User_Workspace" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "workspace_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_id_key" ON "Workspace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_key_key" ON "Workspace"("key");

-- CreateIndex
CREATE UNIQUE INDEX "Content_id_key" ON "Content"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Content_workspace_id_key" ON "Content"("workspace_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Workspace_id_key" ON "User_Workspace"("id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Workspace_user_id_key" ON "User_Workspace"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "User_Workspace_workspace_id_key" ON "User_Workspace"("workspace_id");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Workspace" ADD CONSTRAINT "User_Workspace_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User_Workspace" ADD CONSTRAINT "User_Workspace_workspace_id_fkey" FOREIGN KEY ("workspace_id") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
