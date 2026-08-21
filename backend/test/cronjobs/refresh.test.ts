import { afterEach, describe, expect, it, vi } from 'vitest';

// KeggFetcher is mocked so fetchFiles() never runs a real refresh - no
// network, no filesystem writes. The mock class's fetchFiles is a vi.fn()
// so each test controls whether it resolves or rejects.
//
// vi.mock is hoisted above the imports (and above ordinary const
// declarations) below, so fetchFiles has to be built inside vi.hoisted -
// same reason KeggFetcher.test.ts does this for its own mock state.
const { fetchFiles } = vi.hoisted(() => ({ fetchFiles: vi.fn() }));

vi.mock('../../src/cronjobs/KeggFetcher', () => ({
    default: class {
        fetchFiles = fetchFiles;
    },
}));

import { main } from '../../src/cronjobs/refresh';

describe('refresh entrypoint', () => {
    afterEach(() => {
        // main() only sets process.exitCode, it never calls process.exit(),
        // so a failing-path test leaves exitCode at 1 for the rest of the
        // vitest process unless it is reset here - the whole run would then
        // report a non-zero exit despite every test being green.
        process.exitCode = 0;
        vi.restoreAllMocks();
        fetchFiles.mockReset();
    });

    it('does not call fetchFiles just by being imported', () => {
        // Regression guard for the fix itself: on the unfixed code, module
        // load ran main() unconditionally, so this failed as soon as the
        // import above executed - before this assertion was even reached.
        expect(fetchFiles).not.toHaveBeenCalled();
    });

    it('sets a non-zero exit code when fetchFiles() fails', async () => {
        fetchFiles.mockRejectedValueOnce(new Error('network down'));
        vi.spyOn(console, 'log').mockImplementation(() => {});
        vi.spyOn(console, 'error').mockImplementation(() => {});

        await main();

        expect(process.exitCode).toBe(1);
    });

    it('logs [kegg-refresh] FAILED: with the error message when fetchFiles() fails', async () => {
        fetchFiles.mockRejectedValueOnce(new Error('network down'));
        vi.spyOn(console, 'log').mockImplementation(() => {});
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        await main();

        expect(errorSpy).toHaveBeenCalledWith('[kegg-refresh] FAILED:', 'network down');
    });

    it('leaves the exit code at zero and logs completion on success', async () => {
        // Set explicitly rather than relying on the default (or on a prior
        // test's afterEach) so this assertion means "main() did not touch
        // it", not "nothing touched it yet".
        process.exitCode = 0;
        fetchFiles.mockResolvedValueOnce(undefined);
        const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        await main();

        expect(process.exitCode).toBe(0);
        expect(logSpy).toHaveBeenCalledWith(expect.stringMatching(/^\[kegg-refresh\] completed in \d+(\.\d+)?s$/));
    });
});
