import { RaidList } from './raid-list.model';

export interface wsResponse {}

export type ClientMesssage =
  | {
      action: 'followRaids';
      raids: string[];
    }
  | {
      action: 'unFollowRaids';
      raids: string[];
    }
  | {
      action: 'raidCodes';
      raidCodes: RaidList[];
    }
  | {
      action: 'welcomeMessage';
      message: string;
    };
