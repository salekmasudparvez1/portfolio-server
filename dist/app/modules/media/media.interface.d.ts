export interface IMedia {
    _id: string;
    public_id: string;
    folder: string;
    filename: string;
    format?: string;
    version?: number;
    url: string;
    secure_url: string;
    width?: number;
    height?: number;
    bytes?: number;
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=media.interface.d.ts.map