-- CreateTable
CREATE TABLE "DigestQueue" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "scheduledFor" TIMESTAMP(3) NOT NULL,
    "sent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DigestQueue_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DigestQueue_userId_idx" ON "DigestQueue"("userId");

-- CreateIndex
CREATE INDEX "DigestQueue_scheduledFor_idx" ON "DigestQueue"("scheduledFor");

-- AddForeignKey
ALTER TABLE "DigestQueue" ADD CONSTRAINT "DigestQueue_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "_DigestQueueToMatch" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DigestQueueToMatch_AB_unique" ON "_DigestQueueToMatch"("A", "B");

-- CreateIndex
CREATE INDEX "_DigestQueueToMatch_B_index" ON "_DigestQueueToMatch"("B");

-- AddForeignKey
ALTER TABLE "_DigestQueueToMatch" ADD CONSTRAINT "_DigestQueueToMatch_A_fkey" FOREIGN KEY ("A") REFERENCES "DigestQueue"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DigestQueueToMatch" ADD CONSTRAINT "_DigestQueueToMatch_B_fkey" FOREIGN KEY ("B") REFERENCES "Match"("id") ON DELETE CASCADE ON UPDATE CASCADE;
