-- CreateTable
CREATE TABLE "BookReview" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "RatingGreaterThanEqualToOne" CHECK ("rating" >= 1),
    CONSTRAINT "RatingLessThanEqualToFive" CHECK ("rating" <= 5),
    
    CONSTRAINT "BookReview_pkey" PRIMARY KEY ("id")
);
