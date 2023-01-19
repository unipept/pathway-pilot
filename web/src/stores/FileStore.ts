import { defineStore } from "pinia";
import {computed, ref} from "vue";
import TSVParser from "@/logic/parser/TSVParser";

const useFileStore = defineStore('fileStore', () => {
    const uploadedFile = ref<any>(undefined);
    const parsedFile = ref<any>(undefined);

    const upload = (file: any) => {
        uploadedFile.value = file;
    }

    const clear = () => {
        uploadedFile.value = undefined;
    }

    const parse = async () => {
        if (!uploadedFile.value) {
            return undefined;
        }

        const reader = new FileReader();

        const readFile = new Promise<string>((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result as string);
            }

            reader.onerror = () => {
                reject(reader.error);
            }

            reader.readAsText(uploadedFile.value, "UTF-8");
        });

        const tsvParser = new TSVParser();
        parsedFile.value = tsvParser.parse(await readFile);
    }

    return {
        uploadedFile,
        parsedFile,
        upload,
        clear,
        parse
    };
});

export default useFileStore;
