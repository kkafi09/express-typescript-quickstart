import express from 'express';
import userController from '../controllers/user.controller';
import jwtAuth from '../middlewares/jwt-auth';

const router = express.Router();

router.get('/', [jwtAuth.verifyToken], userController.getAllUsers);

router.get('/:userId', [jwtAuth.verifyToken], userController.getUserById);

router.post('/login', userController.login);

router.post('/register', userController.register);

router.get('/whoAmI', [jwtAuth.verifyToken], userController.whoAmI);

router.post('/', [jwtAuth.verifyToken], userController.createUser);

router.put('/:userId', [jwtAuth.verifyToken], userController.updateUser);

router.delete('/:userId', [jwtAuth.verifyToken], userController.deleteUser);

export default router;
