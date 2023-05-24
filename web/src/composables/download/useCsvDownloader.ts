import { useDownloader } from "./useDownloader";

export function useCsvDownloader() {
    const { download } = useDownloader();

    const downloadCsv = (data: string[], filename: string, header: string | undefined = undefined) => {
        const csvHeader = header ? [ header ] : [];
        const csvString = csvHeader.concat(data).join("\n");
        
        const blob = new Blob([ csvString ], { type: "text/csv;charset=utf-8;" });

        download(URL.createObjectURL(blob), filename);
    };

    return {
        downloadCsv
    };
};
