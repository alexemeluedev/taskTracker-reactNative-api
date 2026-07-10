import { sql } from "../config/db.js";

export async function getTransactionsByUserId(req, res) {
  try {
    const { userId } = req.params;

    const transactions = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
      `;

    res.status(200).json(transactions);
  } catch (error) {
    // console.log("Error getting the transactions", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function createTransaction(req, res) {
  try {
    const { title, amount, category, user_id } = req.body;

    if (!title || !user_id || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const transaction = await sql`
      INSERT INTO transactions(user_id,title,amount,category)
      VALUES (${user_id},${title},${amount},${category})
      RETURNING *
    `;

    // console.log(transaction);
    res.status(201).json(transaction[0]);
  } catch (error) {
    // console.log("Error creating the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

// export async function updateTransaction(req, res) {
//   try {
//     const { id } = req.params;
//     const { title, amount, category } = req.body;

//     // // Fallback parsing to ensure fields aren't blank
//     // const title = req.body?.title;
//     // const category = req.body?.category;
//     // const amount = req.body?.amount;

//     // ADD THESE LOGS HERE TO SEE EXACTLY WHAT IS SENDING
//     console.log("=== INCOMING UPDATE REQUEST ===");
//     console.log("REQ PARAMS ID:", id);
//     console.log("REQ BODY TYPE:", typeof req.body, "BODY DATA:", req.body);
//     console.log("FIELDS:", { title, amount, category });

//     if (isNaN(parseInt(id))) {
//       return res.status(400).json({ message: "Invalid transaction ID" });
//     }

//     // if (!title || !category || amount === undefined) {
//     //   return res.status(400).json({ message: "All fields are required" });
//     // }
//     // A more bulletproof validation checking structure
//     if (!title || !category || amount === undefined || amount === null) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const result = await sql`
//       UPDATE transactions
//       SET title = ${title}, amount = ${amount}, category = ${category}
//       WHERE id = ${id}
//       RETURNING *
//     `;

//     if (result.length === 0) {
//       return res.status(404).json({ message: "Transaction not found" });
//     }

//     res.status(200).json(result[0]);
//   } catch (error) {
//     console.error("Backend update error details:", error); // Keep this log active
//     res.status(500).json({ message: "Internal server error" });
//   }
// }

export async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { title, amount, category } = req.body;

    // 1. Validation guardrails
    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    if (!title || !category || amount === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2. FORCE PARSE THE ID STRING TO A NUMBER SO POSTGRESQL MATCHES IT
    const numericId = Number(id);

    const result = await sql`
      UPDATE transactions
      SET title = ${title.trim()}, amount = ${Number(amount)}, category = ${category}
      WHERE id = ${numericId}
      RETURNING *
    `;

    // 3. Handle data missing errors
    if (!result || result.length === 0) {
      return res
        .status(404)
        .json({ message: "Transaction not found in database" });
    }

    res.status(200).json(result[0]);
  } catch (error) {
    console.error("Database update error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;

    if (isNaN(parseInt(id))) {
      return res.status(400).json({ message: "Invalid transaction ID" });
    }

    const result = await sql`
      DELETE FROM transactions WHERE id = ${id} RETURNING *
    `;

    if (result.length === 0) {
      return res.status(404).json({ message: "Transaction not found" });
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    // console.log("Error deleting the transaction", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getSummaryByUserId(req, res) {
  try {
    const { userId } = req.params;

    const balanceResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as balance FROM transactions WHERE user_id = ${userId}
    `;

    const incomeResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as income FROM transactions
      WHERE user_id = ${userId} AND amount > 0
    `;

    const expensesResult = await sql`
      SELECT COALESCE(SUM(amount), 0) as expenses FROM transactions
      WHERE user_id = ${userId} AND amount < 0
    `;

    res.status(200).json({
      balance: balanceResult[0].balance,
      income: incomeResult[0].income,
      expenses: expensesResult[0].expenses,
    });
  } catch (error) {
    // console.log("Error gettin the summary", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
