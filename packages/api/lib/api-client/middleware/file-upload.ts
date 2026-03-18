import { RequestMiddleware, Variables } from 'graphql-request/build/esm/types';

/**
 * Creates a request middleware that automatically handles file uploads
 * by converting requests to multipart/form-data when files are detected in variables.
 *
 * This middleware intercepts the request before it's sent, checks for File/Blob objects
 * in the variables, and if found, converts the request body to FormData following
 * the GraphQL multipart request specification.
 *
 * @param existingMiddleware - Optional existing middleware to chain with
 * @returns A RequestMiddleware function that handles file uploads
 */
export const createFileUploadMiddleware = (existingMiddleware?: RequestMiddleware): RequestMiddleware => {
  return async (request) => {
    const processedRequest = existingMiddleware ? await existingMiddleware(request) : request;

    const { variables, body } = processedRequest;

    if (!variables || !hasFiles(variables)) {
      return processedRequest;
    }

    if(typeof body !== 'string') {
      return processedRequest;
    }

    let query: string;
    try {
      const parsed = JSON.parse(body);
      query = parsed.query;
    } catch {
      // If we can't parse the body, return the request as-is
      return processedRequest;
    }

    const { cleanedVariables, files } = extractFiles(variables);
    const formData = createMultipartFormData(query, cleanedVariables, files);

    const headers = { ...(processedRequest.headers as Record<string, string>) };
    for (const key of Object.keys(headers)) {
      if (key.toLowerCase() === 'content-type') {
        delete headers[key];
      }
    }

    return {
      ...processedRequest,
      body: formData,
      headers,
    };
  };
};

interface FileEntry {
  path: string;
  file: File | Blob;
}

/**
 * Checks if a value is a File or Blob
 */
const isFile = (value: unknown): value is File | Blob => {
  return (typeof File !== 'undefined' && value instanceof File) || (typeof Blob !== 'undefined' && value instanceof Blob);
};

/**
 * Checks if variables contain any File or Blob objects
 */
const hasFiles = (variables: Variables | undefined): boolean => {
  if (!variables) {
    return false;
  }

  const check = (value: unknown): boolean => {
    if (isFile(value)) {
      return true;
    }
    if (Array.isArray(value)) {
      return value.some(check);
    }
    if (value !== null && typeof value === 'object') {
      return Object.values(value).some(check);
    }
    return false;
  };

  return check(variables);
}

/**
 * Recursively extracts files from variables and returns the cleaned variables
 * along with file mappings for the multipart request spec.
 *
 * @param variables - The original variables object
 * @param path - Current path in the object (for building variable paths)
 * @returns Object with cleaned variables (files replaced with null) and file mappings
 */
const extractFiles = (
  variables: Variables,
  path = 'variables'
): { cleanedVariables: Variables; files: FileEntry[] } => {
  const files: FileEntry[] = [];

  const processValue = (value: unknown, currentPath: string): unknown => {
    if (isFile(value)) {
      files.push({ path: currentPath, file: value });
      return null; // Replace file with null per the GraphQL multipart request specification
    }

    if (Array.isArray(value)) {
      return value.map((item, index) => processValue(item, `${currentPath}.${index}`));
    }

    if (value === null || typeof value !== 'object') {
      return value;
    }

    const result: Record<string, unknown> = {};
      for (const [key, val] of Object.entries(value)) {
        result[key] = processValue(val, `${currentPath}.${key}`);
      }
      return result;
  };

  const cleanedVariables = processValue(variables, path) as Variables;
  return { cleanedVariables, files };
}

/**
 * Creates a FormData object for GraphQL multipart file upload requests
 * following the GraphQL multipart request specification.
 */
const createMultipartFormData = (query: string, variables: Variables, files: FileEntry[]): FormData => {
  const formData = new FormData();

  formData.append('query', query);
  formData.append('variables', JSON.stringify(variables));

  const map: Record<string, string[]> = {};
  for (const [index, entry] of Object.entries(files)) {
    map[String(index)] = [entry.path];
  }
  
  formData.append('map', JSON.stringify(map));


  for (const [index, entry] of Object.entries(files)) {
    formData.append(String(index), entry.file);
  }

  return formData;
}

