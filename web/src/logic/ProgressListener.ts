export interface ProgressListener {
    onProgressUpdate(progress: number): void;
}

export const defaultProgressListener: ProgressListener = {
    onProgressUpdate: () => {}
};
