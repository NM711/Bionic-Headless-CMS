-- AlterTable
ALTER TABLE "auth_user" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "content" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "user_workspace" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "workspace" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();
