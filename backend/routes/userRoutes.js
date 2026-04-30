const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const { createUser, getUsers, getUser, updateUser, deleteUser } = require("../controllers/userController");

router.post("/", auth, authorizeRoles("ADMIN", "COMPANY", "BRANCH", "SUPERVISOR"), createUser);
router.get("/", auth, getUsers);
router.get("/:id", auth, getUser);
router.put("/:id", auth, authorizeRoles("ADMIN", "COMPANY", "BRANCH", "SUPERVISOR"), updateUser);
router.delete("/:id", auth, authorizeRoles("ADMIN", "COMPANY", "BRANCH", "SUPERVISOR"), deleteUser);

module.exports = router;
