"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorhandler_1 = __importDefault(require("./app/middlewares/globalErrorhandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const auth_routes_1 = __importDefault(require("./app/modules/auth/auth.routes"));
const admin_routes_1 = __importDefault(require("./app/modules/admin/admin.routes"));
const post_routes_1 = require("./app/modules/post/post.routes");
const app = (0, express_1.default)();
//parsers
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)({ origin: ['http://localhost:3000', 'http://localhost:5000', 'https://api.parvez.dev', 'https://parvez.dev'], credentials: true }));
// application routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/admin', admin_routes_1.default);
app.use('/api/post', post_routes_1.PostRouter);
app.get('/', (req, res) => {
    res.send('Server is running !');
});
app.use(globalErrorhandler_1.default);
//Not Found
app.use(notFound_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map