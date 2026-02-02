export const jsonToFormData = (
  data: any,
  // parentKey?: string,
  formData: FormData = new FormData(),
) => {
  // We need to traverse the object in a deterministic order that matches
  // the backend's traversal to ensure file indices match.
  // The backend uses a recursive traversal on Object.keys().

  // Helper to deep clone and replace Files with placeholders for the JSON body
  // We do NOT use this for traversal for FormData appending, we do them properly.

  // Actually, allow me to define the strategy:
  // 1. Traverse 'data' to find Files.
  // 2. Append Files to FormData in order.
  // 3. Create a clean 'content' object where Files are replaced by null/placeholder.
  // 4. Append 'content' string to FormData.

  const files: File[] = [];

  const traverseAndExtract = (obj: any): any => {
    if (!obj) return obj;

    if (obj instanceof File) {
      files.push(obj);
      return null; // Replace File with null in JSON
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => traverseAndExtract(item));
    }

    if (typeof obj === "object") {
      const newObj: any = {};
      Object.keys(obj).forEach((key) => {
        newObj[key] = traverseAndExtract(obj[key]);
      });
      return newObj;
    }

    return obj;
  };

  const cleanContent = traverseAndExtract(data);

  // Append all files
  files.forEach((file) => {
    // We use a generic name or indexed name. The backend logic 'extractImageUrls'
    // ignores names if we use array, BUT 'extractImageUrls' pushes them
    // in order of appearance in req.files.
    // Multer preserves order.
    formData.append("files", file);
  });

  // Append the cleaned JSON content
  // If 'data' was the whole payload, we might want to split specific fields?
  // HomeForm sends { pageName, content: {...}, seo: {...}, ... }
  // We want to stringify the whole thing?
  // Backend 'createHomePage' expects: pageName, slug, content (stringified or obj), ...
  // If we assume the wrapper calls this helper on the WHOLE form data:

  // We should append each top-level key.
  // Specialized for our Controller:
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
