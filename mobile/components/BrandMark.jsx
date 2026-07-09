import { View, Text } from "react-native";
import { COLORS } from "../constants/colors";

const BrandMark = ({ size = 48, showLabel = false }) => {
  const radius = size / 2;
  const fontSize = size * 0.4;

  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: radius,
          backgroundColor: COLORS.primary,
          alignItems: "center",
          justifyContent: "center",
          shadowColor: COLORS.primary,
          shadowOffset: { width: 0, height: 8 },
          shadowOpacity: 0.2,
          shadowRadius: 12,
          elevation: 4,
        }}
      >
        <Text
          style={{
            color: COLORS.white,
            fontSize,
            fontWeight: "800",
            letterSpacing: 1,
          }}
        >
          N
        </Text>
      </View>

      {showLabel ? (
        <View style={{ marginLeft: 12 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: COLORS.text,
              letterSpacing: 0.3,
            }}
          >
            NovaLedger
          </Text>
          <Text style={{ fontSize: 12, color: COLORS.muted, marginTop: 1 }}>
            Smart cash flow
          </Text>
        </View>
      ) : null}
    </View>
  );
};

export default BrandMark;
