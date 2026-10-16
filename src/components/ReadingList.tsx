import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { Reading } from '@/types';
import { colors } from '@/theme/colors';
import { levelColor, levelLabel } from '@/utils/airQuality';

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export function ReadingList({ readings }: { readings: Reading[] }) {
  return (
    <View style={styles.card}>
      {readings.map((r, i) => (
        <View key={r.id} style={[styles.row, i > 0 && styles.divider]}>
          <View style={[styles.dot, { backgroundColor: levelColor[r.level] }]} />
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>{levelLabel[r.level]}</Text>
            <Text style={styles.time}>{formatTime(r.timestamp)}</Text>
          </View>
          <Text style={styles.ppm}>{r.ppm} ppm</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border },
  row: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  divider: { borderTopWidth: 1, borderTopColor: colors.border },
  dot: { width: 10, height: 10, borderRadius: 5 },
  label: { color: colors.text, fontWeight: '700' },
  time: { color: colors.textMuted, fontSize: 12, marginTop: 2 },
  ppm: { color: colors.text, fontWeight: '700' },
});