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
const bcrypt_1 = __importDefault(require("bcrypt"));
const wrapper_1 = __importDefault(require("../helpers/wrapper"));
const jwt_auth_1 = __importDefault(require("../middlewares/jwt-auth"));
const prisma = new client_1.PrismaClient();
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const user = yield prisma.user.findUnique({ where: { username } });
        if (!user) {
            return wrapper_1.default.response(res, 'fail', null, 'Invalid username and password', 404);
        }
        const isPasswordValid = yield bcrypt_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return wrapper_1.default.response(res, 'fail', null, 'Invalid username and password', 400);
        }
        const token = jwt_auth_1.default.generateToken(user.id);
        const result = wrapper_1.default.data({ user, token });
        res.cookie('accessToken', token, {
            httpOnly: true,
            maxAge: 3 * 60 * 60 * 1000
        });
        return wrapper_1.default.response(res, 'success', result, 'Success Login', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to login', 500);
    }
});
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, username, password } = req.body;
    try {
        const existingUser = yield prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            return wrapper_1.default.response(res, 'fail', null, 'User with this username already exists', 409);
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const user = yield prisma.user.create({
            data: {
                name,
                username,
                password: hashedPassword
            }
        });
        const token = jwt_auth_1.default.generateToken(user.id);
        const result = wrapper_1.default.data({ user, token });
        return wrapper_1.default.response(res, 'success', result, 'Success register', 201);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Error register', 500);
    }
});
const whoAmI = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    if (!userId) {
        return wrapper_1.default.response(res, 'fail', null, 'Token not provided', 500);
    }
    try {
        const user = yield prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        const result = wrapper_1.default.data({ user });
        return wrapper_1.default.response(res, 'success', result, 'Success get User Auth', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Error get user Auth', 500);
    }
});
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, username, email, password, phone_number } = req.body;
        const user = yield prisma.user.create({
            data: {
                name,
                username,
                email,
                password,
                phone_number
            }
        });
        return wrapper_1.default.response(res, 'success', { data: user }, 'User created successfully', 201);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to create user', 500);
    }
});
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const { name, username, email, password, phone_number } = req.body;
        const user = yield prisma.user.update({
            where: { id: userId },
            data: {
                name,
                username,
                email,
                password,
                phone_number
            }
        });
        return wrapper_1.default.response(res, 'success', { data: user }, 'User updated successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to update user', 500);
    }
});
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        yield prisma.user.delete({
            where: { id: userId }
        });
        return wrapper_1.default.response(res, 'success', null, 'User deleted successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to delete user', 500);
    }
});
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.params.userId);
    try {
        const user = yield prisma.user.findUnique({
            where: { id: userId }
        });
        const result = wrapper_1.default.data(user);
        return wrapper_1.default.response(res, 'success', result, 'User retrieved successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to retrieve user', 500);
    }
});
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma.user.findMany();
        return wrapper_1.default.response(res, 'success', { data: users }, 'Users retrieved successfully', 200);
    }
    catch (error) {
        return wrapper_1.default.response(res, 'fail', error, 'Failed to retrieve users', 500);
    }
});
exports.default = { login, register, whoAmI, createUser, updateUser, deleteUser, getAllUsers, getUserById };
//# sourceMappingURL=user.controller.js.map