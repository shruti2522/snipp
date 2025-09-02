-- CreateTable
CREATE TABLE "public"."_WorkspaceShares" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_WorkspaceShares_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_WorkspaceShares_B_index" ON "public"."_WorkspaceShares"("B");

-- AddForeignKey
ALTER TABLE "public"."_WorkspaceShares" ADD CONSTRAINT "_WorkspaceShares_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_WorkspaceShares" ADD CONSTRAINT "_WorkspaceShares_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."Workspace"("id") ON DELETE CASCADE ON UPDATE CASCADE;
