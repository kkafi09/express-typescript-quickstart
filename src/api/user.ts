import express from 'express';
import {
  PERMISSION_BACKOFFICE_CREATE_USER,
  PERMISSION_BACKOFFICE_DELETE_USER,
  PERMISSION_BACKOFFICE_DETAIL_USER,
  PERMISSION_BACKOFFICE_SHOW_USER,
  PERMISSION_BACKOFFICE_UPDATE_USER
} from '../constants/permission';
import userController from '../controllers/user.controller';
import jwtAuth from '../middlewares/jwt-auth';
import { default as authGuard } from '../middlewares/permission';

const router = express.Router();

router.get('/', [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_SHOW_USER)], userController.getAllUsers);

router.get('/:userId', [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_DETAIL_USER)], userController.getUserById);

router.post('/login', userController.login);

router.post('/register', userController.register);

router.get('/whoAmI', [jwtAuth.verifyToken], userController.whoAmI);

router.post('/', [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_CREATE_USER)], userController.createUser);

router.put('/:userId', [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_UPDATE_USER)], userController.updateUser);

router.delete(
  '/:userId',
  [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_DELETE_USER)],
  userController.deleteUser
);

export default router;
