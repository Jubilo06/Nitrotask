import { Router } from "express";
import usersRouter from "./users.mjs";
import todoRouter from "./todo.mjs";

const router = Router();
router.use(usersRouter);
router.use(todoRouter);

export default router;
