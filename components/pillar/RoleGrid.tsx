'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface Role {
  title: string;
  slug: string;
  saving: string;
}

interface RoleGridProps {
  roles: Role[];
}

export default function RoleGrid({ roles }: RoleGridProps) {
  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)',
      background: 'var(--black)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: 'clamp(40px, 5vw, 60px)',
            fontFamily: 'var(--font-barlow)',
            textTransform: 'uppercase',
            color: 'var(--white)'
          }}>
            COMPARE <span style={{ color: 'var(--orange)' }}>ALL ROLES</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 'clamp(20px, 3vw, 30px)'
          }}>
            {roles.map((role, index) => (
              <motion.div
                key={role.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link
                  href={`/hire-${role.slug}`}
                  style={{
                    display: 'block',
                    padding: 'clamp(24px, 3vw, 32px)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    height: '100%',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'var(--orange)';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    gap: '16px'
                  }}>
                    <h3 style={{
                      fontSize: 'clamp(18px, 2vw, 22px)',
                      fontWeight: '700',
                      lineHeight: '1.3',
                      color: 'var(--white)',
                      fontFamily: 'var(--font-barlow)',
                      flex: 1
                    }}>
                      {role.title}
                    </h3>
                    
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ opacity: 0.5, flexShrink: 0 }}
                    >
                      <path
                        d="M4 10H16M16 10L10 4M16 10L10 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 16px',
                    background: 'rgba(255, 107, 0, 0.1)',
                    border: '1px solid rgba(255, 107, 0, 0.3)',
                    borderRadius: '4px'
                  }}>
                    <span style={{
                      fontSize: '14px',
                      fontWeight: '700',
                      color: 'var(--orange)',
                      fontFamily: 'var(--font-barlow)',
                      letterSpacing: '0.05em'
                    }}>
                      SAVE {role.saving}
                    </span>
                  </div>

                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'var(--font-dm-sans)',
                    marginTop: '16px'
                  }}>
                    View full cost comparison →
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
