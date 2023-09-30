import express from 'express';
import userController from '../controllers/user.controller';
import jwtAuth from '../middlewares/jwt-auth';
import permissionMiddleware from '../middlewares/permission';

const router = express.Router();

router.get('/', [jwtAuth.verifyToken, permissionMiddleware], userController.getAllUsers);

router.get('/:userId', [jwtAuth.verifyToken, permissionMiddleware], userController.getUserById);

router.post('/login', userController.login);

router.post('/register', userController.register);

router.get('/whoAmI', jwtAuth.verifyToken, userController.whoAmI);

router.post('/', userController.createUser);

router.put('/:userId', userController.updateUser);

router.delete('/:userId', userController.deleteUser);

export default router;
