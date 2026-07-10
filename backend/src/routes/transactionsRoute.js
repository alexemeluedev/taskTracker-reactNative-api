import express from "express";
import {
  createTransaction,
  deleteTransaction,
  getSummaryByUserId,
  getTransactionsByUserId,
  updateTransaction,
} from "../controllers/transactionsController.js";

const router = express.Router();

router.get("/summary/:userId", getSummaryByUserId);
// router.get("/:userId", getTransactionsByUserId);
// 🔴 FIX: Add "user/" here so it doesn't block the transaction /:id paths below
router.get("/user/:userId", getTransactionsByUserId);
router.post("/", createTransaction);
router.put("/:id", updateTransaction);
router.delete("/:id", deleteTransaction);
// router.get("/summary/:userId", getSummaryByUserId);

export default router;
