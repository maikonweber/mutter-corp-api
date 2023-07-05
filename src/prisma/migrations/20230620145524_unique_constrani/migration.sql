/*
  Warnings:

  - A unique constraint covering the columns `[league_id,team_id]` on the table `league_teams` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "league_teams_league_id_team_id_key" ON "league_teams"("league_id", "team_id");
