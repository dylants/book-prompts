-- DropForeignKey
ALTER TABLE "BookPrompt" DROP CONSTRAINT "BookPrompt_promptGenreId_fkey";

-- DropForeignKey
ALTER TABLE "BookPrompt" DROP CONSTRAINT "BookPrompt_promptSubgenreId_fkey";

-- DropForeignKey
ALTER TABLE "BookPrompt" DROP CONSTRAINT "BookPrompt_userId_fkey";

-- DropForeignKey
ALTER TABLE "BookRecommendation" DROP CONSTRAINT "BookRecommendation_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookRecommendation" DROP CONSTRAINT "BookRecommendation_bookPromptId_fkey";

-- DropForeignKey
ALTER TABLE "BookReview" DROP CONSTRAINT "BookReview_bookId_fkey";

-- DropForeignKey
ALTER TABLE "BookReview" DROP CONSTRAINT "BookReview_userId_fkey";

-- AlterTable
ALTER TABLE "Book" DROP CONSTRAINT "Book_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Book_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Book_id_seq";

-- AlterTable
ALTER TABLE "BookPrompt" DROP CONSTRAINT "BookPrompt_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "promptGenreId" SET DATA TYPE TEXT,
ALTER COLUMN "promptSubgenreId" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BookPrompt_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BookPrompt_id_seq";

-- AlterTable
ALTER TABLE "BookRecommendation" DROP CONSTRAINT "BookRecommendation_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "bookId" SET DATA TYPE TEXT,
ALTER COLUMN "bookPromptId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BookRecommendation_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BookRecommendation_id_seq";

-- AlterTable
ALTER TABLE "BookReview" DROP CONSTRAINT "BookReview_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "userId" SET DATA TYPE TEXT,
ALTER COLUMN "bookId" SET DATA TYPE TEXT,
ADD CONSTRAINT "BookReview_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BookReview_id_seq";

-- AlterTable
ALTER TABLE "Genre" DROP CONSTRAINT "Genre_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Genre_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Genre_id_seq";

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "uuid",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "BookReview" ADD CONSTRAINT "BookReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookReview" ADD CONSTRAINT "BookReview_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPrompt" ADD CONSTRAINT "BookPrompt_promptGenreId_fkey" FOREIGN KEY ("promptGenreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPrompt" ADD CONSTRAINT "BookPrompt_promptSubgenreId_fkey" FOREIGN KEY ("promptSubgenreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPrompt" ADD CONSTRAINT "BookPrompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRecommendation" ADD CONSTRAINT "BookRecommendation_bookPromptId_fkey" FOREIGN KEY ("bookPromptId") REFERENCES "BookPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRecommendation" ADD CONSTRAINT "BookRecommendation_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;
