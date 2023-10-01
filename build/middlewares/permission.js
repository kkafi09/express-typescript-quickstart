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
Object.defineProperty(exports, "__esModule", { value: true });
const route_permission_1 = __importDefault(require("../config/route.permission"));
const wrapper_1 = __importDefault(require("../helpers/wrapper"));
const permissionMiddleware = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const route = req.originalUrl;
    const method = req.method;
    const config = (_a = route_permission_1.default[route]) === null || _a === void 0 ? void 0 : _a[method];
    if (!config) {
        return next();
    }
    const userRoles = req.user || [];
    const hasPermission = userRoles.roles.some((userRole) => {
        return userRole.permissions.some((permission) => permission.key === config.permission);
    });
    if (!hasPermission ||
        !config.requiredRoles.some((requiredRoleKey) => userRoles.roles.some((userRole) => userRole.key === requiredRoleKey))) {
        return wrapper_1.default.response(res, 'fail', null, 'Not allowed', 403);
    }
    next();
});
exports.default = permissionMiddleware;
//# sourceMappingURL=permission.js.map