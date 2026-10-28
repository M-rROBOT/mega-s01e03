// Where each bug inside #4471 is filed, and where it stands after engineering closed #4471 on
// 5 October 2026. The engineering update covered two of the three.
import type { Problem } from '#lib/kb/split-4471';

export const REPO = 'M-rROBOT/mega-s01e03';

export type Ticket = {
  issue: number;
  what: string;
  state: 'open' | 'closed';
  // What the desk's update did to it, in the desk's own words where it has them.
  outcome: string;
};

export const TICKETS: Partial<Record<Problem, Ticket>> = {
  parser: {
    issue: 1,
    what: 'the shared parser reads day-first dates month first',
    state: 'closed',
    outcome: 'fixed · fix(dates): parse dd/mm for eu locales'
  },
  hint: {
    issue: 2,
    what: 'booking-v3 prints an MM/DD/YYYY hint to day-first tenants',
    state: 'closed',
    outcome: "won't fix · booking-v3 form retired"
  },
  'one-day': {
    issue: 3,
    what: 'invites land one day out: a zone, not a flip',
    state: 'open',
    outcome: 'not in the update'
  }
};

export const ticketUrl = (issue: number) => `https://github.com/${REPO}/issues/${issue}`;

export const stillOpen = () => Object.values(TICKETS).filter((t) => t.state === 'open');
