import * as z from "zod";


export const AtricleValidationSchema = z.object({
  title: z
    .string()
    .min(3, { message: "العنوان يجب أن يكون 3 حروف على الأقل" }),
    
  description: z
    .string()
    .min(10, { message: "الوصف يجب أن يكون 10 حروف على الأقل" }),
});