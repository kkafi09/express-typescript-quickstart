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
exports.validateMultiImages = exports.validateImage = exports.uploadToFolder = exports.deleteFile = void 0;
const fs_1 = __importDefault(require("fs"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const wrapper_1 = __importDefault(require("../wrapper"));
const logger_1 = __importDefault(require("../logger"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
const maxSize = 2 * 1024 * 1024;
const validateImage = (fieldName) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
        upload.single(fieldName)(req, res, (err) => {
            if (err) {
                console.error('err', err);
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
        console.error('err', err);
        return wrapper_1.default.response(res, 'fail', err, 'Failed to upload image', 500);
    });
});
exports.validateImage = validateImage;
const validateMultiImages = (fieldNames) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield new Promise((resolve, reject) => {
            upload.fields(fieldNames.map((fieldName) => ({
                name: fieldName,
                maxCount: 1
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
        console.error('err', err);
        return wrapper_1.default.response(res, 'fail', null, 'Failed to upload images', 500);
    }
});
exports.validateMultiImages = validateMultiImages;
const uploadToFolder = (file, folder, customFileName) => __awaiter(void 0, void 0, void 0, function* () {
    const timestamp = new Date().getTime();
    const fileName = `${customFileName}_${timestamp}` || `${file.name}_${timestamp}`;
    const uploadPath = path_1.default.join(__dirname, `../../../uploads/${folder}`);
    try {
        if (!fs_1.default.existsSync(uploadPath)) {
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        }
        fs_1.default.writeFileSync(path_1.default.join(uploadPath, fileName), file.data);
        return `uploads/${folder}/${fileName}`;
    }
    catch (error) {
        logger_1.default.log('error-upload', error.message, 'error');
        throw new Error('Failed to upload file');
    }
});
exports.uploadToFolder = uploadToFolder;
const deleteFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        fs_1.default.unlinkSync(path_1.default.join(__dirname, `../../../${filePath}`));
    }
    catch (error) {
        logger_1.default.log('error-upload', error.message, 'error');
        throw new Error('Failed to delete file');
    }
});
exports.deleteFile = deleteFile;
//# sourceMappingURL=upload-image.js.map