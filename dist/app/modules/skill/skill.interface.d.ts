export interface ISkillItem {
    skill: string;
    color: string;
}
export type SkillType = "backend" | "frontend";
export interface ISkill {
    _id: string;
    name: string;
    description: string;
    type: SkillType;
    skills: ISkillItem[];
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=skill.interface.d.ts.map