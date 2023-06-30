export function useFileReader() {
    const readTextFile = (file: File) => {
        const reader = new FileReader();
        
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
