import { StyleSheet, Text, View } from "react-native";
import { Marker } from "react-native-maps";
import { colors } from "@/theme";

type Props = {
  lat: number;
  lng: number;
  label: string;
  emoji: string;
  color: string;
};

export function PartnerMarker({ lat, lng, label, emoji, color }: Props) {
  return (
    <Marker coordinate={{ latitude: lat, longitude: lng }} title={label} anchor={{ x: 0.5, y: 0.5 }}>
      <View style={[styles.pin, { backgroundColor: color }]}>
        <Text style={styles.emoji}>{emoji}</Text>
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  pin: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: colors.surface,
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  emoji: { fontSize: 20 },
});
