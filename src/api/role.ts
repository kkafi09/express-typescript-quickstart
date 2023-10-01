import express from 'express';
import {
  PERMISSION_BACKOFFICE_CREATE_ROLE,
  PERMISSION_BACKOFFICE_DELETE_ROLE,
  PERMISSION_BACKOFFICE_DETAIL_ROLE,
  PERMISSION_BACKOFFICE_SHOW_ROLE,
  PERMISSION_BACKOFFICE_UPDATE_ROLE
} from '../constants/permission';
import roleController from '../controllers/role.controller';
import jwtAuth from '../middlewares/jwt-auth';
import { default as authGuard } from '../middlewares/permission';

const router = express.Router();

router.get('/', [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_SHOW_ROLE)], roleController.getAllRoles);

router.get('/:roleId', [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_DETAIL_ROLE)], roleController.getRoleById);

router.post('/', [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_CREATE_ROLE)], roleController.createRole);

router.put('/:roleId', [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_UPDATE_ROLE)], roleController.updateRole);

router.delete(
  '/:roleId',
  [jwtAuth.verifyToken, authGuard(PERMISSION_BACKOFFICE_DELETE_ROLE)],
  roleController.deleteRole
);

export default router;
