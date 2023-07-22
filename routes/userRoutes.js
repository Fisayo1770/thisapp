import express, { request } from "express";
import {
    getUser,
    getUsers,
    createUser,
    updateUser} from "../controllers/userController.js"

const router = express.Router();

router.get('/', getUsers);
router.get('/:id', getUser);

router.post('/',  createUser);
router.patch('/:id', updateUser);

export default router;