/* ═══════════════════════════════════════════════════════════════════════════
 * /industries/car-dealerships
 *
 * All copy lives in ./config.ts. All markup lives in ../_shared/*.
 * This file exists solely to wire the two together + export page metadata.
 * ═══════════════════════════════════════════════════════════════════════════ */

import IndustryPage from '../_shared/IndustryPage';
import { config } from './config';

export const metadata = config.meta;

export default function Page() {
  return <IndustryPage config={config} />;
}
