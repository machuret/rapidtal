/* ═══════════════════════════════════════════════════════════════════════════
 * /industries/commercial-real-estate
 *
 * All copy lives in ./config.ts. All markup lives in ../_shared/*.
 * This file exists solely to wire the two together + export page metadata.
 *
 * Blueprint for every future industry page:
 *   1. Copy this file into /industries/<new-slug>/page.tsx
 *   2. Copy config.ts, rewrite the IndustryConfig for the new vertical
 *   3. Done.
 * ═══════════════════════════════════════════════════════════════════════════ */

import IndustryPage from '../_shared/IndustryPage';
import { config } from './config';

export const metadata = config.meta;

export default function Page() {
  return <IndustryPage config={config} />;
}
