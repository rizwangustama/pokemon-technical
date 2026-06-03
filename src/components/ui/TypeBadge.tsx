import { formatSpasi } from '@/utils/index';

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  normal:   { bg: '#F5F5F0', text: '#6D6D4E' },
  fire:     { bg: '#FEF0E7', text: '#C75221' },
  water:    { bg: '#EBF4FF', text: '#2B68B8' },
  grass:    { bg: '#EFF6F3', text: '#4E8234' },
  electric: { bg: '#FFFBE6', text: '#A89B1F' },
  ice:      { bg: '#EAF7FA', text: '#2B809B' },
  fighting: { bg: '#FDECEA', text: '#A0351E' },
  poison:   { bg: '#F7F0FA', text: '#8C3FA3' },
  ground:   { bg: '#FDF5E6', text: '#927D44' },
  flying:   { bg: '#F0EFFF', text: '#5356A3' },
  psychic:  { bg: '#FEF0F5', text: '#C94577' },
  bug:      { bg: '#F2F5E5', text: '#6B7B1F' },
  rock:     { bg: '#F5F2EA', text: '#7B6B1F' },
  ghost:    { bg: '#EDE9F5', text: '#493B77' },
  dragon:   { bg: '#EAF0FE', text: '#2D4BB8' },
  dark:     { bg: '#EDEAEA', text: '#4A3B3B' },
  steel:    { bg: '#EFEFEF', text: '#5A6A7A' },
  fairy:    { bg: '#FEF0F5', text: '#B8426B' },
  stellar:  { bg: '#E8F4FF', text: '#2B6CB0' },
  unknown:  { bg: '#F0F0F0', text: '#7A7A7A' },
};

interface TypeBadgeProps {
  typeName: string;
  size?: 'sm' | 'md';
}

export default function TypeBadge({ typeName, size = 'md' }: TypeBadgeProps) {
  const colors = TYPE_COLORS[typeName] ?? { bg: '#F0F0F0', text: '#7A7A7A' };
  const sizeClass = size === 'sm'
    ? 'text-xs py-1 px-3'
    : 'text-xs py-2 px-5';

  return (
    <span
      className={`${sizeClass} rounded font-semibold capitalize inline-block`}
      style={{ backgroundColor: colors.bg, color: colors.text }}
    >
      {formatSpasi(typeName)}
    </span>
  );
}
