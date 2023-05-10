export function useCsvDownloader() {
    const downloadCsv = (data: string[], filename: string, header: string | undefined = undefined) => {
        const csvHeader = header ? [ header ] : [];

        const csvString = csvHeader.concat(data).join("\n");
        const blob = new Blob([ csvString ], { type: "text/csv;charset=utf-8;" });

        const link = document.createElement("a");
        link.setAttribute("href", URL.createObjectURL(blob));
        link.setAttribute("download", filename);
        link.click();
    };

    return {
        downloadCsv
    };
};
