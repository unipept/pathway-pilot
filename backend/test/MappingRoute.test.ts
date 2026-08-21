import { afterEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';

// Round one only drove /mapping/ec and /mapping/ec/:id through http.test.ts.
// This walks the other four entity families -- ko, pathway, reaction,
// compound -- through the same routes, each with a known id (200 + a body
// assertion) and an unknown one (404 + the specific NotFoundError message).
// app.ts never calls listen, so this exercises the real router chain without
// opening a port -- same as http.test.ts.
import app from '../src/app';

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
