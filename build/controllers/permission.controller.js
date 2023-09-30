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
const createPermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, key } = req.body;
    try {
        const permission = yield prisma.permission.create({
            data: {
                name,
                key
            }
        });
        const result = wrapper_1.default.data(permission);
        return wrapper_1.default.response(res, 'success', result, 'Permission created successfully', 201);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to create permission', 500);
    }
});
const updatePermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const permissionId = parseInt(req.params.id);
    const { name, key } = req.body;
    try {
        const permission = yield prisma.permission.update({
            where: { id: permissionId },
            data: {
                name,
                key
            }
        });
        const result = wrapper_1.default.data(permission);
        return wrapper_1.default.response(res, 'success', result, 'Permission updated successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to update permission', 500);
    }
});
const deletePermission = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissionId = parseInt(req.params.id);
        yield prisma.permission.delete({
            where: { id: permissionId }
        });
        return wrapper_1.default.response(res, 'success', null, 'Permission deleted successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to delete permission', 500);
    }
});
const getPermissionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissionId = parseInt(req.params.id);
        const permission = yield prisma.permission.findUnique({
            where: { id: permissionId }
        });
        const result = wrapper_1.default.data(permission);
        return wrapper_1.default.response(res, 'success', result, 'Permission retrieved successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to retrieve permission', 500);
    }
});
const getAllPermissions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const permissions = yield prisma.permission.findMany();
        const result = wrapper_1.default.data(permissions);
        return wrapper_1.default.response(res, 'success', result, 'Permissions retrieved successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to retrieve permissions', 500);
    }
});
exports.default = { createPermission, updatePermission, deletePermission, getPermissionById, getAllPermissions };
//# sourceMappingURL=permission.controller.js.map