import { AirLevel } from '@/types';
import { colors } from '@/theme/colors';

export const levelLabel: Record<AirLevel, string> = {
  clean: 'Ar limpo',
  moderate: 'Fumaça moderada',
  dense: 'Fumaça densa',
};

export const levelColor: Record<AirLevel, string> = {
  clean: colors.clean,
  moderate: colors.moderate,
  dense: colors.dense,
};

export function classify(
  value: number,
  limits: { moderateStart: number; denseAlert: number }
): AirLevel {
  if (value >= limits.denseAlert) return 'dense';
  if (value >= limits.moderateStart) return 'moderate';
  return 'clean';
}