import { describe, expect, it } from 'vitest';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { missingEnvVars, REQUIRED_ENV_VARS } from '../src/config/config';

// Parsing .env.example instead of hand-writing all ~27 names keeps this test
// honest about what "complete" means, and lets the same env double as an
// assertion (see below) that .env.example actually documents every required
// variable.
const completeEnv = dotenv.parse(fs.readFileSync(path.join(__dirname, '../.env.example')));

describe('missingEnvVars', () => {
    it('returns an empty array for a complete environment, so .env.example documents every required variable', () => {
        // Doubles as a drift check: because the "complete" environment is
        // .env.example itself, this fails if someone adds a name to
        // REQUIRED_ENV_VARS and forgets to document it there.
        expect(missingEnvVars(completeEnv)).toEqual([]);
    });

    it('returns a single missing variable by name', () => {
        const env = { ...completeEnv };
        delete env.PORT;

        expect(missingEnvVars(env)).toEqual(['PORT']);
    });

    it('returns several missing variables, in REQUIRED_ENV_VARS order', () => {
        const env = { ...completeEnv };
        delete env.PATHWAY_DATA_FILE;
        delete env.PORT;
        delete env.KO_DATA_FILE;

        expect(missingEnvVars(env)).toEqual(['PORT', 'KO_DATA_FILE', 'PATHWAY_DATA_FILE']);
    });

    it('treats a variable set to the empty string as missing', () => {
        // This is what `!env[name]` does: '' is falsy, so an explicitly
        // empty value is indistinguishable from an absent one.
        const env = { ...completeEnv, PORT: '' };

        expect(missingEnvVars(env)).toEqual(['PORT']);
    });

    it('returns every required name for an empty env', () => {
        expect(missingEnvVars({})).toEqual(REQUIRED_ENV_VARS);
    });
});
