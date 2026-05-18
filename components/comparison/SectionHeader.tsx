import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  tag: string;
  title: string | React.ReactNode;
}

export default function SectionHeader({ tag, title }: SectionHeaderProps) {
  return (
    <div className={styles.header}>
      <div className={styles.tag}>
        <span className={styles.tagLine}></span>
        {tag}
      </div>
      <h2 className={styles.title}>{title}</h2>
    </div>
  );
}
