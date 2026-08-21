import { describe, expect, it } from 'vitest';

// CategoryMap.ts is a hardcoded Map literal, not built from the fixture, so
// no globalSetup dependency here. It backs PathwayMap's category/subCategory
// join (see PathwayMap.test.ts), asserted directly here since it is its own
// module.
import categoryMap from '../src/mappings/pathway/CategoryMap';

describe('CategoryMap', () => {
    it('maps a pathway id to its [category, subCategory] pair', () => {
        expect(categoryMap.get('map00010')).toEqual(['Metabolism', 'Carbohydrate metabolism']);
    });

    it('returns undefined for an unknown pathway id', () => {
        expect(categoryMap.get('map99999')).toBeUndefined();
    });
});
