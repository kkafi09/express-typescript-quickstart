import { NextFunction, Request, Response } from 'express';
import { UploadedFile } from 'express-fileupload';
import ImageKit from 'imagekit';
import multer from 'multer';
import wrapper from '../wrapper';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string
});

const maxSize = 2 * 1024 * 1024;

const validateImage = (fieldName: string) => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise<void>((resolve, reject) => {
    upload.single(fieldName)(req, res, (err: any) => {
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
      console.log('err', err);
      return wrapper.response(res, 'fail', err, 'failed upload image', 500);
    });
};

const validateMultiImages = (fieldNames: string[]) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await new Promise<void>((resolve, reject) => {
      upload.fields(
        fieldNames.map((fieldName) => ({
          name: fieldName,
          maxCount: 1 // Set maxCount to 1 to enforce single file upload per field
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
    return wrapper.response(res, 'fail', null, 'Failed to upload images');
  }
};

const uploadImageKit = async (file: UploadedFile, folder: string, customFileName: string) => {
  try {
    const uploadResult = await imagekit.upload({
      file: file.data.toString('base64'),
      fileName: customFileName ?? file.name,
      folder: `ukk-cafe/${folder}`
    });
    return uploadResult;
  } catch (err) {
    throw new Error('Error uploading ' + err);
  }
};

const deleteImageKit = async (fileUrl: string) => {
  try {
    const response = await imagekit.deleteFile(fileUrl);
    return response;
  } catch (err) {
    throw new Error('Error deleting ' + err);
  }
};

export { deleteImageKit, uploadImageKit, validateImage, validateMultiImages };
