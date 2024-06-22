import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { loginUserController, logoutUserController, refreshTokenUserController, registerUserController } from '../controllers/auth.js';
import { registerUserSchema } from '../validation/registerUserSchema.js';
import { loginUserSchema } from '../validation/loginUserSchema.js';

const authRouter = Router();

authRouter.post('/register', validateBody(registerUserSchema), ctrlWrapper(registerUserController));
authRouter.post('/login', validateBody(loginUserSchema), ctrlWrapper(loginUserController));
authRouter.post('/refresh', ctrlWrapper(refreshTokenUserController));
authRouter.post('/logout', ctrlWrapper(logoutUserController));

export default authRouter;
