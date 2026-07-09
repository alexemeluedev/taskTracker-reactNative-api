// react custom hook file

import { useCallback, useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../constants/api";

// const API_URL = "https://wallet-api-cxqp.onrender.com/api";
// const API_URL = "http://localhost:5001/api";

export const useTransactions = (userId) => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    balance: 0,
    income: 0,
    expenses: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // useCallback is used for performance reasons, it will memoize the function
  const fetchTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/transactions/${userId}`);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  }, [userId]);

  const fetchSummary = useCallback(async () => {
    try {
      const url = `${API_URL}/transactions/summary/${userId}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      setSummary(data);
    } catch (error) {
      console.error("Error fetching summary:", error);
    }
  }, [userId]);

  const loadData = useCallback(async () => {
    if (!userId) return;

    setIsLoading(true);
    try {
      await Promise.all([fetchTransactions(), fetchSummary()]);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTransactions, fetchSummary, userId]);

  // const updateTransaction = async (id, payload) => {
  //   try {
  //     const response = await fetch(`${API_URL}/transactions/${id}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify(payload),
  //     });

  //     if (!response.ok) throw new Error("Failed to update transaction");

  //     await loadData();
  //     Alert.alert("Success", "Transaction updated successfully");
  //     return true;
  //   } catch (error) {
  //     console.error("Error updating transaction:", error);
  //     Alert.alert("Error", error.message);
  //     return false;
  //   }
  // };

  const updateTransaction = async (id, updatedData) => {
    try {
      const numericId = Number.parseInt(id, 10);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        Alert.alert("Error", "Invalid transaction id");
        return false;
      }

      const targetUrl = `${API_URL}/transactions/${numericId}`;
      const response = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: updatedData.title,
          amount: Number(updatedData.amount),
          category: updatedData.category,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error body");
        Alert.alert(
          "Update failed",
          `Status ${response.status}\n${errorText || "The server rejected the update request."}`,
        );
        return false;
      }

      await loadData();
      Alert.alert("Success", "Transaction updated successfully");
      return true;
    } catch (error) {
      Alert.alert("Error", error.message || "Unable to update transaction");
      return false;
    }
  };

  const deleteTransaction = async (id) => {
    try {
      const numericId = Number.parseInt(id, 10);
      if (!Number.isInteger(numericId) || numericId <= 0) {
        Alert.alert("Error", "Invalid transaction id");
        return false;
      }

      const response = await fetch(`${API_URL}/transactions/${numericId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error body");
        throw new Error(errorText || "Failed to delete transaction");
      }

      await loadData();
      Alert.alert("Success", "Transaction deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting transaction:", error);
      Alert.alert("Error", error.message || "Unable to delete transaction");
      return false;
    }
  };

  return {
    transactions,
    summary,
    isLoading,
    loadData,
    updateTransaction,
    deleteTransaction,
  };
};
