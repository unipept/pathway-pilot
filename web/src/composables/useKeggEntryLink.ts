export function useKeggEntryLink() {
    const baseUrl = `https://www.genome.jp/entry/`;

    const url = (entryId: string) => {
        if (!entryId) {
            return '';
        }
        
        return `${baseUrl}${entryId}`;
    }

    return { url };
};
