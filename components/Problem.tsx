'use client';

import { useCurrency } from './CurrencyProvider';
import { formatPrice } from '@/lib/currency';

export default function Problem() {
  const { currency } = useCurrency();
  const sym = currency === 'USD' ? 'US$' : 'AU$';
  const lowSalary = currency === 'USD' ? '45' : '70';
  const highSalary = currency === 'USD' ? '78' : '120';
  const agencyCost = formatPrice(4000, currency);

  return (
    <section className="problem reveal">
      <div className="problem-inner">
      <div>
        <span className="section-label">— The Real Problem</span>
        <h2 className="section-heading">YOU&#39;RE PAYING<br /><em>4X TOO MUCH</em><br />FOR AVERAGE.</h2>
      </div>
      <div>
        <div className="problem-body">
          <p>Local marketing hires in Australia cost {sym}{lowSalary}–{highSalary}K per year — <strong>before super, leave, and hidden overheads.</strong> And half of them aren&#39;t delivering pipeline.</p>
          <p>Meanwhile, elite Filipino marketers and salespeople with international client experience are available <strong>right now, for a fraction of the cost.</strong> They&#39;re not &#34;cheap.&#34; They&#39;re efficient, battle-tested, and ready to generate revenue from day one.</p>
          <p>The difference? You just haven&#39;t been hiring them <strong>directly.</strong></p>
        </div>
        <div className="problem-callout">
          Stop paying an agency <em>{agencyCost}/month</em> to be the middleman between you and someone brilliant.
        </div>
      </div>
      </div>
    </section>
  );
}
