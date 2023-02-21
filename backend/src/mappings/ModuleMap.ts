import ReaderMap from "./ReaderMap";
import config from "../config/config";

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
        descriptionFile: string = config.moduleDataFile,
    ) {
        super();

        this.handleDescriptionFile(descriptionFile);
    }

    private handleDescriptionFile(descriptionFile: string) {
        this.readlines(descriptionFile, (line: string) => {
            const [ ModuleId, description ] = line.split('\t');

            this.set(ModuleId, { 
                name: description.trim()
            });
        });
    }
}

export default new ModuleMap();
