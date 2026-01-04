import { ISkill } from "./skill.interface";
export declare const SkillService: {
    createSkill: (payload: ISkill) => Promise<import("mongoose").Document<unknown, {}, ISkill, {}, import("mongoose").DefaultSchemaOptions> & ISkill & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    getAllSkills: (query: Record<string, any>) => Promise<{
        skills: (ISkill & Required<{
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
    getSkillById: (id: string) => Promise<import("mongoose").Document<unknown, {}, ISkill, {}, import("mongoose").DefaultSchemaOptions> & ISkill & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    updateSkill: (id: string, payload: Partial<ISkill>) => Promise<import("mongoose").Document<unknown, {}, ISkill, {}, import("mongoose").DefaultSchemaOptions> & ISkill & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
    deleteSkill: (id: string) => Promise<import("mongoose").Document<unknown, {}, ISkill, {}, import("mongoose").DefaultSchemaOptions> & ISkill & Required<{
        _id: string;
    }> & {
        __v: number;
    }>;
};
//# sourceMappingURL=skill.service.d.ts.map