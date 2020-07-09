export interface GroupStats {
  name: string;
  readonly numPeople: number;
  readonly numActiveMembers: number;
  readonly pctActiveMembers: number;
  readonly numRegisteredMembers: number;
  readonly pctRegisteredMembers: number;
}