import { Router } from "express";
import { CreateRoom, GetRoom, GetRooms, UpdateRoom } from "../controllers/room.controller";
import { middleware } from "../middleware";

const router:Router = Router();

router.post("/room",middleware,CreateRoom)
router.get("/rooms",middleware,GetRooms)
router.route("/room/:roomId").get(middleware,GetRoom).put(middleware,UpdateRoom);

export default router;