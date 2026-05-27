/**
 * MarketingLayout — wraps all marketing pages (not the portal).
 * Explicitly sets a white/light context so the portal's dark body never leaks in.
 */
export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        background: '#ffffff',
        color: '#1a1a1a',
        isolation: 'isolate',
      }}
    >
      {children}
    </div>
  );
}
