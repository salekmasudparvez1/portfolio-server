import { ZodError, ZodIssue } from 'zod';
import { TErrorSources, TGenericErrorResponse } from '../interface/error';

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    const lastPathSegment = issue.path[issue.path.length - 1];
    const normalizedPath =
      typeof lastPathSegment === 'string' || typeof lastPathSegment === 'number'
        ? lastPathSegment
        : '';
    return {
      // Ensure path is always string | number for our error contract
      path: normalizedPath,
      message: issue.message,
    };
  });

  const statusCode = 400;

  return {
    statusCode,
    message: 'Validation Error',
    errorSources,
  };
};

export default handleZodError;
