export default function MarqueeStrip() {
  const items = "PAID ADS ✦ CONTENT STRATEGY ✦ SEO ✦ SDRs ✦ EMAIL MARKETING ✦ SOCIAL MEDIA ✦ CRM ✦ COPYWRITING ✦ ACCOUNT MANAGEMENT ✦ GROWTH HACKING ✦ ";
  return (
    <div className="marquee-strip">
      <div className="marquee-inner">
        {items}{items}
      </div>
    </div>
  );
}
