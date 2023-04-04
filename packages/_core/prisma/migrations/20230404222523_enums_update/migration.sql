/*
  Warnings:

  - The values [MARASH] on the enum `District` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "District_new" AS ENUM ('AJAPNYAK', 'ARABKIR', 'AVAN', 'DAVITASHEN', 'EREBUNI', 'QANAQER', 'KENTRON', 'MALATIA', 'NORQ', 'SHENGAVIT', 'NORQMARASH', 'NUBARASHEN');
ALTER TABLE "ListingApartment" ALTER COLUMN "district" TYPE "District_new" USING ("district"::text::"District_new");
ALTER TYPE "District" RENAME TO "District_old";
ALTER TYPE "District_new" RENAME TO "District";
DROP TYPE "District_old";
COMMIT;
