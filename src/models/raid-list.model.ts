import { RaidFromAPI } from './raid-from-api.model';

export interface RaidList {
  raidName: string;
  codes: Array<RaidFromAPI>;
}
