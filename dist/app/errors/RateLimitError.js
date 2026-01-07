"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleRateLimitError = () => {
    const errorSources = [
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
exports.default = handleRateLimitError;
//# sourceMappingURL=RateLimitError.js.map