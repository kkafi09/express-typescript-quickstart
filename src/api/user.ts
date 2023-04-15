import express from 'express';

const router = express.Router();

router.post('/login');
router.post('/register');
router.get('/');

module.exports = router;
