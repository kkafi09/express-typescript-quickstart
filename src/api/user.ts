import express from 'express';
import userController from '../controllers/userController';
import jwtAuth from '../middlewares/jwtAuth';

const router = express.Router();

router.post('/login', userController.login);

router.post('/register', userController.register);

router.get('/', jwtAuth.verifyToken, userController.getUser);

export default router;
