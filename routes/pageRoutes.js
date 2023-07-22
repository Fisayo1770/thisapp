import express, { request } from "express";

import { getPage,
    getPages,
    createPage,
    updatePage,
    } from "../controllers/pageController.js";


const router = express.Router();
router.get('/', getPages);
router.get('/:id', getPage)

router.post('/', createPage);
router.patch('/:id', updatePage)

export default router;