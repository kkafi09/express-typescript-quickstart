"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./app"));
const logger_1 = __importDefault(require("./helpers/logger"));
dotenv_1.default.config();
const port = process.env.PORT || 8080;
app_1.default.listen(port, () => {
    const ctx = 'app-listen';
    logger_1.default.log(ctx, `This service is running properly on port ${port}`, 'initiate application');
});
//# sourceMappingURL=index.js.map