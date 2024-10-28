-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Img" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "postId" TEXT NOT NULL,
    "img" TEXT NOT NULL,
    "isProcessed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Img_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Img" ("createdAt", "id", "img", "isProcessed", "postId") SELECT "createdAt", "id", "img", "isProcessed", "postId" FROM "Img";
DROP TABLE "Img";
ALTER TABLE "new_Img" RENAME TO "Img";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
