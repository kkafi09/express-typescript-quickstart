"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = __importDefault(require("../controllers/user.controller"));
const jwt_auth_1 = __importDefault(require("../middlewares/jwt-auth"));
const permission_1 = __importDefault(require("../middlewares/permission"));
const router = express_1.default.Router();
router.get('/', [jwt_auth_1.default.verifyToken, permission_1.default], user_controller_1.default.getAllUsers);
router.get('/:userId', [jwt_auth_1.default.verifyToken, permission_1.default], user_controller_1.default.getUserById);
router.post('/login', user_controller_1.default.login);
router.post('/register', user_controller_1.default.register);
router.get('/whoAmI', jwt_auth_1.default.verifyToken, user_controller_1.default.whoAmI);
router.post('/', user_controller_1.default.createUser);
router.put('/:userId', user_controller_1.default.updateUser);
router.delete('/:userId', user_controller_1.default.deleteUser);
exports.default = router;
//# sourceMappingURL=user.js.map