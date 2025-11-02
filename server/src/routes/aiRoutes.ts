import express from "express";
import {
  generateEmbeddings,
  getRecommendations,
} from "../controllers/aiController";

const router = express.Router();

// Generate embeddings for all products
router.post("/generate-embeddings", generateEmbeddings);

// Get recommendations for a product
router.get("/recommend/:id", getRecommendations);

export default router;
