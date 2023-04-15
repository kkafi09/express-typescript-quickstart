'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const body_parser_1 = __importDefault(require('body-parser'));
const cors_1 = __importDefault(require('cors'));
const express_1 = __importDefault(require('express'));
const morgan_1 = __importDefault(require('morgan'));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('combined'));
app.get('/', (_req, res) => {
  return res.status(200).json({ message: 'This service is running properly.' });
});
app.listen(port, () => {
  return console.log(`Server is listening on ${port}`);
});
//# sourceMappingURL=index.js.map
