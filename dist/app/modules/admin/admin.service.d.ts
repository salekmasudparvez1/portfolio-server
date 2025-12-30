export declare const adminService: {
    getAllUsersFunc: (req: any) => Promise<{
        data: (import("mongoose").Document<unknown, {}, import("../auth/auth.interface").IUserCreate, {}, import("mongoose").DefaultSchemaOptions> & import("../auth/auth.interface").IUserCreate & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        meta: {
            page: number;
            limit: number;
            total: number;
        };
    }>;
    deleteUserFunc: (userId: string) => Promise<(import("mongoose").Document<unknown, {}, import("../auth/auth.interface").IUserCreate, {}, import("mongoose").DefaultSchemaOptions> & import("../auth/auth.interface").IUserCreate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
    updateRoleFunc: (userId: string, role: string) => Promise<(import("mongoose").Document<unknown, {}, import("../auth/auth.interface").IUserCreate, {}, import("mongoose").DefaultSchemaOptions> & import("../auth/auth.interface").IUserCreate & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }) | null>;
};
//# sourceMappingURL=admin.service.d.ts.map