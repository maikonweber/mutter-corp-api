-- CreateTable
CREATE TABLE "users_profile" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "number_address" INTEGER NOT NULL,
    "neigh" TEXT NOT NULL,
    "userid" INTEGER NOT NULL,

    CONSTRAINT "users_profile_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users_profile" ADD CONSTRAINT "users_profile_userid_fkey" FOREIGN KEY ("userid") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
