import express from "express";
import {
  
  getRecommendations,
} from "../controllers/aiController";

const router = express.Router();



// Get recommendations for a product
router.get("/recommend/:id", getRecommendations);

export default router;
