<script lang="ts">
  import reports from '#lib/data/reports-4471.json';
  import { type Report } from '#lib/kb/causes';
  import { misTagged, overlap } from '#lib/kb/split-4471';
  import { tenantOf } from '#lib/kb/locales';

  let { ticket }: { ticket: number } = $props();

  const tags = $derived(misTagged(reports as Report[], ticket, tenantOf));
  const rows = $derived(overlap(reports as Report[]));
  const pct = $derived(Math.round((tags.wrong / tags.of) * 100));
</script>

<ul class="facts">
  <li>
    Intake's tag disagrees with the cause on <strong>{tags.wrong}</strong> of
    <strong>{tags.of}</strong> reports ({pct}%). Intake reads the browser; the cause follows the
    tenant.
  </li>
  <li>
    The export holds <strong>{rows.rows}</strong> rows for <strong>{rows.reports}</strong>
    reports: <strong>{rows.dropped}</strong> ids come twice, with the same content. Count rows and
    you overstate the queue.
  </li>
</ul>

<style>
  .facts { font-size: 0.95rem; }
</style>
