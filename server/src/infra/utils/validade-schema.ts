import { z, ZodObject } from 'zod';
import { AppError } from '../../app/error/app-error';

export function validateSchema<T extends ZodObject>(
  schema: T,
  value: unknown
): z.infer<T> {
  const validation = schema.safeParse(value);

  if (validation.success === true) return validation.data;

  throw new AppError(
    `${validation.error.issues.map((issue: z.core.$ZodIssue) => issue.message)}`,
    400
  );
}
