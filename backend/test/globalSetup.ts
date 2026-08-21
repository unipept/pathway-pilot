import { execFileSync } from 'child_process';
import path from 'path';

// Generates backend/.fixture/ before the suite runs (and removes it again
// after) by shelling out to the same script `npm run fixture` uses. This is
// what keeps `npm test` a single offline command: no real KEGG data ever
// needs to be fetched or committed for the parsing-layer tests to run.
const backendDir = path.join(__dirname, '..');

export async function setup() {
    execFileSync('bash', ['scripts/make-test-fixture.sh'], { cwd: backendDir, stdio: 'inherit' });
}

export async function teardown() {
    execFileSync('bash', ['scripts/make-test-fixture.sh', '--clean'], { cwd: backendDir, stdio: 'inherit' });
}
