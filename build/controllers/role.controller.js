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
const client_1 = require("@prisma/client");
const wrapper_1 = __importDefault(require("../helpers/wrapper"));
const prisma = new client_1.PrismaClient();
const createRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, key } = req.body;
    try {
        const role = yield prisma.role.create({
            data: {
                name,
                key
            }
        });
        const result = wrapper_1.default.data(role);
        return wrapper_1.default.response(res, 'success', result, 'Role created successfully', 201);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to create role', 500);
    }
});
const updateRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = parseInt(req.params.id);
    const { name, key } = req.body;
    try {
        const role = yield prisma.role.update({
            where: { id: roleId },
            data: {
                name,
                key
            }
        });
        const result = wrapper_1.default.data(role);
        return wrapper_1.default.response(res, 'success', result, 'Role updated successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to update role', 500);
    }
});
const deleteRole = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = parseInt(req.params.id);
    try {
        yield prisma.role.delete({
            where: { id: roleId }
        });
        return wrapper_1.default.response(res, 'success', null, 'Role deleted successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to delete role', 500);
    }
});
const getRoleById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const roleId = parseInt(req.params.id);
    try {
        const role = yield prisma.role.findUnique({
            where: { id: roleId }
        });
        const result = wrapper_1.default.data(role);
        return wrapper_1.default.response(res, 'success', result, 'Role retrieved successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to retrieve role', 500);
    }
});
const getAllRoles = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const roles = yield prisma.role.findMany();
        const result = wrapper_1.default.data(roles);
        return wrapper_1.default.response(res, 'success', result, 'Roles retrieved successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to retrieve roles', 500);
    }
});
exports.default = { createRole, updateRole, deleteRole, getRoleById, getAllRoles };
//# sourceMappingURL=role.controller.js.map