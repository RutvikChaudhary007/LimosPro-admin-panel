export const jsonToFormData = (
  data: any,
  options?: {
    fileKeyMode?: "legacy" | "path";
  },
  formData: FormData = new FormData(),
) => {
  const fileKeyMode = options?.fileKeyMode ?? "legacy";
  const files: Array<{ file: File; path: string }> = [];

  const traverseAndExtract = (obj: any, path = ""): any => {
    if (!obj) return obj;

    if (obj instanceof File) {
      files.push({ file: obj, path });
      return null; // Replace File with null in JSON
    }

    if (Array.isArray(obj)) {
      return obj.map((item, index) =>
        traverseAndExtract(item, path ? `${path}.${index}` : String(index)),
      );
    }

    if (typeof obj === "object") {
      const newObj: any = {};
      Object.keys(obj).forEach((key) => {
        const nextPath = path ? `${path}.${key}` : key;
        newObj[key] = traverseAndExtract(obj[key], nextPath);
      });
      return newObj;
    }

    return obj;
  };

  const cleanContent = traverseAndExtract(data);

  files.forEach(({ file, path }) => {
    const fieldName = fileKeyMode === "path" && path ? path : "files";
    formData.append(fieldName, file);
  });

  Object.keys(cleanContent).forEach((key) => {
    const value = cleanContent[key];
    if (value && typeof value === "object") {
      formData.append(key, JSON.stringify(value));
    } else if (value !== undefined) {
      formData.append(key, String(value));
    }
  });

  return formData;
};
