'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'));
const jwt_secret = 'secret';
const generateToken = (userId) => {
  const token = jsonwebtoken_1.default.sign({ userId }, jwt_secret, { expiresIn: '3h' });
  return token;
};
const verifyToken = (req, res, next) => {
  var _a;
  try {
    const token = (_a = req.header('Authorization')) === null || _a === void 0 ? void 0 : _a.replace('Bearer ', '');
    if (!token) {
      throw new Error();
    }
    const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
    req.userId = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Please Authenticate' });
  }
};
module.exports = { generateToken, verifyToken };
//# sourceMappingURL=jwtAuth.js.map
