import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import fs from 'fs';
import multer from 'multer';
import path from 'path';
import wrapper from '../wrapper';
import logger from '../logger';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const maxSize = 2 * 1024 * 1024;

const validateImage = (fieldName: string) => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise<void>((resolve, reject) => {
    upload.single(fieldName)(req, res, (err: any) => {
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

      const file = req.file as Express.Multer.File;

      if (file.size > maxSize) {
        return wrapper.response(res, 'fail', null, 'File size too large', 400);
      }

      const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return wrapper.response(res, 'fail', null, 'Invalid image file type', 400);
      }

      next();
    })
    .catch((err) => {
      console.error('err', err);
      return wrapper.response(res, 'fail', err, 'Failed to upload image', 500);
    });
};

const validateMultiImages = (fieldNames: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await new Promise<void>((resolve, reject) => {
      upload.fields(
        fieldNames.map((fieldName) => ({
          name: fieldName,
          maxCount: 1
        }))
      )(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });

    if (!req.files || Object.keys(req.files).length === 0) {
      return next();
    }

    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/svg+xml'];

    for (const fieldName of fieldNames) {
      const files = (req.files as unknown as { [fieldname: string]: Express.Multer.File[] })[fieldName];

      if (!files || files.length === 0) {
        continue;
      }

      const file = files[0] as Express.Multer.File;

      if (file.size > maxSize) {
        return wrapper.response(res, 'fail', null, 'File size too large', 400);
      }

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return wrapper.response(res, 'fail', null, 'Failed to upload images', 404);
      }
    }

    next();
  } catch (err) {
    console.error('err', err);
    return wrapper.response(res, 'fail', null, 'Failed to upload images', 500);
  }
};

const uploadToFolder = async (file: UploadedFile, folder: string, customFileName?: string): Promise<string> => {
  const timestamp = new Date().getTime();
  const fileName = `${customFileName}_${timestamp}` || `${file.name}_${timestamp}`;
  const uploadPath = path.join(__dirname, `../../../uploads/${folder}`);

  try {
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    fs.writeFileSync(path.join(uploadPath, fileName), file.data);

    return `uploads/${folder}/${fileName}`;
  } catch (error: any) {
    logger.log('error-upload', error.message, 'error');
    throw new Error('Failed to upload file');
  }
};

const deleteFile = async (filePath: string): Promise<void> => {
  try {
    fs.unlinkSync(path.join(__dirname, `../../../${filePath}`));
  } catch (error: any) {
    logger.log('error-upload', error.message, 'error');
    throw new Error('Failed to delete file');
  }
};

export { deleteFile, uploadToFolder, validateImage, validateMultiImages };
