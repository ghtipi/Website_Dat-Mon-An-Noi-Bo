import { useEffect, useState } from 'react';

type TypingEffectReturn = string;

interface TypingOptions {
  text: string;
  speed?: number;
  delay?: number;
  loop?: boolean;
  active?: boolean;
}

export default function useTypingEffect({
  text,
  speed = 100,
  delay = 1000,
  loop = true,
  active = true,
}: TypingOptions): TypingEffectReturn {
  const [placeholder, setPlaceholder] = useState('');
  const [i, setI] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!active) return;

    let timeout: ReturnType<typeof setTimeout>;

    const type = () => {
      const updated = isDeleting
        ? text.slice(0, i - 1)
        : text.slice(0, i + 1);
      setPlaceholder(updated);

      if (!isDeleting && i >= text.length) {
        if (loop) {
          setIsDeleting(true);
          timeout = setTimeout(type, delay);
        }
      } else if (isDeleting && i <= 0) {
        if (loop) {
          setIsDeleting(false);
          timeout = setTimeout(type, delay);
        }
      } else {
        timeout = setTimeout(() => {
          setI(prev => prev + (isDeleting ? -1 : 1));
        }, speed);
      }
    };

    timeout = setTimeout(type, speed);
    return () => clearTimeout(timeout);
  }, [i, isDeleting, active, loop, text]);

  return placeholder;
}
