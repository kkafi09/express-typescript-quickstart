"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const logger_1 = __importDefault(require("./helpers/logger"));
const wrapper_1 = __importDefault(require("./helpers/wrapper"));
const user_1 = __importDefault(require("./api/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use('/public', express_1.default.static('public'));
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined'));
app.use((0, cookie_parser_1.default)());
app.use((0, helmet_1.default)());
app.use((err, req, res, next) => {
    logger_1.default.log('error-api', err.message, 'error');
    return wrapper_1.default.response(res, 'fail', null, 'Internal Server Error', 500);
});
app.get('/', (_req, res) => {
    return wrapper_1.default.response(res, 'success', null, 'This service is running properly!');
});
app.use('/user', user_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map