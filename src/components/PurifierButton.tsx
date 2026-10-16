import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useCleanSky } from '@/context/CleanSkyContext';

export function PurifierButton() {
  const { purifierOn, togglePurifier } = useCleanSky();

  return (
    <Button
      mode="contained"
      icon={purifierOn ? 'pause' : 'play'}
      buttonColor="#F2F2F2"
      textColor="#111111"
      style={styles.fab}
      contentStyle={{ height: 48 }}
      onPress={togglePurifier}
    >
      {purifierOn ? 'Desligar purificador' : 'Ligar purificador'}
    </Button>
  );
}

const styles = StyleSheet.create({
  fab: { position: 'absolute', right: 16, bottom: 16, elevation: 6 },
});