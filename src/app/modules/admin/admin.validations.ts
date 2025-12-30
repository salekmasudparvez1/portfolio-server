import z from "zod";

export const updateRoleValidationSchema = z.object({
  body: z.object({
    role: z.enum(["tenant", "landlord"]),
  }),
});