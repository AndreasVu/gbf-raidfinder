import { RaidFromAPI } from './raid-from-api.model';

export class RaidList {
  constructor(public raidName: string, public codes: RaidFromAPI[]) {}
}
