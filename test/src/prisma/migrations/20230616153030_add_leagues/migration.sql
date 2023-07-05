-- CreateEnum
CREATE TYPE "typecup" AS ENUM ('Cup', 'Champion');

-- CreateTable
CREATE TABLE "leagues" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "cup" "typecup" NOT NULL,
    "country" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flag" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "country" (
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flag" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "team" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "founded" INTEGER NOT NULL,
    "national" BOOLEAN NOT NULL,
    "logo" TEXT NOT NULL,
    "venues" JSONB NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "leagues_id_key" ON "leagues"("id");

-- CreateIndex
CREATE UNIQUE INDEX "country_name_key" ON "country"("name");

-- CreateIndex
CREATE UNIQUE INDEX "team_id_key" ON "team"("id");
