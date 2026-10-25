import * as z from "zod";


export const AtricleValidationSchema = z.object({
  title: z
    .string()
    .min(3, { message: "العنوان يجب أن يكون 3 حروف على الأقل" }),
    
  description: z
    .string()
    .min(10, { message: "الوصف يجب أن يكون 10 حروف على الأقل" }),
});

export const registerSchema = z.object({
  username: z
    .string()
    .min(1, 'اسم المستخدم مطلوب')
    .min(3, 'يجب أن لا يقل اسم المستخدم عن 3 أحرف')
    .max(30, 'يجب أن لا يزيد اسم المستخدم عن 30 حرفاً')
    .trim(),

  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(8, 'يجب أن لا تقل كلمة المرور عن 8 أحرف')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'يجب أن تحتوي كلمة المرور على حرف كبير، حرف صغير، ورقم على الأقل'
    ),
});

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(8, 'يجب أن لا تقل كلمة المرور عن 8 أحرف')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'يجب أن تحتوي كلمة المرور على حرف كبير، حرف صغير، ورقم على الأقل'
    ),
});

export const updateUserSchema = z.object({
  username: z
    .string()
    .min(1, 'اسم المستخدم مطلوب')
    .min(3, 'يجب أن لا يقل اسم المستخدم عن 3 أحرف')
    .max(30, 'يجب أن لا يزيد اسم المستخدم عن 30 حرفاً')
    .trim()
    .optional()
    ,

  email: z
    .string()
    .min(1, 'البريد الإلكتروني مطلوب')
    .email('صيغة البريد الإلكتروني غير صحيحة')
    .toLowerCase()
    .trim(),

  password: z
    .string()
    .min(1, 'كلمة المرور مطلوبة')
    .min(8, 'يجب أن لا تقل كلمة المرور عن 8 أحرف')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'يجب أن تحتوي كلمة المرور على حرف كبير، حرف صغير، ورقم على الأقل'
    ),
});