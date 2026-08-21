import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// src/config/config.ts validates ~27 required env vars at module load and
// calls process.exit(1) if any are missing, so the full env has to be in
// place before any src module is imported. Reading the vars straight out of
// .env.example (rather than hardcoding the list here) mirrors what the
// `backend · boots` CI job does and means a newly required var doesn't
// silently break the suite in a confusing way.
const base = dotenv.parse(fs.readFileSync(path.join(__dirname, '.env.example')));

export default defineConfig({
    test: {
        include: ['test/**/*.test.ts'],
        globalSetup: ['test/globalSetup.ts'],
        env: { ...base, DATA_DIR: '.fixture/', LINK_DIR: '.fixture/link/' },
    },
});
