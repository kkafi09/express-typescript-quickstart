"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data = (data) => ({
    err: null,
    data: Array.isArray(data) ? data : [data]
});
const error = (err) => ({
    err,
    data: null
});
const paginationData = (data, meta) => ({
    err: null,
    data,
    meta
});
const response = (res, type = 'success', result = null, message = '', code = 200) => {
    let status = true;
    let data = result ? result.data : null;
    if (type === 'fail' && (result === null || result === void 0 ? void 0 : result.data) !== null) {
        status = false;
        data = null;
        message = message || (result === null || result === void 0 ? void 0 : result.message) || 'An error occurred';
        code = code || (result === null || result === void 0 ? void 0 : result.code) || 500;
    }
    const responseObj = {
        success: status,
        message,
        code
    };
    if (data !== null && data !== undefined) {
        if (Array.isArray(data)) {
            responseObj.data = data.length === 1 ? data[0] : data;
        }
        else {
            responseObj.data = data;
        }
    }
    res.status(code).json(responseObj);
};
const paginationResponse = (res, type, result, message = '', code = 200) => {
    let status = true;
    let data = result.data;
    let meta = result.meta || null;
    if (type === 'fail' && result.data !== null) {
        status = false;
        data = [];
        message = message || result.message || 'An error occurred';
        code = code || result.code || 500;
    }
    const responseObj = {
        success: status,
        message,
        code
    };
    if (data !== null && data !== undefined) {
        if (Array.isArray(data)) {
            responseObj.data = data.length === 1 ? data[0] : data;
        }
        else {
            responseObj.data = data;
        }
    }
    if (meta !== null) {
        responseObj.meta = meta;
    }
    res.status(code).json(responseObj);
};
exports.default = { data, error, response, paginationResponse, paginationData };
//# sourceMappingURL=wrapper.js.map