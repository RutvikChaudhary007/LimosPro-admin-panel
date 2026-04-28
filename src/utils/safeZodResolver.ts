import { zodResolver } from "@hookform/resolvers/zod";
import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";

type ZodIssueLike = {
  path?: readonly PropertyKey[];
  message: string;
  code?: string;
};

function isZodErrorLike(err: unknown): err is { issues: ZodIssueLike[] } {
  if (!err || typeof err !== "object") return false;
  const anyErr = err as any;
  return (
    (anyErr.name === "ZodError" || anyErr.constructor?.name === "ZodError") &&
    Array.isArray(anyErr.issues)
  );
}

function setNestedError(
  target: Record<string, any>,
  path: readonly PropertyKey[],
  error: { type: string; message: string },
) {
  let cur: Record<string, any> = target;
  for (let i = 0; i < path.length; i++) {
    const key = String(path[i]);
    const isLeaf = i === path.length - 1;
    if (isLeaf) {
      cur[key] = error;
    } else {
      cur[key] ??= {};
      cur = cur[key];
    }
  }
}

/**
 * Wraps `zodResolver` but guarantees it never throws a ZodError.
 * This prevents `Uncaught (in promise) ZodError` and keeps errors inside RHF.
 */
export function safeZodResolver<TValues extends FieldValues = FieldValues>(
  schema: unknown,
  schemaOptions?: Parameters<typeof zodResolver>[1],
  resolverOptions?: Parameters<typeof zodResolver>[2],
): Resolver<TValues> {
  const base = zodResolver(
    schema as any,
    schemaOptions as any,
    resolverOptions as any,
  ) as unknown as Resolver<TValues>;

  const safe: Resolver<TValues> = async (values, context, options) => {
    try {
      return await base(values, context, options);
    } catch (err) {
      if (isZodErrorLike(err)) {
        const errors: FieldErrors<TValues> = {};
        for (const issue of err.issues) {
          if (!issue?.path?.length) continue;
          setNestedError(errors as any, issue.path, {
            type: issue.code ?? "custom",
            message: issue.message,
          });
        }
        return { values: {}, errors };
      }
      throw err;
    }
  };

  return safe;
}
