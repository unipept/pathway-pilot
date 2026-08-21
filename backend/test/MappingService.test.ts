import { describe, expect, it } from 'vitest';

// Round one only exercised the two EC functions here (findEcMapping,
// findEcMappings). This covers the other eight find* functions -- one
// known id and one unknown id per single-id function, plus a populated-map
// assertion for each collection function -- against the same fixture the
// map-level tests (KoMap.test.ts, ReactionMap.test.ts, etc.) already use.
import NotFoundError from '../src/errors/NotFoundError';
import {
    findPathwayMapping,
    findPathwayMappings,
    findKoMapping,
    findKoMappings,
    findReactionMapping,
    findReactionMappings,
    findCompoundMapping,
    findCompoundMappings,
} from '../src/services/MappingService';

describe('findPathwayMapping', () => {
    it('returns the entry for a known pathway id', async () => {
        const entry = await findPathwayMapping('map00010');

        expect(entry.name).toBe('Glycolysis / Gluconeogenesis');
    });

    it('rejects with NotFoundError for an unknown pathway id', async () => {
        await expect(findPathwayMapping('map99999')).rejects.toThrow(NotFoundError);
        await expect(findPathwayMapping('map99999')).rejects.toMatchObject({ message: 'Pathway not found' });
    });
});

describe('findPathwayMappings', () => {
    it('returns the full pathway map', async () => {
        const mapping = await findPathwayMappings();

        expect(mapping.get('map00010')?.name).toBe('Glycolysis / Gluconeogenesis');
        expect(mapping.get('map01100')?.name).toBe('Metabolic pathways');
    });
});

describe('findKoMapping', () => {
    it('returns the entry for a known KO number', () => {
        const entry = findKoMapping('K00001');

        expect(entry.names).toEqual(['alcohol dehydrogenase']);
    });

    it('throws NotFoundError for an unknown KO number', () => {
        expect(() => findKoMapping('K99999')).toThrow(NotFoundError);
        expect(() => findKoMapping('K99999')).toThrow('KO number not found');
    });
});

describe('findKoMappings', () => {
    it('returns the full KO map', () => {
        const mapping = findKoMappings();

        expect(mapping.get('K00001')?.names).toEqual(['alcohol dehydrogenase']);
        expect(mapping.get('K00844')?.names).toEqual(['hexokinase']);
    });
});

describe('findReactionMapping', () => {
    it('returns the entry for a known reaction id', async () => {
        const entry = await findReactionMapping('R00623');

        expect(entry.names).toEqual(['alcohol dehydrogenase reaction', 'aldehyde reductase reaction']);
    });

    it('rejects with NotFoundError for an unknown reaction id', async () => {
        await expect(findReactionMapping('R99999')).rejects.toThrow(NotFoundError);
        await expect(findReactionMapping('R99999')).rejects.toMatchObject({ message: 'Reaction id not found' });
    });
});

describe('findReactionMappings', () => {
    it('returns the full reaction map', async () => {
        const mapping = await findReactionMappings();

        expect(mapping.get('R00623')?.names).toEqual(['alcohol dehydrogenase reaction', 'aldehyde reductase reaction']);
        expect(mapping.get('R00299')?.names).toEqual(['hexokinase reaction']);
    });
});

describe('findCompoundMapping', () => {
    it('returns the entry for a known compound id', async () => {
        const entry = await findCompoundMapping('C00001');

        expect(entry.names).toEqual(['H2O', 'Water']);
    });

    it('rejects with NotFoundError for an unknown compound id', async () => {
        await expect(findCompoundMapping('C99999')).rejects.toThrow(NotFoundError);
        await expect(findCompoundMapping('C99999')).rejects.toMatchObject({ message: 'Compound id not found' });
    });
});

describe('findCompoundMappings', () => {
    it('returns the full compound map', async () => {
        const mapping = await findCompoundMappings();

        expect(mapping.get('C00001')?.names).toEqual(['H2O', 'Water']);
        expect(mapping.get('C00022')?.names).toEqual(['Pyruvate']);
    });
});
