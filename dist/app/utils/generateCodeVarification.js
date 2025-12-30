"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generateCodeVarification = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 minutes
    return {
        code,
        expires,
    };
};
exports.default = generateCodeVarification;
//# sourceMappingURL=generateCodeVarification.js.map