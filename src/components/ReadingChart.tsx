import { useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Svg, { Circle, Line, Polyline } from 'react-native-svg';
import { colors } from '@/theme/colors';

interface Props {
  values: number[];
  height?: number;
}

export function ReadingChart({ values, height = 90 }: Props) {
  const [width, setWidth] = useState(0);
  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  if (values.length < 2) return <View style={{ height }} onLayout={onLayout} />;

  const pad = 8;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((v, i) => {
    const x = pad + (i / (values.length - 1)) * (width - pad * 2);
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return { x, y };
  });
  const last = points[points.length - 1];

  return (
    <View style={{ height }} onLayout={onLayout}>
      {width > 0 && (
        <Svg width={width} height={height}>
          <Line x1={last.x} y1={0} x2={last.x} y2={height} stroke={colors.textMuted} strokeDasharray="3 4" />
          <Polyline
            points={points.map((p) => `${p.x},${p.y}`).join(' ')}
            fill="none"
            stroke="#5B8DEF"
            strokeWidth={2}
          />
          <Circle cx={last.x} cy={last.y} r={4} fill="#5B8DEF" />
        </Svg>
      )}
    </View>
  );
}