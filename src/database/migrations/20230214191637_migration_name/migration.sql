-- CreateTable
CREATE TABLE "rating_anime" (
    "user_id" UUID NOT NULL,
    "anime_id" UUID NOT NULL,
    "rating" INTEGER NOT NULL,

    CONSTRAINT "rating_anime_pkey" PRIMARY KEY ("anime_id","user_id")
);

-- AddForeignKey
ALTER TABLE "rating_anime" ADD CONSTRAINT "rating_anime_anime_id_fkey" FOREIGN KEY ("anime_id") REFERENCES "anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_anime" ADD CONSTRAINT "rating_anime_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
