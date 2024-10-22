-- AlterTable
ALTER TABLE "Book" DROP COLUMN "author",
ADD COLUMN     "authors" TEXT[];
