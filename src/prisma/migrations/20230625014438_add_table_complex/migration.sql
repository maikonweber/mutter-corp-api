-- CreateTable
CREATE TABLE "statistics_team" (
    "league_team_id" INTEGER NOT NULL,
    "fixtures" JSONB NOT NULL,
    "biggest" JSONB NOT NULL,
    "goals" JSONB NOT NULL,
    "clean_sheet" JSONB NOT NULL,
    "failed_to_score" JSONB NOT NULL,
    "penalty" JSONB NOT NULL,
    "lineups" JSONB NOT NULL,
    "cards" JSONB NOT NULL
);

-- CreateTable
CREATE TABLE "fixture_round" (
    "id" SERIAL NOT NULL,
    "round" TEXT NOT NULL,
    "seasson" INTEGER NOT NULL,
    "league" JSONB NOT NULL,
    "leagues_teams_id" INTEGER NOT NULL,
    "status" JSONB NOT NULL,
    "venus" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "goals" JSONB NOT NULL,
    "score" JSONB NOT NULL,
    "fulltime" JSONB NOT NULL,
    "extratime" JSONB NOT NULL,
    "penalty" JSONB NOT NULL,

    CONSTRAINT "fixture_round_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "football_players" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "age" INTEGER NOT NULL,
    "birth" JSONB NOT NULL,
    "nationality" TEXT NOT NULL,
    "height" TEXT NOT NULL,
    "weight" TEXT NOT NULL,
    "injured" BOOLEAN NOT NULL,
    "photo" TEXT NOT NULL,
    "statistics" JSONB NOT NULL,

    CONSTRAINT "football_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_player" (
    "id" SERIAL NOT NULL,
    "team_id" INTEGER NOT NULL,
    "player_id" INTEGER NOT NULL,

    CONSTRAINT "team_player_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "statistics_team_league_team_id_key" ON "statistics_team"("league_team_id");

-- CreateIndex
CREATE UNIQUE INDEX "team_player_team_id_player_id_key" ON "team_player"("team_id", "player_id");

-- AddForeignKey
ALTER TABLE "statistics_team" ADD CONSTRAINT "statistics_team_league_team_id_fkey" FOREIGN KEY ("league_team_id") REFERENCES "league_teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_player" ADD CONSTRAINT "team_player_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_player" ADD CONSTRAINT "team_player_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "football_players"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
