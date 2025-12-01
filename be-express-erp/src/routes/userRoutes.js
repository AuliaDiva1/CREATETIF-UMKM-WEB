import express from "express";
import { fetchAllUsers, createNewUser, updateUserController, deleteUserController, getUserByIdController } from "../controllers/userController.js";
import { verifyToken, authorizeRoles } from "../middleware/jwt.js";

const router = express.Router();

// ✅ GET /user/ (Fetch All Users) - Dibatasi hanya untuk SUPER_ADMIN dan ADMIN
router.get("/", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), fetchAllUsers); 

// ✅ GET /user/:id (Get User by ID) - Dibatasi hanya untuk SUPER_ADMIN dan ADMIN
router.get("/:id", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), getUserByIdController); 

// ✅ POST /user/ (Create New User) - Dibatasi hanya untuk SUPER_ADMIN dan ADMIN
router.post("/", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), createNewUser);

// ✅ PUT /user/:id (Update User) - Dibatasi hanya untuk SUPER_ADMIN dan ADMIN
router.put("/:id", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), updateUserController);

// ✅ DELETE /user/:id (Delete User) - Dibatasi hanya untuk SUPER_ADMIN dan ADMIN
router.delete("/:id", verifyToken, authorizeRoles("SUPER_ADMIN", "ADMIN"), deleteUserController);

export default router;