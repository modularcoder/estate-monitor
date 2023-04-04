/*
  Warnings:

  - Added the required column `updatedAt` to the `ListingApartment` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `source` on the `ListingApartment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `city` on the `ListingApartment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `district` on the `ListingApartment` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Made the column `type` on table `ListingApartment` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "ListingSource" AS ENUM ('LISTAM');

-- AlterTable
ALTER TABLE "ListingApartment" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
DROP COLUMN "source",
ADD COLUMN     "source" "ListingSource" NOT NULL,
DROP COLUMN "city",
ADD COLUMN     "city" "City" NOT NULL,
DROP COLUMN "district",
ADD COLUMN     "district" "District" NOT NULL,
ALTER COLUMN "type" SET NOT NULL;
