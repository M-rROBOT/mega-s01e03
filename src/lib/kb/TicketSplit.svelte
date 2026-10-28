<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { type Report } from '#lib/kb/causes';
  import { splitTicket } from '#lib/kb/split-4471';
  import { TICKETS, ticketUrl } from '#lib/kb/tickets-4471';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  const groups = $derived(splitTicket(reports as Report[], ticket, tenantOf));
  const total = $derived(groups.reduce((n, g) => n + g.reports.length, 0));
  const open = $derived(groups.filter((g) => TICKETS[g.problem]?.state === 'open'));
  const openReports = $derived(open.reduce((n, g) => n + g.reports.length, 0));
  const spread = (n: Record<string, number>) =>
    Object.entries(n)
      .sort((a, b) => b[1] - a[1])
      .map(([k, v]) => `${k} ${v}`)
      .join(' · ');
</script>

<p class="sum">
  <strong>{total}</strong> reports merged into #{ticket} ·
  <strong>{groups.length}</strong>
  {groups.length === 1 ? 'problem' : 'problems'} ·
  <strong>{open.length}</strong> still open, covering <strong>{openReports}</strong> reports
</p>

<table>
  <thead>
    <tr><th>problem</th><th>reports</th><th>tenants</th><th>how they came in</th><th>ticket</th><th>where it stands</th></tr>
  </thead>
  <tbody>
    {#each groups as g (g.problem)}
      {@const t = TICKETS[g.problem]}
      <tr class:open={t?.state === 'open'}>
        <td><code>{g.problem}</code></td>
        <td class="n">{g.reports.length}</td>
        <td class="n">{g.tenants}</td>
        <td class="spread">{spread(g.channels)}</td>
        <td>
          {#if t}<a href={ticketUrl(t.issue)}>#{t.issue}</a>{:else}<span class="none">no ticket</span>{/if}
        </td>
        <td class="spread">{t ? t.outcome : '—'}</td>
      </tr>
    {/each}
  </tbody>
</table>

<ul class="what">
  {#each groups as g (g.problem)}
    {@const t = TICKETS[g.problem]}
    {#if t}
      <li>
        <code>{g.problem}</code> · {g.reports.length} reports ·
        <a href={ticketUrl(t.issue)}>#{t.issue}</a> {t.state} — {t.what}
      </li>
    {/if}
  {/each}
</ul>

<style>
  .sum { font-size: 1.1rem; }
  .n { font-variant-numeric: tabular-nums; }
  .spread { color: var(--muted); font-size: 0.85em; }
  .none { color: var(--warn); }
  .open td { background: var(--warn-bg); }
  .open td:last-child { color: var(--warn); font-weight: 600; }
  .what { color: var(--muted); font-size: 0.9rem; }
  .what code { color: var(--fg); }
</style>
