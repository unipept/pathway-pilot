export default interface Converter {
    isPeptide(): boolean;
    convert(input: string[]): Promise<any[]>;
};
