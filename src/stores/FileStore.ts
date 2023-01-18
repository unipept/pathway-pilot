import { defineStore } from "pinia";
import { ref } from "vue";

const useFileStore = defineStore('fileStore', () => {
    const uploadedFile = ref<any>(undefined);

    const upload = (file: any) => {
        uploadedFile.value = file;
    }

    return {
        uploadedFile,

        upload
    };
});

export default useFileStore;
