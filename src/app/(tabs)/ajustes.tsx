import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { IconButton, Switch, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { colors } from '@/theme/colors';
import { useCleanSky } from '@/context/CleanSkyContext';

const GAP = 10;  // distância mínima entre os dois limites
const STEP = 10; // passo dos botões − e +

interface SliderRowProps {
  title: string;
  description: string;
  value: number;
  lower: number; // menor valor permitido
  upper: number; // maior valor permitido
  color: string;
  onCommit: (v: number) => void;
}

function SliderRow({ title, description, value, lower, upper, color, onCommit }: SliderRowProps) {
  const [shown, setShown] = useState(value);
  const [resetKey, setResetKey] = useState(0);

  // se o valor salvo mudar por fora, atualiza o número exibido
  useEffect(() => setShown(value), [value]);

  const clamp = (v: number) => Math.round(Math.min(Math.max(v, lower), upper));

  // chamado ao soltar o slider ou tocar em − / +
  function commit(v: number) {
    const final = clamp(v);
    setShown(final);
    onCommit(final);
    setResetKey((k) => k + 1); // reposiciona o slider uma única vez
  }

  return (
    <View style={styles.row}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowValue}>{shown}</Text>
      </View>
      <Text style={styles.rowDesc}>{description}</Text>

      <View style={styles.sliderLine}>
        <IconButton
          icon="minus"
          size={18}
          mode="contained-tonal"
          disabled={shown <= lower}
          onPress={() => commit(shown - STEP)}
        />
        <View style={{ flex: 1 }}>
          <Slider
            key={resetKey}
            value={value}
            minimumValue={100}
            maximumValue={1000}
            step={5}
            onValueChange={(v) => setShown(clamp(v))}
            onSlidingComplete={commit}
            minimumTrackTintColor={color}
            maximumTrackTintColor="#33333D"
            thumbTintColor="#FFFFFF"
          />
        </View>
        <IconButton
          icon="plus"
          size={18}
          mode="contained-tonal"
          disabled={shown >= upper}
          onPress={() => commit(shown + STEP)}
        />
      </View>
    </View>
  );
}

interface SwitchRowProps {
  title: string;
  description: string;
  value: boolean;
  onChange: (v: boolean) => void;
}

function SwitchRow({ title, description, value, onChange }: SwitchRowProps) {
  return (
    <View style={styles.switchRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowDesc}>{description}</Text>
      </View>
      <Switch value={value} onValueChange={onChange} color={colors.clean} />
    </View>
  );
}

export default function Ajustes() {
  const { settings, updateSettings } = useCleanSky();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <SliderRow
            title="Início de fumaça moderada"
            description="Nível analógico para iniciar o monitoramento reforçado."
            value={settings.moderateStart}
            lower={100}
            upper={settings.denseAlert - GAP}
            color={colors.moderate}
            onCommit={(v) => updateSettings({ moderateStart: v })}
          />
          <SliderRow
            title="Fumaça densa (alerta)"
            description="Ponto crítico para disparar o alerta."
            value={settings.denseAlert}
            lower={settings.moderateStart + GAP}
            upper={1000}
            color={colors.dense}
            onCommit={(v) => updateSettings({ denseAlert: v })}
          />
        </View>

        <View style={styles.card}>
          <SwitchRow
            title="Notificações push"
            description="Avisar quando o nível do ar mudar"
            value={settings.pushNotifications}
            onChange={(v) => updateSettings({ pushNotifications: v })}
          />
          <SwitchRow
            title="Limpeza automática"
            description="Ligar o purificador automaticamente quando o ar piorar"
            value={settings.autoCleaning}
            onChange={(v) => updateSettings({ autoCleaning: v })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  content: { padding: 16, gap: 14 },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    gap: 18,
  },
  row: { gap: 2 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  rowTitle: { color: colors.text, fontWeight: '700', fontSize: 15 },
  rowValue: { color: colors.text, fontWeight: '800', fontSize: 15 },
  rowDesc: { color: colors.textMuted, fontSize: 12 },
  sliderLine: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
});