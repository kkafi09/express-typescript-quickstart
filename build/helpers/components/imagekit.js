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
exports.validateMultiImages = exports.validateImage = exports.uploadImageKit = exports.deleteImageKit = void 0;
const imagekit_1 = __importDefault(require("imagekit"));
const multer_1 = __importDefault(require("multer"));
const wrapper_1 = __importDefault(require("../wrapper"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const imagekit = new imagekit_1.default({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});
const maxSize = 2 * 1024 * 1024;
const validateImage = (fieldName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                console.log('err', err);
                return reject(err);
            }
            resolve();
        });
    })
        .then(() => {
        if (!req.file) {
            return next();
        }
        const file = req.file;
        if (file.size > maxSize) {
            return wrapper_1.default.response(res, 'fail', null, 'File size too large', 400);
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return wrapper_1.default.response(res, 'fail', null, 'Invalid image file type', 400);
        }
        next();
    })
        .catch((err) => {
        console.log('err', err);
        return wrapper_1.default.response(res, 'fail', err, 'failed upload image', 500);
    });
});
exports.validateImage = validateImage;
const validateMultiImages = (fieldNames) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield new Promise((resolve, reject) => {
            upload.fields(fieldNames.map((fieldName) => ({
                name: fieldName,
                maxCount: 1 // Set maxCount to 1 to enforce single file upload per field
            })))(req, res, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
        if (!req.files || Object.keys(req.files).length === 0) {
            return next();
        }
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
        for (const fieldName of fieldNames) {
            const files = req.files[fieldName];
            if (!files || files.length === 0) {
                continue;
            }
            const file = files[0];
            if (file.size > maxSize) {
                return wrapper_1.default.response(res, 'fail', null, 'File size too large', 400);
            }
            if (!allowedMimeTypes.includes(file.mimetype)) {
                return wrapper_1.default.response(res, 'fail', null, 'Failed to upload images', 404);
            }
        }
        next();
    }
    catch (err) {
        return wrapper_1.default.response(res, 'fail', null, 'Failed to upload images');
    }
});
exports.validateMultiImages = validateMultiImages;
const uploadImageKit = (file, folder, customFileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const uploadResult = yield imagekit.upload({
            file: file.data.toString('base64'),
            fileName: customFileName !== null && customFileName !== void 0 ? customFileName : file.name,
            folder: `ukk-cafe/${folder}`
        });
        return uploadResult;
    }
    catch (err) {
        throw new Error('Error uploading ' + err);
    }
});
exports.uploadImageKit = uploadImageKit;
const deleteImageKit = (fileUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield imagekit.deleteFile(fileUrl);
        return response;
    }
    catch (err) {
        throw new Error('Error deleting ' + err);
    }
});
exports.deleteImageKit = deleteImageKit;
//# sourceMappingURL=imagekit.js.map