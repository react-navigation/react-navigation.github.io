import React from 'react';
import styles from './styles.module.css';

export default function BLM() {
  return (
    <section className={styles.wrapper}>
      <div className={styles.container}>
        Black Lives Matter.{' '}
        <a
          target="_blank"
          rel="noopener"
          rel="noreferrer"
          href="https://support.eji.org/give/153413/#!/donation/checkout"
        >
          Support the Equal Justice Initiative
        </a>
        .
      </div>
    </section>
  );
}
