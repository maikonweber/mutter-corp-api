export class FullDashboard {
  season: number;
  leagues: number;
  current: boolean;
}

export class FullDashboardResponse {
  rounds: any;
  league: any;
  team_statistic: any;
}

export class TeamStatictDTO {
  season : number;
  leagues: number;
  current: number;
  team_id: number;
}
