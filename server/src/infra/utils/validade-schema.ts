import { z, ZodObject, ZodIssue } from 'zod';
import { AppError } from '../../app/error/app-error';

export function validateSchema<T extends ZodObject>(
  schema: T,
  value: unknown
): z.infer<T> {
  const validation = schema.safeParse(value);

  if (validation.success === true) return validation.data;
  console.log(validation.error.issues);
  throw new AppError(
    `${validation.error.issues.map((issue: ZodIssue) => issue.message)}`,
    400
  );
}
