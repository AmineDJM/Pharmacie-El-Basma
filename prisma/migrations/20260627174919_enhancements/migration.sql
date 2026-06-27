-- AlterTable
ALTER TABLE "Article" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Brand" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Faq" ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "isBio" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "translations" JSONB;

-- AlterTable
ALTER TABLE "SiteSettings" ADD COLUMN     "translations" JSONB;

-- CreateTable
CREATE TABLE "MediaImage" (
    "id" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "contentType" TEXT NOT NULL DEFAULT 'image/webp',
    "width" INTEGER NOT NULL DEFAULT 0,
    "height" INTEGER NOT NULL DEFAULT 0,
    "size" INTEGER NOT NULL DEFAULT 0,
    "alt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MediaImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Product_isBio_idx" ON "Product"("isBio");
