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

// Exported so a test can drive it directly - including the failure path -
// without the invocation below running a real refresh as a side effect of
// importing this module. main() never rejects: it turns a failure into the
// exit code and log line itself, which is the one thing this file exists to
// get right.
export const main = async () => {
    const startedAt = Date.now();
    console.log(`[kegg-refresh] starting at ${new Date().toISOString()}`);

    try {
        await new KeggFetcher().fetchFiles();

        const seconds = ((Date.now() - startedAt) / 1000).toFixed(1);
        console.log(`[kegg-refresh] completed in ${seconds}s`);
    } catch (error: unknown) {
        console.error('[kegg-refresh] FAILED:', error instanceof Error ? error.message : error);
        process.exitCode = 1;
    }
};

// require.main === module is only true for the file node was launched with -
// i.e. `node build/cronjobs/refresh.js`, which is exactly how both
// `npm run refresh-data` and the systemd unit in deploy/ run this. Importing
// the module (as a test does) never sets require.main to it.
if (require.main === module) {
    main();
}
