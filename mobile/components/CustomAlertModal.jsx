import React, { useEffect } from "react";
import {
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { COLORS } from "../constants/colors";

export const CustomAlertModal = ({
  visible,
  title,
  message,
  buttons = [],
  onClose,
}) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
    scale.value = withTiming(visible ? 1 : 0.95, {
      duration: 180,
      easing: Easing.out(Easing.cubic),
    });
  }, [opacity, scale, visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={styles.container}>
          <Animated.View style={[styles.dialog, animatedStyle]}>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}

            <View style={styles.buttonRow}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  onPress={() => {
                    button.onPress?.();
                    onClose?.();
                  }}
                  style={[
                    styles.button,
                    button.style === "destructive"
                      ? styles.buttonDestructive
                      : styles.buttonPrimary,
                  ]}
                >
                  <Text style={styles.buttonText}>{button.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(8, 15, 30, 0.6)",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  container: {
    width: "100%",
    maxWidth: 360,
  },
  dialog: {
    backgroundColor: COLORS.surface,
    borderRadius: 18,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 14,
    elevation: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.muted,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 4,
  },
  button: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    minWidth: 88,
    alignItems: "center",
  },
  buttonPrimary: {
    backgroundColor: COLORS.primary,
  },
  buttonDestructive: {
    backgroundColor: COLORS.expense,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
