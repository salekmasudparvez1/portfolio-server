"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleZodError = (err) => {
    const errorSources = err.issues.map((issue) => {
        const lastPathSegment = issue.path[issue.path.length - 1];
        const normalizedPath = typeof lastPathSegment === 'string' || typeof lastPathSegment === 'number'
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
exports.default = handleZodError;
//# sourceMappingURL=handleZodError.js.map