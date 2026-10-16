import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/theme/colors';
import { useCleanSky } from '@/context/CleanSkyContext';
import { ReadingList } from '@/components/ReadingList';
import { PurifierButton } from '@/components/PurifierButton';

const RANGES = [
  { label: '1h', hours: 1 },
  { label: '6h', hours: 6 },
  { label: '24h', hours: 24 },
];

export default function Historico() {
  const { readings } = useCleanSky();
  const [hours, setHours] = useState(1);

  const filtered = useMemo(() => {
    const since = Date.now() - hours * 3600 * 1000;
    return readings.filter((r) => r.timestamp >= since).reverse().slice(0, 100);
  }, [readings, hours]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Histórico</Text>
          <View style={styles.filter}>
            {RANGES.map((r) => (
              <Pressable
                key={r.label}
                onPress={() => setHours(r.hours)}
                style={[styles.pill, hours === r.hours && styles.pillActive]}
              >
                <Text style={[styles.pillText, hours === r.hours && styles.pillTextActive]}>
                  {r.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {filtered.length === 0 ? (
          <Text style={styles.empty}>Nenhuma leitura neste período.</Text>
        ) : (
          <ReadingList readings={filtered} />
        )}
      </ScrollView>
      <PurifierButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: colors.text, fontSize: 18, fontWeight: '800' },
  filter: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: 20, padding: 3,
    borderWidth: 1, borderColor: colors.border,
  },
  pill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 16 },
  pillActive: { backgroundColor: '#2A2A33' },
  pillText: { color: colors.textMuted, fontSize: 13 },
  pillTextActive: { color: colors.text, fontWeight: '700' },
  empty: { color: colors.textMuted, textAlign: 'center', marginTop: 40 },
});