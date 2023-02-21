import ReaderMap from "./ReaderMap";

// TODO: Replaces could be done on fetch once a day
// TODO: Then also throw out path:ko or path:ec from the file
// TODO: So much duplicate code, refactor
// TODO: Put file locations in config file

export type ModuleKey = string;

export type ModuleValue = {
    name: string;
};

export class ModuleMap extends ReaderMap<ModuleKey, ModuleValue> {
    constructor(
        descriptionFile: string = '../../data/module',
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ ModuleId, description ] = line.split('\t');

            this.set(ModuleId.replace('md:', ''), { 
                name: description.trim()
            });
        });
    }
}

export default new ModuleMap();
