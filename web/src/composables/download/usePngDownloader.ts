import { toPng } from 'html-to-image';
import { useDownloader } from "./useDownloader";

export function usePngDownloader() {
    const { download } = useDownloader();

    const downloadPng = async (image: HTMLElement, filename: string, pixelRatio: number = 2) => {
        const url = await toPng(image, { pixelRatio: pixelRatio });

        download(url, filename);
    };

    return {
        downloadPng
    };
};
