-- DropForeignKey
ALTER TABLE "BookRecommendation" DROP CONSTRAINT "BookRecommendation_userId_fkey";

-- AlterTable
ALTER TABLE "BookRecommendation" DROP COLUMN "aiModel",
DROP COLUMN "userId",
ADD COLUMN     "bookPromptId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "BookPrompt" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "promptText" TEXT NOT NULL,
    "promptGenreId" INTEGER,
    "promptSubgenreId" INTEGER,
    "aiModel" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "BookPrompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3),
    "displayName" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Genre_displayName_key" ON "Genre"("displayName");

-- AddForeignKey
ALTER TABLE "BookPrompt" ADD CONSTRAINT "BookPrompt_promptGenreId_fkey" FOREIGN KEY ("promptGenreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPrompt" ADD CONSTRAINT "BookPrompt_promptSubgenreId_fkey" FOREIGN KEY ("promptSubgenreId") REFERENCES "Genre"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookPrompt" ADD CONSTRAINT "BookPrompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookRecommendation" ADD CONSTRAINT "BookRecommendation_bookPromptId_fkey" FOREIGN KEY ("bookPromptId") REFERENCES "BookPrompt"("id") ON DELETE CASCADE ON UPDATE CASCADE;
