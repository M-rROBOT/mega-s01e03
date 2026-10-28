// #4471 was merged as one bug. It is three. This file is what decides which, and it is the only
// thing that counts: the page says what each bug is, this says how many reports it covers.
//
// It adds one rule to causes.ts and changes nothing in it. causes.ts places a report by its
// tenant's locale and the form it came through, and that is all it can see. A report that
// describes a one-day move is invisible to it: the tenant is still day-first, so it lands under
// `parser`. The desk spotted those by reading them and wrote the ids down in desk-notes.json.
// Here that note stops being a footnote and becomes a group of its own.
import notes from '#lib/data/desk-notes.json';
import { causeOf, uniqueById, type Cause, type Report, type Tenant } from '#lib/kb/causes';

export type Problem = Cause | 'one-day' | 'unplaced';

// The order they are filed in, worst first. Not an order a count can decide.
export const PROBLEMS: readonly Problem[] = ['parser', 'hint', 'one-day', 'unplaced'];

const ONE_DAY: ReadonlySet<string> = new Set(notes.oneDayMove);

// A one-day move is not a month flip, so it is not the parser's bug, whatever the tenant writes.
export function problemOf(r: Report, t: Tenant | undefined): Problem {
  return ONE_DAY.has(r.id) ? 'one-day' : (causeOf(r, t) ?? 'unplaced');
}

export type ProblemGroup = {
  problem: Problem;
  reports: Report[];
  tenants: number;
  channels: Record<string, number>;
  taggedAs: Record<string, number>;
  // Reports whose intake tag disagrees with the cause their tenant implies.
  misTagged: number;
  firstSeen: string;
  lastSeen: string;
};

const tally = <T>(xs: T[], key: (x: T) => string): Record<string, number> =>
  xs.reduce<Record<string, number>>((n, x) => ({ ...n, [key(x)]: (n[key(x)] ?? 0) + 1 }), {});

export function splitTicket(
  reports: Report[],
  ticket: number,
  tenantOf: (r: Report) => Tenant | undefined
): ProblemGroup[] {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  const byProblem = new Map<Problem, Report[]>();
  for (const r of merged) {
    const p = problemOf(r, tenantOf(r));
    byProblem.set(p, [...(byProblem.get(p) ?? []), r]);
  }
  return [...byProblem.entries()]
    .map(([problem, rs]) => {
      const days = rs.map((r) => r.receivedAt.slice(0, 10)).sort();
      return {
        problem,
        reports: rs,
        tenants: new Set(rs.map((r) => r.tenant)).size,
        channels: tally(rs, (r) => r.channel),
        taggedAs: tally(rs, (r) => r.meta.intakeTag),
        misTagged: rs.filter((r) => disagrees(r, tenantOf(r))).length,
        firstSeen: days[0],
        lastSeen: days[days.length - 1]
      };
    })
    .sort((a, b) => PROBLEMS.indexOf(a.problem) - PROBLEMS.indexOf(b.problem));
}

// Intake tags from the reporter's browser. The cause follows the tenant. Where they disagree,
// the tag is the one that is wrong.
export function disagrees(r: Report, t: Tenant | undefined): boolean {
  const cause = causeOf(r, t);
  return cause !== null && cause !== r.meta.intakeTag;
}

export function misTagged(reports: Report[], ticket: number, tenantOf: (r: Report) => Tenant | undefined) {
  const merged = uniqueById(reports).filter((r) => r.mergedInto === ticket);
  return { of: merged.length, wrong: merged.filter((r) => disagrees(r, tenantOf(r))).length };
}

// The ticket system exports in pages that overlap. The rows are not the reports.
export function overlap(reports: Report[]) {
  const unique = uniqueById(reports);
  return { rows: reports.length, reports: unique.length, dropped: reports.length - unique.length };
}
