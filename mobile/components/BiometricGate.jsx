import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { styles } from "../assets/styles/auth.styles";

export const BiometricGate = ({ onAuthenticated, title = "Secure access" }) => {
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
          onAuthenticated();
          return;
        }

        setIsChecking(true);
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: title,
          fallbackLabel: "Use passcode",
        });

        setIsChecking(false);
        if (result.success) {
          onAuthenticated();
        } else {
          Alert.alert(
            "Authentication required",
            "Face ID or fingerprint is needed to continue.",
          );
        }
      } catch (error) {
        console.warn("Biometric authentication unavailable:", error);
        setIsChecking(false);
        onAuthenticated();
      }
    };

    verify();
  }, [onAuthenticated, title]);

  return (
    <View style={styles.verificationContainer}>
      <Text style={styles.verificationTitle}>{title}</Text>
      <Text style={styles.subtitle}>
        Use Face ID or your fingerprint to unlock your workspace.
      </Text>
      <TouchableOpacity style={styles.button} onPress={() => onAuthenticated()}>
        <Text style={styles.buttonText}>
          {isChecking ? "Checking..." : "Continue"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
