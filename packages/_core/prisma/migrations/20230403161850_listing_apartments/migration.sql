/*
  Warnings:

  - You are about to drop the `Listing` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ListingType" AS ENUM ('SELL', 'RENT');

-- CreateEnum
CREATE TYPE "BuildingType" AS ENUM ('STONE', 'PANEL', 'MONOLITH');

-- CreateEnum
CREATE TYPE "RenovationType" AS ENUM ('ZERO', 'OLD', 'LIGHT', 'AVERAGE', 'MODERN', 'ADVANCED');

-- CreateEnum
CREATE TYPE "City" AS ENUM ('YEREVAN');

-- CreateEnum
CREATE TYPE "District" AS ENUM ('AJAPNYAK', 'ARABKIR', 'AVAN', 'DAVITASHEN', 'EREBUNI', 'QANAQER', 'KENTRON', 'MALATIA', 'NORQ', 'SHENGAVIT', 'MARASH', 'NUBARASHEN');

-- DropTable
DROP TABLE "Listing";

-- CreateTable
CREATE TABLE "ListingApartment" (
    "id" SERIAL NOT NULL,
    "source" VARCHAR(255) NOT NULL,
    "extId" TEXT NOT NULL,
    "extUrl" TEXT NOT NULL,
    "title" VARCHAR(255),
    "tagline" VARCHAR(255),
    "content" TEXT,
    "city" "District" NOT NULL,
    "district" VARCHAR(255) NOT NULL,
    "address" VARCHAR(255),
    "type" "ListingType",
    "buildingType" "BuildingType",
    "renovationType" "RenovationType",
    "statNoRooms" INTEGER NOT NULL,
    "statArea" INTEGER NOT NULL,
    "statPriceAmd" INTEGER NOT NULL,
    "statPriceUsd" INTEGER NOT NULL,
    "statPricePerMeterAmd" INTEGER NOT NULL,
    "statPricePerMeterUsd" INTEGER NOT NULL,
    "statExchangeRate" INTEGER NOT NULL,
    "statBuildingFloors" INTEGER NOT NULL,
    "statFloor" INTEGER NOT NULL,
    "statFloorIsLast" BOOLEAN DEFAULT false,
    "statFloorIsFirst" BOOLEAN DEFAULT false,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isProcessed" BOOLEAN DEFAULT false,
    "isUnavailable" BOOLEAN DEFAULT false,
    "extCreatedAt" TIMESTAMP(3),
    "extUpdatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "meta" JSONB,

    CONSTRAINT "ListingApartment_pkey" PRIMARY KEY ("id")
);
