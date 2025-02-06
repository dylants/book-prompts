-- CreateTable
CREATE TABLE "AuthorReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "rating" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,

    CONSTRAINT "RatingGreaterThanEqualToOne" CHECK ("rating" >= 1),
    CONSTRAINT "RatingLessThanEqualToFive" CHECK ("rating" <= 5),
    
    CONSTRAINT "AuthorReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuthorReview" ADD CONSTRAINT "AuthorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuthorReview" ADD CONSTRAINT "AuthorReview_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE CASCADE ON UPDATE CASCADE;
