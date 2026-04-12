import styles from './RoleDescription.module.css';

interface RoleDescriptionData {
  intro: string[];
  tasks: string[];
  tools: string[];
  bottomLine: string;
}

interface RoleDescriptionProps {
  roleTitle: string;
  roleDescription: RoleDescriptionData;
}

export default function RoleDescription({ roleTitle, roleDescription }: RoleDescriptionProps) {
  return (
    <section className={styles.section}>
      <div className={styles.sectionLabel}>The Role Explained</div>
      <h2 className={styles.sectionHeading}>
        WHAT DOES A {roleTitle.toUpperCase()}<br /><em>ACTUALLY DO?</em>
      </h2>

      <div className={styles.roleGrid}>
        <div className={styles.roleContent}>
          {roleDescription.intro.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </div>

        <div className={styles.roleSidebar}>
          <div className={styles.taskCard}>
            <div className={styles.taskCardTitle}>Typical Weekly Tasks</div>
            <div className={styles.taskList}>
              {roleDescription.tasks.map((task, i) => (
                <div key={i} className={styles.taskItem}>
                  <div className={styles.taskCheck}>✓</div>
                  {task}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.toolsCard}>
            <div className={styles.toolsTitle}>Tools They Work In</div>
            <div className={styles.toolsList}>
              {roleDescription.tools.map((tool, i) => (
                <span key={i} className={styles.toolTag}>{tool}</span>
              ))}
            </div>
          </div>

          <div className={styles.bottomLineCard}>
            <div className={styles.bottomLineTitle}>The Bottom Line</div>
            <p>{roleDescription.bottomLine}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
