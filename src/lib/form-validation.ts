import { z } from 'zod';
import { format, isValid, parseISO } from 'date-fns';

export const signupSchema = z.object({
  name: z.string().trim().min(1, 'Enter your full name.').max(120, 'Use 120 characters or fewer.'),
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.').max(254, 'Use 254 characters or fewer.'),
  password: z.string().min(6, 'Use at least 6 characters for your password.'),
});

const dateSchema = z.string().refine((value) => /^\d{4}-\d{2}-\d{2}$/.test(value) && isValid(parseISO(value)), 'Enter a valid date.');
export const pregnancyDatingSchema = z.object({
  lastPeriodDate: z.union([z.literal(''), dateSchema.refine((value) => value <= format(new Date(), 'yyyy-MM-dd'), 'Your last period cannot start in the future.')]),
  gestationalWeeks: z.union([z.literal(''), z.string().refine((value) => /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 42, 'Enter a whole number of weeks from 1 to 42.')]),
}).superRefine((data, ctx) => {
  if (!data.lastPeriodDate && !data.gestationalWeeks) ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['lastPeriodDate'], message: 'Enter your last period date or how many weeks pregnant you are.' });
});

export const doctorDateSchema = z.object({ doctorDueDate: z.union([z.literal(''), dateSchema]) });
export const babyNameSchema = z.object({ babyName: z.string().trim().max(60, 'Use 60 characters or fewer for the nickname.') });
export const pregnancySetupSchema = pregnancyDatingSchema.and(doctorDateSchema).and(babyNameSchema);

export function fieldErrors(error: z.ZodError): Record<string, string> {
  return Object.fromEntries(error.issues.map((issue) => [String(issue.path[0]), issue.message]));
}