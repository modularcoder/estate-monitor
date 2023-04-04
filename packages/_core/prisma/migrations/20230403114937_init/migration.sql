-- CreateTable
CREATE TABLE "Listing" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "tagline" VARCHAR(200) NOT NULL,
    "extId" TEXT NOT NULL,
    "extUrl" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "isUnavailable" BOOLEAN NOT NULL DEFAULT false,
    "extCreatedAt" TIMESTAMP(3) NOT NULL,
    "extUpdatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL,
    "meta" JSONB NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);
