/*
  Warnings:

  - You are about to drop the column `content` on the `ListingApartment` table. All the data in the column will be lost.
  - You are about to drop the column `tagline` on the `ListingApartment` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ListingApartment` table. All the data in the column will be lost.
  - You are about to alter the column `extId` on the `ListingApartment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `extUrl` on the `ListingApartment` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "ListingApartment" DROP COLUMN "content",
DROP COLUMN "tagline",
DROP COLUMN "title",
ADD COLUMN     "rawContent" TEXT,
ADD COLUMN     "rawExcerpt" TEXT,
ADD COLUMN     "rawMeta" VARCHAR(255),
ADD COLUMN     "rawPrice" VARCHAR(255),
ADD COLUMN     "rawTitle" VARCHAR(255),
ALTER COLUMN "extId" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "extUrl" SET DATA TYPE VARCHAR(255);
