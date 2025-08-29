export default function isFieldDisabled<T extends object>(
  disabledFields: (keyof T)[] | undefined,
  fieldName: keyof T 
): boolean {
  return disabledFields?.includes(fieldName) ?? false;
}