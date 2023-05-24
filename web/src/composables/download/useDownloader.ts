export function useDownloader() {
    const download = (url: string, filename: string) => {
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", filename);
        link.click();
    };

    return {
        download
    };
};
