import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { useCleanSky } from '@/context/CleanSkyContext';
import { levelColor, levelLabel } from '@/utils/airQuality';
import { ReadingChart } from '@/components/ReadingChart';
import { ReadingList } from '@/components/ReadingList';
import { PurifierButton } from '@/components/PurifierButton';

export default function Painel() {
  const { current, readings, alertVisible, dismissAlert } = useCleanSky();
  const router = useRouter();

  if (!current) return null;

  const isDense = current.level === 'dense';
  const cardText = isDense ? '#FFFFFF' : '#111111';
  const recent = readings.slice(-4).reverse();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Card principal */}
        <View style={[styles.hero, { backgroundColor: levelColor[current.level] }]}>
          <Text style={[styles.heroSub, { color: cardText }]}>Qualidade do ar · agora</Text>
          <Text style={[styles.heroTitle, { color: cardText }]}>{levelLabel[current.level]}</Text>
          <View style={styles.ppmRow}>
            <Text style={[styles.ppmValue, { color: cardText }]}>{current.ppm}</Text>
            <Text style={[styles.ppmUnit, { color: cardText }]}> ppm</Text>
          </View>
        </View>

        {/* Alerta de fumaça densa */}
        {alertVisible && (
          <View style={styles.alert}>
            <MaterialCommunityIcons name="alert-octagon-outline" size={22} color="#FFF" />
            <View style={{ flex: 1 }}>
              <Text style={styles.alertTitle}>Fumaça densa por perto</Text>
              <Text style={styles.alertText}>
                O CleanSky ligou o purificador automaticamente e acendeu a luz de alerta.
              </Text>
              <View style={styles.alertActions}>
                <Button mode="contained" buttonColor="#7A1F17" textColor="#FFF" compact onPress={dismissAlert}>
                  Entendi
                </Button>
                <Button textColor="#FFF" compact onPress={() => router.push('/(tabs)/historico')}>
                  Ver histórico
                </Button>
              </View>
            </View>
          </View>
        )}

        {/* Gráfico */}
        <View style={styles.panel}>
          <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Histórico de leituras</Text>
            <Text style={styles.panelValue}>{current.ppm} ppm</Text>
          </View>
          <ReadingChart values={readings.slice(-30).map((r) => r.ppm)} />
          <View style={styles.axis}>
            <Text style={styles.axisText}>-60min</Text>
            <Text style={styles.axisText}>-30min</Text>
            <Text style={styles.axisText}>Agora</Text>
          </View>
        </View>

        {/* Últimas leituras */}
        <ReadingList readings={recent} />
      </ScrollView>

      <PurifierButton />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14, paddingBottom: 100 },
  hero: { borderRadius: 24, padding: 20 },
  heroSub: { fontSize: 13, opacity: 0.85 },
  heroTitle: { fontSize: 26, fontWeight: '800', marginTop: 4 },
  ppmRow: { flexDirection: 'row', alignItems: 'flex-end', marginTop: 8 },
  ppmValue: { fontSize: 72, fontWeight: '900', lineHeight: 80 },
  ppmUnit: { fontSize: 22, marginBottom: 12 },
  alert: {
    flexDirection: 'row', gap: 12, backgroundColor: colors.dense, borderRadius: 20, padding: 16,
  },
  alertTitle: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  alertText: { color: '#FFF', marginTop: 4, opacity: 0.95 },
  alertActions: { flexDirection: 'row', gap: 8, marginTop: 12 },
  panel: {
    backgroundColor: colors.surface, borderRadius: 20, borderWidth: 1, borderColor: colors.border, padding: 16,
  },
  panelHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  panelTitle: { color: colors.text, fontWeight: '700' },
  panelValue: { color: colors.textMuted },
  axis: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6 },
  axisText: { color: colors.textMuted, fontSize: 11 },
});