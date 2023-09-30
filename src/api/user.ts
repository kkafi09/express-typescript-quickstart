import express from 'express';
import userController from '../controllers/user.controller';
import jwtAuth from '../middlewares/jwt-auth';

const router = express.Router();

router.post('/login', userController.login);

router.post('/register', userController.register);

router.get('/', jwtAuth.verifyToken, userController.getUser);

export default router;
