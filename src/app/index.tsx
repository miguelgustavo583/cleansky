import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, IconButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';

export default function ConectarDispositivo() {
  const [serial, setSerial] = useState('');
  const router = useRouter();

  async function confirmar() {
    if (!serial.trim()) return;
    await AsyncStorage.setItem('@cleansky:serial', serial.trim());
    router.replace('/(tabs)/painel');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text variant="displaySmall" style={styles.title}>Conectar{'\n'}dispositivo</Text>
        <Text style={styles.subtitle}>
          Digite o número de série ou escaneie o código para parear seu CleanSky.
        </Text>
      </View>

      <View style={styles.bottom}>
        <View style={styles.row}>
          <TextInput
            mode="flat"
            value={serial}
            onChangeText={setSerial}
            placeholder="CS-ESP32-0000"
            autoCapitalize="characters"
            style={styles.input}
            underlineStyle={{ display: 'none' }}
          />
          <IconButton
            icon="check"
            mode="contained"
            containerColor="#FFFFFF"
            iconColor="#000000"
            size={24}
            onPress={confirmar}
          />
        </View>
        <Button
          mode="contained"
          buttonColor="#FFFFFF"
          textColor="#000000"
          icon={() => <MaterialCommunityIcons name="qrcode-scan" size={18} color="#000" />}
          contentStyle={{ height: 52 }}
          onPress={() => {/* próximo passo: câmera */}}
        >
          Escanear QR Code
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, padding: 20, justifyContent: 'space-between' },
  title: { color: colors.text, fontWeight: '800', marginTop: 24 },
  subtitle: { color: colors.textMuted, marginTop: 12 },
  bottom: { gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  input: { flex: 1, backgroundColor: colors.surface, borderRadius: 14, height: 52 },
});