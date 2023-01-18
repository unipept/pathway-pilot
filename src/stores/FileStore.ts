import { defineStore } from "pinia";
import { ref } from "vue";

const useFileStore = defineStore('fileStore', () => {
    const uploadedFile = ref<any>(undefined);

    const upload = (file: any) => {
        uploadedFile.value = file;
    }

    const clear = () => {
        uploadedFile.value = undefined;
    }

    return {
        uploadedFile,

        upload,
        clear
    };
});

export default useFileStore;
