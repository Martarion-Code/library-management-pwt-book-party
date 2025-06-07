-- First add the column as nullable
-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;

-- Set a default hashed password ('password123') for existing users
UPDATE "User" SET "password" = '$2b$10$K8zFQwEZu9Z6mX9ZgX6Z6O1Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z6Z';

-- Make the column required
ALTER TABLE "User" ALTER COLUMN "password" SET NOT NULL;
