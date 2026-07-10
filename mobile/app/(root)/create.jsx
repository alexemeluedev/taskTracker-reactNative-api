import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useEffect, useState } from "react";
import { API_URL } from "../../constants/api";
import { styles } from "../../assets/styles/create.styles";
import { COLORS } from "../../constants/colors";
import { Ionicons } from "@expo/vector-icons";

const formatMoneyPreview = (value) => {
  if (!value) return "0.00";
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return "0.00";
  return numeric.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const STORAGE_KEY = "@tasktracker:create-draft";
const QUICK_AMOUNTS = [5, 10, 25, 50, 100];
const memoryDraftStore = {};

const getDraftStorage = async () => {
  try {
    const AsyncStorage = (
      await import("@react-native-async-storage/async-storage")
    ).default;
    return AsyncStorage;
  } catch {
    return null;
  }
};

const readDraftValue = async (key) => {
  try {
    if (typeof globalThis !== "undefined" && globalThis.localStorage) {
      return globalThis.localStorage.getItem(key);
    }

    const storage = await getDraftStorage();
    if (storage?.getItem) {
      return await storage.getItem(key);
    }
  } catch {
    // fall through to memory fallback
  }

  return memoryDraftStore[key] ?? null;
};

const writeDraftValue = async (key, value) => {
  try {
    if (typeof globalThis !== "undefined" && globalThis.localStorage) {
      globalThis.localStorage.setItem(key, value);
      return;
    }

    const storage = await getDraftStorage();
    if (storage?.setItem) {
      await storage.setItem(key, value);
      return;
    }
  } catch {
    // fall through to memory fallback
  }

  memoryDraftStore[key] = value;
};

const removeDraftValue = async (key) => {
  try {
    if (typeof globalThis !== "undefined" && globalThis.localStorage) {
      globalThis.localStorage.removeItem(key);
      return;
    }

    const storage = await getDraftStorage();
    if (storage?.removeItem) {
      await storage.removeItem(key);
      return;
    }
  } catch {
    // fall through to memory fallback
  }

  delete memoryDraftStore[key];
};

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);

  const persistDraft = async (draftData) => {
    try {
      const isMeaningfulDraft = Boolean(
        draftData.title?.trim() || draftData.amount || draftData.category,
      );

      if (!isMeaningfulDraft) {
        await removeDraftValue(STORAGE_KEY);
        return;
      }

      await writeDraftValue(STORAGE_KEY, JSON.stringify(draftData));
    } catch (error) {
      console.warn("Draft save skipped:", error?.message || error);
    }
  };

  useEffect(() => {
    const loadDraft = async () => {
      try {
        const savedDraft = await readDraftValue(STORAGE_KEY);
        if (savedDraft) {
          const parsedDraft = JSON.parse(savedDraft);
          setTitle(parsedDraft.title || "");
          setAmount(parsedDraft.amount || "");
          setSelectedCategory(parsedDraft.category || "");
          setIsExpense(parsedDraft.isExpense ?? true);
        }
      } catch (error) {
        console.error("Failed to load draft", error);
      } finally {
        setHasLoadedDraft(true);
      }
    };

    loadDraft();
  }, []);

  useEffect(() => {
    if (!hasLoadedDraft) return;

    const saveDraft = async () => {
      await persistDraft({
        title,
        amount,
        category: selectedCategory,
        isExpense,
      });
    };

    saveDraft();
  }, [amount, hasLoadedDraft, isExpense, selectedCategory, title]);

  const clearForm = () => {
    setTitle("");
    setAmount("");
    setSelectedCategory("");
    setIsExpense(true);
  };

  const handleCreate = async () => {
    // validations
    if (!title.trim())
      return Alert.alert("Error", "Please enter a transaction title");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedCategory)
      return Alert.alert("Error", "Please select a category");

    setIsLoading(true);
    try {
      // Format the amount (negative for expenses, positive for income)
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));
      const url = `${API_URL}/transactions`;
      const payload = {
        user_id: user.id,
        title,
        amount: formattedAmount,
        category: selectedCategory,
      };

      // console.log("Creating transaction ->", url, payload);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        let errorMessage = "Failed to create transaction";
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          try {
            const errorData = await response.json();
            // console.log(errorData);
            errorMessage =
              errorData.error || errorData.message || JSON.stringify(errorData);
          } catch {
            const text = await response.text().catch(() => null);
            if (text) errorMessage = text;
          }
        } else {
          const text = await response.text().catch(() => null);
          if (text) errorMessage = text;
        }

        // console.log("Create transaction response status:", response.status);
        throw new Error(`${response.status} ${errorMessage}`);
      }

      await removeDraftValue(STORAGE_KEY);
      Alert.alert("Success", "Transaction created successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create transaction");
      console.error("Error creating transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={22} color={COLORS.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New entry</Text>
        <TouchableOpacity
          style={[
            styles.saveButtonContainer,
            isLoading && styles.saveButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          <Text style={styles.saveButton}>
            {isLoading ? "Saving..." : "Save"}
          </Text>
          {!isLoading && (
            <Ionicons name="checkmark" size={18} color={COLORS.primary} />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.card}>
            <View style={styles.quickEntryHeader}>
              <View>
                <Text style={styles.quickEntryLabel}>Quick capture</Text>
                <Text style={styles.quickEntryHint}>
                  Log a new move in seconds.
                </Text>
              </View>
              <View style={styles.typeBadge}>
                <Ionicons
                  name="flash-outline"
                  size={14}
                  color={COLORS.primary}
                />
                <Text style={styles.typeBadgeText}>
                  {isExpense ? "Expense" : "Income"}
                </Text>
              </View>
            </View>

            <View style={styles.typeSelector}>
              {/* EXPENSE SELECTOR */}
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  isExpense && styles.typeButtonActive,
                ]}
                onPress={() => setIsExpense(true)}
              >
                <Ionicons
                  name="arrow-down-circle"
                  size={22}
                  color={isExpense ? COLORS.white : COLORS.expense}
                  style={styles.typeIcon}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    isExpense && styles.typeButtonTextActive,
                  ]}
                >
                  Expense
                </Text>
              </TouchableOpacity>

              {/* INCOME SELECTOR */}
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  !isExpense && styles.typeButtonActive,
                ]}
                onPress={() => setIsExpense(false)}
              >
                <Ionicons
                  name="arrow-up-circle"
                  size={22}
                  color={!isExpense ? COLORS.white : COLORS.income}
                  style={styles.typeIcon}
                />
                <Text
                  style={[
                    styles.typeButtonText,
                    !isExpense && styles.typeButtonTextActive,
                  ]}
                >
                  Income
                </Text>
              </TouchableOpacity>
            </View>

            {/* AMOUNT CONTAINER */}
            <View style={styles.amountContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.amountInput}
                placeholder="0.00"
                placeholderTextColor={COLORS.muted}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
              />
              {amount ? (
                <View style={styles.amountPreviewBadge}>
                  <Text style={styles.amountPreviewText}>
                    {formatMoneyPreview(amount)}
                  </Text>
                </View>
              ) : null}
            </View>

            {/* INPUT CONTAINER */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="create-outline"
                size={22}
                color={COLORS.muted}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Transaction Title"
                placeholderTextColor={COLORS.muted}
                value={title}
                onChangeText={setTitle}
              />
            </View>

            <View style={styles.helperRow}>
              <Ionicons
                name="sparkles-outline"
                size={16}
                color={COLORS.primary}
              />
              <Text style={styles.helperText}>
                Your last entry is saved as a draft and restored automatically.
              </Text>
            </View>

            <View style={styles.presetsSection}>
              <View style={styles.presetsHeader}>
                <Text style={styles.sectionTitle}>Quick amounts</Text>
                <TouchableOpacity onPress={clearForm}>
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.presetRow}>
                {QUICK_AMOUNTS.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    style={styles.presetButton}
                    onPress={() => setAmount(String(preset))}
                  >
                    <Text style={styles.presetButtonText}>${preset}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.draftHint}>
                Tap a preset for faster entry, or keep editing your saved draft.
              </Text>
            </View>

            {/* TITLE */}
            <Text style={styles.sectionTitle}>
              <Ionicons name="pricetag-outline" size={16} color={COLORS.text} />{" "}
              Category
            </Text>

            <View style={styles.categoryGrid}>
              {CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory === category.name &&
                      styles.categoryButtonActive,
                  ]}
                  onPress={() => setSelectedCategory(category.name)}
                >
                  <Ionicons
                    name={category.icon}
                    size={20}
                    color={
                      selectedCategory === category.name
                        ? COLORS.white
                        : COLORS.text
                    }
                    style={styles.categoryIcon}
                  />
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory === category.name &&
                        styles.categoryButtonTextActive,
                    ]}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      )}
    </View>
  );
};
export default CreateScreen;
