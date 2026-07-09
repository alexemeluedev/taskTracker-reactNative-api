import { View, Text } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { COLORS } from "../constants/colors";

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

export const BalanceCard = ({ summary }) => {
  const totalBalance = formatMoney(summary.balance);
  const incomeAmount = `+${formatMoney(summary.income)}`;
  const expenseAmount = `-${formatMoney(Math.abs(summary.expenses || 0))}`;

  return (
    <View style={styles.balanceCard}>
      <Text style={styles.balanceTitle}>Total balance</Text>
      <Text style={styles.balanceAmount}>{totalBalance}</Text>
      <View style={styles.balanceStats}>
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Income</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.income }]}>
            {incomeAmount}
          </Text>
        </View>
        <View style={[styles.balanceStatItem, styles.statDivider]} />
        <View style={styles.balanceStatItem}>
          <Text style={styles.balanceStatLabel}>Expenses</Text>
          <Text style={[styles.balanceStatAmount, { color: COLORS.expense }]}>
            {expenseAmount}
          </Text>
        </View>
      </View>
    </View>
  );
};
