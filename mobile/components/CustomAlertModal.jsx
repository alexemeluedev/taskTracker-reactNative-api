import React, { useEffect } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
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
      <Pressable style={{ flex: 1, backgroundColor: "rgba(8, 15, 30, 0.55)" }} onPress={onClose}>
        <View style={{ flex: 1, justifyContent: "center", padding: 24 }}>
          <Animated.View style={[{
            backgroundColor: COLORS.surface,
            borderRadius: 22,
            padding: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
          }, animatedStyle]}>
            <Text style={{ fontSize: 18, fontWeight: "800", color: COLORS.text, marginBottom: 8 }}>
              {title}
            </Text>
            {message ? (
              <Text style={{ fontSize: 14, lineHeight: 20, color: COLORS.muted, marginBottom: 16 }}>
                {message}
              </Text>
            ) : null}

            <View style={{ flexDirection: "row", justifyContent: "flex-end", gap: 10 }}>
              {buttons.map((button, index) => (
                <TouchableOpacity
                  key={`${button.text}-${index}`}
                  onPress={() => {
                    button.onPress?.();
                    onClose?.();
                  }}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderRadius: 999,
                    backgroundColor: button.style === "destructive" ? COLORS.expense : COLORS.primary,
                    minWidth: 88,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: COLORS.white, fontWeight: "700" }}>{button.text}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </Pressable>
    </Modal>
  );
};
