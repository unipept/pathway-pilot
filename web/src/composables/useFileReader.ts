export function useFileReader() {
    const reader = new FileReader();

    const readTextFile = (file: File) => {
        return new Promise<string>((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result as string);
            }

            reader.onerror = () => {
                reject(reader.error);
            }

            reader.readAsText(file, "UTF-8");
        });
    }

    return {
        readTextFile
    };
};
