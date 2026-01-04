import { IMedia } from "./media.interface";
export declare const MediaService: {
    createMedia: (payload: IMedia) => Promise<import("mongoose").Document<unknown, {}, IMedia, {}, import("mongoose").DefaultSchemaOptions> & IMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getAllMedia: (query: Record<string, any>) => Promise<{
        media: (IMedia & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    getMediaById: (id: string) => Promise<import("mongoose").Document<unknown, {}, IMedia, {}, import("mongoose").DefaultSchemaOptions> & IMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getMediaByPublicId: (public_id: string) => Promise<import("mongoose").Document<unknown, {}, IMedia, {}, import("mongoose").DefaultSchemaOptions> & IMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getAllFolders: () => Promise<string[]>;
    getMediaByFolder: (folder: string, query: Record<string, any>) => Promise<{
        media: (IMedia & Required<{
            _id: string;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            totalPages: number;
        };
    }>;
    updateMedia: (id: string, payload: Partial<IMedia>) => Promise<import("mongoose").Document<unknown, {}, IMedia, {}, import("mongoose").DefaultSchemaOptions> & IMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteMedia: (id: string) => Promise<import("mongoose").Document<unknown, {}, IMedia, {}, import("mongoose").DefaultSchemaOptions> & IMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteMediaByPublicId: (public_id: string) => Promise<import("mongoose").Document<unknown, {}, IMedia, {}, import("mongoose").DefaultSchemaOptions> & IMedia & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=media.service.d.ts.map