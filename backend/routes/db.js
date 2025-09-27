
import express from 'express';
import { cleanDB } from '../controllers/db.js';

const router = express.Router();

router.delete('/clean', cleanDB);

export default router;
