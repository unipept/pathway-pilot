import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

// Walks all five entity families -- ec, ko, pathway, reaction, compound --
// through their /mapping/<family>/:id and /mapping/<family> routes, each with
// a known id (200 + a body assertion) and an unknown one (404 + the specific
// NotFoundError message). app.ts never calls listen, so this exercises the
// real router chain without opening a port.
//
// The unknown-EC-id case also drives two more assertions that belong to
// ErrorHandler's rendering contract rather than to this route -- that a 404
// logs no stack, and that an unexpected error still answers 500 with the
// generic body and logs one. Those live in ../middleware/ErrorHandler.test.ts instead of
// here.
import app from '../../src/app';

describe('GET /mapping/ec/:ecNumber', () => {
    it('returns the mapping the fixture yields for a known EC number', async () => {
        const res = await request(app).get('/mapping/ec/1.1.1.1');

        expect(res.status).toBe(200);
        // Asserted as a whole object rather than by substring: the `backend ·
        // boots` job can only grep the response text, so it would pass with
        // the right values in the wrong fields. Here we can do better.
        expect(res.body).toEqual({
            names: ['alcohol dehydrogenase', 'aldehyde reductase', 'ADH'],
            pathways: [{ id: 'map00010', name: 'Glycolysis / Gluconeogenesis' }],
            modules: [],
            koNumbers: ['K00001'],
            reactionIds: ['R00623']
        });
    });

    describe('for an unknown EC number', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('answers 404 with the specific message', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});

            const res = await request(app).get('/mapping/ec/9.9.9.9');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'EC number not found' });
        });
    });
});

describe('GET /mapping/ec', () => {
    it('returns an object keyed by EC number', async () => {
        const res = await request(app).get('/mapping/ec');

        expect(res.status).toBe(200);
        expect(res.body['1.1.1.1']).toBeDefined();
        expect(res.body['1.1.1.1'].names).toContain('alcohol dehydrogenase');
    });
});

describe('GET /mapping/ko/:koNumber', () => {
    it('returns the mapping the fixture yields for a known KO number', async () => {
        const res = await request(app).get('/mapping/ko/K00001');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            names: ['alcohol dehydrogenase'],
            pathways: [{ id: 'map00010', name: 'Glycolysis / Gluconeogenesis' }],
            modules: [],
            ecNumbers: ['1.1.1.1'],
            reactionIds: ['R00623'],
        });
    });

    describe('for an unknown KO number', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('answers 404 with the specific message', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});

            const res = await request(app).get('/mapping/ko/K99999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'KO number not found' });
        });
    });
});

describe('GET /mapping/ko', () => {
    it('returns an object keyed by KO number', async () => {
        const res = await request(app).get('/mapping/ko');

        expect(res.status).toBe(200);
        expect(res.body['K00844']).toBeDefined();
        expect(res.body['K00844'].names).toEqual(['hexokinase']);
    });
});

describe('GET /mapping/pathway/:pathwayId', () => {
    it('returns the mapping the fixture yields for a known pathway id', async () => {
        const res = await request(app).get('/mapping/pathway/map00010');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            name: 'Glycolysis / Gluconeogenesis',
            category: 'Metabolism',
            subCategory: 'Carbohydrate metabolism',
            ecNumbers: ['1.1.1.1', '2.7.1.1'],
            koNumbers: ['K00001'],
            reactionIds: ['R00623'],
            compoundIds: ['C00022'],
        });
    });

    describe('for an unknown pathway id', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('answers 404 with the specific message', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});

            const res = await request(app).get('/mapping/pathway/map99999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Pathway not found' });
        });
    });
});

describe('GET /mapping/pathway', () => {
    it('returns an object keyed by pathway id', async () => {
        const res = await request(app).get('/mapping/pathway');

        expect(res.status).toBe(200);
        expect(res.body['map01100']).toBeDefined();
        expect(res.body['map01100'].name).toBe('Metabolic pathways');
    });
});

describe('GET /mapping/reaction/:reactionId', () => {
    it('returns the mapping the fixture yields for a known reaction id', async () => {
        const res = await request(app).get('/mapping/reaction/R00623');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            names: ['alcohol dehydrogenase reaction', 'aldehyde reductase reaction'],
            pathways: [{ id: 'map00010', name: 'Glycolysis / Gluconeogenesis' }],
            modules: [],
            ecNumbers: ['1.1.1.1'],
        });
    });

    describe('for an unknown reaction id', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('answers 404 with the specific message', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});

            const res = await request(app).get('/mapping/reaction/R99999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Reaction id not found' });
        });
    });
});

describe('GET /mapping/reaction', () => {
    it('returns an object keyed by reaction id', async () => {
        const res = await request(app).get('/mapping/reaction');

        expect(res.status).toBe(200);
        expect(res.body['R00299']).toBeDefined();
        expect(res.body['R00299'].names).toEqual(['hexokinase reaction']);
    });
});

describe('GET /mapping/compound/:compoundId', () => {
    it('returns the mapping the fixture yields for a known compound id', async () => {
        const res = await request(app).get('/mapping/compound/C00001');

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            names: ['H2O', 'Water'],
            pathways: [],
            modules: [],
            ecNumbers: ['1.1.1.1'],
            reactionIds: ['R00623'],
        });
    });

    describe('for an unknown compound id', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('answers 404 with the specific message', async () => {
            vi.spyOn(console, 'warn').mockImplementation(() => {});

            const res = await request(app).get('/mapping/compound/C99999');

            expect(res.status).toBe(404);
            expect(res.body).toEqual({ error: 'Compound id not found' });
        });
    });
});

describe('GET /mapping/compound', () => {
    it('returns an object keyed by compound id', async () => {
        const res = await request(app).get('/mapping/compound');

        expect(res.status).toBe(200);
        expect(res.body['C00022']).toBeDefined();
        expect(res.body['C00022'].names).toEqual(['Pyruvate']);
    });
});
