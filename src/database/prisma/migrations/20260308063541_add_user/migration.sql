/*
  Warnings:

  - The primary key for the `UserPublic` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `first_name` on the `UserPublic` table. All the data in the column will be lost.
  - You are about to drop the column `last_name` on the `UserPublic` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `UserPublic` table. All the data in the column will be lost.
  - The `id` column on the `UserPublic` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[email]` on the table `UserPublic` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `UserPublic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passwordHash` to the `UserPublic` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `UserPublic` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "UserPublic" DROP CONSTRAINT "UserPublic_pkey",
DROP COLUMN "first_name",
DROP COLUMN "last_name",
DROP COLUMN "password",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ADD COLUMN     "refreshTokenHash" TEXT,
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'user',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "UserPublic_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "UserPublic_email_key" ON "UserPublic"("email");
