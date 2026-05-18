'use client';

import { useState } from 'react';
import styles from './SkillsGrid.module.css';

interface SkillsGridProps {
  roleTitle: string;
  skills: string[];
}

export default function SkillsGrid({ roleTitle, skills }: SkillsGridProps) {
  const [showAll, setShowAll] = useState(false);
  
  // Group skills into categories
  const categories = [
    { name: 'Core Technical Skills', skills: skills.slice(0, 6) },
    { name: 'Tools & Platforms', skills: skills.slice(6, 12) },
    { name: 'Advanced Capabilities', skills: skills.slice(12) }
  ];
  
  const displayedSkills = showAll ? skills : skills.slice(0, 8);
  
  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>What a Rapid Tal {roleTitle} Can Do</div>
      <h2 className={styles.sectionHeading}>
        THE SKILLS<br /><em>YOU'RE HIRING.</em>
      </h2>
      <div className={styles.skillsGrid}>
        {displayedSkills.map((skill, i) => (
          <div key={i} className={styles.skillItem}>
            <div className={styles.skillCheck}>✓</div>
            <div className={styles.skillName}>{skill}</div>
          </div>
        ))}
      </div>
      {skills.length > 8 && (
        <button 
          className={styles.showMoreBtn}
          onClick={() => setShowAll(!showAll)}
        >
          {showAll ? 'Show Less' : `View All ${skills.length} Skills`}
        </button>
      )}
    </section>
  );
}
