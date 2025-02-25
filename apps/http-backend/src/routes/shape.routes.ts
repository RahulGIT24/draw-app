import { Router } from "express";
import { middleware } from "../middleware";
import { AddShapes, GetExistingShapes } from "../controllers/shape.controller";

const router:Router = Router();

router.get("/get-existing-shapes/:roomId",middleware,GetExistingShapes)
router.post("/add-shapes/:roomId",middleware,AddShapes)

export default router;