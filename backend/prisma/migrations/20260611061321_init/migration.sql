-- CreateTable
CREATE TABLE "Prediction" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "predictor" TEXT NOT NULL,
    "predictionStatus" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    "homeTeam" TEXT NOT NULL,
    "awayTeam" TEXT NOT NULL,
    "predictedHomeGoals" INTEGER NOT NULL,
    "predictedAwayGoals" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,

    CONSTRAINT "Prediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "jobType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT NOT NULL,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);
