export interface Driver {
  id: number;
  driverId: string;
  name: string;
  surname: string;
  imgUrl: string;
  teamId: string;
  nationality: string;
  nationalityImgUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface Team {
  id: number;
  teamId: string;
  teamName: string;
  teamImgUrl: string;
  bolidImgUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiDriver {
  driverId: string;
  name: string;
  surname: string;
  number: string;
  nationality: string;
}

export interface ApiTeam {
  teamId: string;
  teamName: string;
}

export interface Circuit {
  circuitId: string;
  name: string;
  country: string;
  city: string;
  length: number;
  lapRecord: string;
  firstParticipationYear: number;
  numberOfCorners: number;
  fastestLapDriverId: string;
  fastestLapTeamId: string;
  fastestLapYear: number;
}

export interface Race {
  raceId: string;
  name: string;
  round: number;
  date: string;
  circuit: Circuit;
}

export interface RaceResult {
  finishingPosition: number | string;
  gridPosition: number | string;
  raceTime: string;
  pointsObtained: number;
  retired: string | null;
}

export interface RaceResultItem {
  race: Race;
  result: RaceResult;
  sprintResult: RaceResult | null;
}

export interface DriverDetails {
  driverId: string;
  name: string;
  surname: string;
  nationality: string;
  birthday: string;
  number: number;
  shortName: string;
  url: string;
}

export interface TeamDetails {
  teamId: string;
  teamName: string;
  teamNationality: string;
  firstAppeareance: number;
  constructorsChampionships: number;
  driversChampionships: number;
  url: string;
}

export interface DriverDetailsResponse {
  api: string;
  url: string;
  limit: number;
  offset: number;
  total: number;
  season: number;
  championshipId: string;
  driver: DriverDetails;
  team: TeamDetails;
  results: RaceResultItem[];
}

export interface TeamDetailsResponse {
  api: string;
  url: string;
  total: number;
  season: number;
  team: TeamDetails[];
}

export type DriversState = {
  items: Driver[];
  byId: Record<number, Driver>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};

export type TeamsState = {
  items: Team[];
  byId: Record<number, Team>;
  status: "idle" | "loading" | "succeeded" | "failed";
  error?: string | null;
};
