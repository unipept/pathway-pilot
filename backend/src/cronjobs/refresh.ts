/**
 * Entry point for the scheduled KEGG data refresh.
 *
 * Run directly:      npm run refresh-data
 * Or from a timer:   node build/cronjobs/refresh.js
 *
 * Exits 0 on success and 1 on any failure, so a systemd timer or cron job
 * can tell the difference and surface it.
 */
import KeggFetcher from './KeggFetcher';

const main = async () => {
    const startedAt = Date.now();
    console.log(`[kegg-refresh] starting at ${new Date().toISOString()}`);

    await new KeggFetcher().fetchFiles();

    const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
    console.log(`[kegg-refresh] completed in ${seconds}s`);
};

main().catch((error: unknown) => {
    console.error('[kegg-refresh] FAILED:', error instanceof Error ? error.message : error);
    process.exitCode = 1;
});
