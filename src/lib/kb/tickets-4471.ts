// Where each bug inside #4471 is filed now: one ticket per problem. #4471 itself stays as the
// desk's record of the queue.
import type { Problem } from '#lib/kb/split-4471';

export const REPO = 'M-rROBOT/mega-s01e03';

export const TICKETS: Partial<Record<Problem, { issue: number; what: string }>> = {
  parser: { issue: 1, what: 'the shared parser reads day-first dates month first' },
  hint: { issue: 2, what: 'booking-v3 prints an MM/DD/YYYY hint to day-first tenants' },
  'one-day': { issue: 3, what: 'invites land one day out: a zone, not a flip' }
};

export const ticketUrl = (issue: number) => `https://github.com/${REPO}/issues/${issue}`;
