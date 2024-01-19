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
const wrapper_1 = __importDefault(require("../helpers/wrapper"));
const authGuard = (permission) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const userRoles = req.user || [];
        const hasPermission = userRoles.roles.some((userRole) => {
            return userRole.permissions.some((p) => p.key === permission);
        });
        if (!hasPermission) {
            return wrapper_1.default.response(res, 'fail', null, 'Forbidden access', 403);
        }
    });
};
exports.default = authGuard;
//# sourceMappingURL=permission.js.map