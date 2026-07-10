import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../../../assets/styles/home.styles";
import { COLORS } from "../../../constants/colors";
import { formatDateTime } from "../../../lib/utils";
import { useTransactions } from "../../../hooks/useTransactions";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Income: "cash",
  Other: "ellipsis-horizontal",
};

export default function TransactionDetailPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updateTransaction, deleteTransaction } = useTransactions();

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(params.title || "");
  const [amount, setAmount] = useState(String(params.amount || "0"));
  const [category, setCategory] = useState(params.category || "Other");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTitle(params.title || "");
    setAmount(String(params.amount || "0"));
    setCategory(params.category || "Other");
  }, [params.title, params.amount, params.category]);

  const isIncome = parseFloat(amount) > 0;
  const iconName = CATEGORY_ICONS[category] || "pricetag-outline";

  // const handleSave = async () => {
  //   if (!title.trim()) {
  //     Alert.alert(
  //       "Missing title",
  //       "Please enter a title for this transaction.",
  //     );
  //     return;
  //   }

  //   setIsSaving(true);
  //   const success = await updateTransaction(params.id, {
  //     title: title.trim(),
  //     amount: Number(amount),
  //     category,
  //   });
  //   setIsSaving(false);

  //   if (success) {
  //     setIsEditing(false);
  //   }
  // };

  // updated code

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert(
        "Missing title",
        "Please enter a title for this transaction.",
      );
      return;
    }

    // Ensure we parse the base number safely
    const parsedAmount = Math.abs(parseFloat(amount)) || 0;

    // If the category is NOT Income, save it as a negative number for expenses
    const finalAmount = category === "Income" ? parsedAmount : -parsedAmount;

    setIsSaving(true);
    try {
      const success = await updateTransaction(params.id, {
        title: title.trim(),
        amount: finalAmount,
        category,
        // Optional: Include explicit type if your Express backend requires it
        type: category === "Income" ? "income" : "expense",
      });

      if (success) {
        setIsEditing(false);
      } else {
        Alert.alert(
          "Update Failed",
          "The backend server rejected the update parameters.",
        );
      }
    } catch (error) {
      console.error("Failed updating transaction payload:", error);
      Alert.alert("Error", "An unexpected error occurred while saving.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    Alert.alert("Delete transaction", "This action cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const success = await deleteTransaction(params.id);
          if (success) {
            router.back();
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.detailContainer}>
      <View style={styles.detailHeader}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.detailHeaderTitle}>Transaction details</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={styles.detailContent}>
        <View style={styles.detailCard}>
          <View style={styles.detailIconContainer}>
            <Ionicons
              name={iconName}
              size={24}
              color={isIncome ? COLORS.income : COLORS.expense}
            />
          </View>

          {isEditing ? (
            <View style={styles.editForm}>
              <View>
                <Text style={styles.fieldLabel}>Title</Text>
                <TextInput
                  value={title}
                  onChangeText={setTitle}
                  style={styles.fieldInput}
                  placeholder="Transaction title"
                  placeholderTextColor={COLORS.muted}
                />
              </View>

              <View>
                <Text style={styles.fieldLabel}>Amount</Text>
                <TextInput
                  value={amount}
                  onChangeText={setAmount}
                  style={styles.fieldInput}
                  keyboardType="numeric"
                  placeholder="0.00"
                  placeholderTextColor={COLORS.muted}
                />
              </View>

              <View>
                <Text style={styles.fieldLabel}>Category</Text>
                <View style={styles.categoryRow}>
                  {Object.keys(CATEGORY_ICONS).map((item) => {
                    const active = category === item;
                    return (
                      <TouchableOpacity
                        key={item}
                        style={[
                          styles.categoryChip,
                          active && styles.categoryChipActive,
                        ]}
                        onPress={() => setCategory(item)}
                      >
                        <Text
                          style={[
                            styles.categoryChipText,
                            active && styles.categoryChipTextActive,
                          ]}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          ) : (
            <>
              <Text style={styles.detailTitle}>{title}</Text>
              <Text
                style={[
                  styles.detailAmount,
                  { color: isIncome ? COLORS.income : COLORS.expense },
                ]}
              >
                {isIncome ? "+" : "-"}
                {formatMoney(Math.abs(parseFloat(amount)))}
              </Text>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Category</Text>
                <Text style={styles.detailValue}>{category}</Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Date</Text>
                <Text style={styles.detailValue}>
                  {formatDateTime(params.createdAt)}
                </Text>
              </View>

              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>
                  {isIncome ? "Income" : "Expense"}
                </Text>
              </View>
            </>
          )}

          <View style={styles.detailActions}>
            {isEditing ? (
              <TouchableOpacity
                style={[
                  styles.detailActionButton,
                  styles.detailActionButtonPrimary,
                ]}
                onPress={handleSave}
                disabled={isSaving}
              >
                <Text
                  style={[
                    styles.detailActionText,
                    styles.detailActionTextPrimary,
                  ]}
                >
                  {isSaving ? "Saving..." : "Save"}
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.detailActionButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.detailActionText}>Edit</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.detailActionButton}
              onPress={handleDelete}
            >
              <Text style={styles.detailActionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
