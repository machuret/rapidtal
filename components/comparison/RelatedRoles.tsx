'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

interface RelatedRole {
  title: string;
  slug: string;
  saving: string;
}

interface RelatedRolesProps {
  roles: RelatedRole[];
  category: string;
}

export default function RelatedRoles({ roles, category }: RelatedRolesProps) {
  return (
    <section style={{
      padding: 'clamp(60px, 8vw, 100px) clamp(20px, 4vw, 60px)',
      background: 'var(--black)',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p style={{
            fontSize: 'clamp(12px, 1.5vw, 14px)',
            fontWeight: '600',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--orange)',
            marginBottom: '20px',
            fontFamily: 'var(--font-barlow)'
          }}>
            More {category} Cost Comparisons
          </p>
          
          <h2 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: '800',
            lineHeight: '1.1',
            marginBottom: 'clamp(40px, 5vw, 60px)',
            fontFamily: 'var(--font-barlow)',
            textTransform: 'uppercase',
            color: 'var(--white)'
          }}>
            COMPARE MORE <span style={{ color: 'var(--orange)' }}>ROLES</span>
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(20px, 3vw, 30px)'
          }}>
            {roles.map((role, index) => (
              <motion.div
                key={role.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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
                    height: '100%'
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px'
                  }}>
                    <span style={{
                      fontSize: '12px',
                      fontWeight: '700',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: 'var(--orange)',
                      fontFamily: 'var(--font-barlow)'
                    }}>
                      Save {role.saving}
                    </span>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      style={{ opacity: 0.5 }}
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
                  
                  <h3 style={{
                    fontSize: 'clamp(18px, 2vw, 22px)',
                    fontWeight: '700',
                    lineHeight: '1.3',
                    color: 'var(--white)',
                    fontFamily: 'var(--font-barlow)',
                    marginBottom: '12px'
                  }}>
                    {role.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontFamily: 'var(--font-dm-sans)'
                  }}>
                    Compare Australia vs Philippines costs →
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
