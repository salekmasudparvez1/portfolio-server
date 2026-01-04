export interface ISkillItem {
  skill: string; // Skill name (e.g., "React", "Node.js", "TypeScript")
  color: string; // Color code for UI (e.g., "#61DAFB", "#68A063")
}

export type SkillType = "backend" | "frontend";

export interface ISkill {
  _id: string;
  name: string; // Category name (e.g., "Frontend", "Backend", "Tools")
  description: string; // Description of the skill category
  type: SkillType; // Type of skill category (backend or frontend)
  skills: ISkillItem[]; // Array of skills with their colors
  
  createdAt: Date;
  updatedAt: Date;
}
