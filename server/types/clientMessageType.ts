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
      action: 'welcomeMessage';
      message: string;
    };
