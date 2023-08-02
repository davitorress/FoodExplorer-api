export declare class DiskStorage {
    saveFile(file: string): Promise<string>;
    deleteFile(file: string): Promise<void>;
}
