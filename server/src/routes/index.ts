import { Router } from "express";
import cardsRouter from "./cards.js";
import usersRouter from "./users.js";

const router = Router();

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);

export default router;
