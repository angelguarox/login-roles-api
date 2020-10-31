import {Router} from 'express';
import AuthController from '../controller/AuthController';
import checkJwt from '../middlewares/jwt';
import checkRole from '../middlewares/role';

const router = Router();

router.post('/login', AuthController.login);
router.post('/changepassword', [checkJwt, checkRole(['admin'])], AuthController.changePassword);

export default router;