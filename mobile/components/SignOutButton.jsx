import { useClerk } from "@clerk/clerk-expo";
import { TouchableOpacity } from "react-native";
import { styles } from "../assets/styles/home.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/colors";
import { CustomAlertModal } from "./CustomAlertModal";
import { useState } from "react";

export const SignOutButton = () => {
  const { signOut } = useClerk();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.logoutButton} onPress={() => setShowConfirm(true)}>
        <Ionicons name="log-out-outline" size={18} color={COLORS.text} />
      </TouchableOpacity>

      <CustomAlertModal
        visible={showConfirm}
        title="Logout"
        message="Are you sure you want to sign out?"
        buttons={[
          { text: "Cancel", onPress: () => setShowConfirm(false) },
          { text: "Logout", onPress: signOut, style: "destructive" },
        ]}
        onClose={() => setShowConfirm(false)}
      />
    </>
  );
};
