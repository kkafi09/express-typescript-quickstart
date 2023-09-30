"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const wrapper_1 = __importDefault(require("../helpers/wrapper"));
dotenv_1.default.config();
const jwt_secret = (_a = process.env.JWT_SECRET) !== null && _a !== void 0 ? _a : 'secret';
const prisma = new client_1.PrismaClient();
const generateToken = (userId) => {
    const token = jsonwebtoken_1.default.sign({ userId }, jwt_secret, { expiresIn: '3h' });
    return token;
};
const verifyToken = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let token;
        // Check Authorization header
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.startsWith('Bearer ')) {
            token = authHeader.split(' ')[1];
        }
        // If not found in the header, check the accessToken cookie
        if (!token && req.cookies && req.cookies.accessToken) {
            token = req.cookies.accessToken;
        }
        // If still not found, return unauthorized
        if (!token) {
            return wrapper_1.default.response(res, 'fail', null, 'Unauthorized', 401);
        }
        // Verify the token
        const decoded = jsonwebtoken_1.default.verify(token, jwt_secret);
        req.userId = decoded.userId;
        // Fetch user data using Prisma
        const user = yield prisma.user.findUnique({
            where: {
                id: decoded.userId
            }
        });
        if (!user) {
            return wrapper_1.default.response(res, 'fail', null, 'Please authenticate', 401);
        }
        const roles = yield prisma.roleUser.findMany({
            where: {
                userId: user.id
            },
            include: {
                role: true
            }
        });
        const roleIds = roles.map((role) => role.roleId);
        const permissions = yield prisma.rolePermission.findMany({
            where: {
                roleId: {
                    in: roleIds
                }
            },
            include: {
                permission: true
            }
        });
        const userWithRolesAndPermissions = Object.assign(Object.assign({}, user), { roles: roles.map((role) => {
                const rolePermissions = permissions.filter((rp) => rp.roleId === role.roleId).map((rp) => rp.permission);
                return Object.assign(Object.assign({}, role.role), { permissions: rolePermissions });
            }) });
        req.user = userWithRolesAndPermissions;
        next();
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Unauthorized', 401);
    }
});
exports.default = { generateToken, verifyToken };
//# sourceMappingURL=jwt-auth.js.map