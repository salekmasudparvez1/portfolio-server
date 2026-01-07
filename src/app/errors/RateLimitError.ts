import { TErrorSources, TGenericErrorResponse } from "../interface/error";


const handleRateLimitError = (): TGenericErrorResponse => {
  const errorSources: TErrorSources = [
    {
      path: 'rate_limit',
      message: 'Too many requests from this IP, please try again later.',
    },
  ];

  const statusCode = 429;

  return {
    statusCode,
    message: 'Rate limit exceeded',
    errorSources,
  };
};

export default handleRateLimitError;