import { useDoc } from '@docusaurus/plugin-content-docs/client';
import { useEffect, useRef, useState } from 'react';
import styles from './styles.module.css';

const ACTIONS = [
  { label: 'Copy Markdown', value: 'copy' },
  { label: 'Open in ChatGPT', value: 'chatgpt', href: 'https://chatgpt.com' },
  { label: 'Open in Claude', value: 'claude', href: 'https://claude.ai/new' },
] as const;

type ActionType = (typeof ACTIONS)[number];

export function CopyButton() {
  const { frontMatter } = useDoc();

  const markdown =
    'rawMarkdown' in frontMatter && typeof frontMatter.rawMarkdown === 'string'
      ? frontMatter.rawMarkdown
      : null;

  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', onClickOutside);

    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [isOpen]);

  const onClose = () => {
    setIsOpen(false);

    buttonRef.current?.focus();
  };

  const onAnimationEnd = () => {
    if (!isOpen) {
      setIsVisible(false);
    }
  };

  const onAction = (action: ActionType) => {
    const prompt = `Read from ${window.location.href} so I can ask questions about it.`;

    switch (action.value) {
      case 'copy':
        if (markdown) {
          navigator.clipboard.writeText(markdown).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          });
        }

        break;
      case 'chatgpt':
      case 'claude':
        window.open(
          `${action.href}?q=${encodeURIComponent(prompt)}`,

          '_blank'
        );

        break;
    }

    onClose();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!isOpen || !dropdownRef.current) {
      return;
    }

    const items = Array.from(dropdownRef.current.querySelectorAll('button'));
    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement
    );

    switch (event.key) {
      case 'Escape':
        event.preventDefault();

        onClose();

        break;
      case 'ArrowUp':
      case 'ArrowDown':
        event.preventDefault();

        const nextIndex =
          event.key === 'ArrowDown'
            ? (currentIndex + 1) % items.length
            : currentIndex === -1
              ? items.length - 1
              : (currentIndex - 1 + items.length) % items.length;

        items[nextIndex]?.focus();

        break;
    }
  };

  const onButtonClick = () => {
    if (isOpen) {
      setIsOpen(false);
    } else {
      setIsOpen(true);
      setIsVisible(true);
    }
  };

  if (!markdown) {
    return null;
  }

  return (
    <div className={styles.container} ref={containerRef} onKeyDown={onKeyDown}>
      <button
        ref={buttonRef}
        type="button"
        onClick={onButtonClick}
        className={styles.button}
        title="Copy page"
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <span className={styles.iconContainer}>
          <svg
            className={`${styles.icon} ${copied ? styles.visible : styles.hidden}`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>

          <svg
            className={`${styles.icon} ${copied ? styles.hidden : styles.visible}`}
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />

            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
        </span>
        Copy page
        <svg
          className={`${styles.chevron} ${isOpen ? styles.open : ''}`}
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isVisible && (
        <div
          ref={dropdownRef}
          className={`${styles.dropdown} ${!isOpen ? styles.closing : ''}`}
          onAnimationEnd={onAnimationEnd}
          role="menu"
        >
          {ACTIONS.map((action) => (
            <button
              key={action.value}
              type="button"
              className={styles.item}
              onClick={() => onAction(action)}
              onMouseEnter={(e) => e.currentTarget.focus()}
              role="menuitem"
              tabIndex={-1}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
