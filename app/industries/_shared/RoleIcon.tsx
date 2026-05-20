/* ═══════════════════════════════════════════════════════════════════════════
 * Maps a RoleIcon string key to a lucide-react icon component. Rendered
 * inside the orange .rico tile on role cards.
 *
 * Adding a new icon: extend RoleIcon in types.ts, then add the mapping here.
 * Keep the imported set small (tree-shakeable) and coherent across industries.
 * ═══════════════════════════════════════════════════════════════════════════ */

import {
  TrendingUp,
  Search,
  Smartphone,
  PenLine,
  Mail,
  Megaphone,
  BarChart3,
  Video,
  Users,
  type LucideIcon,
} from 'lucide-react';
import type { RoleIcon as RoleIconKey } from './types';

const MAP: Record<RoleIconKey, LucideIcon> = {
  'trending-up': TrendingUp,
  'search':      Search,
  'smartphone':  Smartphone,
  'pen-line':    PenLine,
  'mail':        Mail,
  'megaphone':   Megaphone,
  'chart-bar':   BarChart3,
  'video':       Video,
  'users':       Users,
};

export default function RoleIcon({
  name,
  size = 22,
}: {
  name: RoleIconKey;
  size?: number;
}) {
  const Icon = MAP[name];
  return <Icon size={size} strokeWidth={2.25} aria-hidden="true" />;
}
