import React, { useEffect, useRef, useState } from 'react';

export default function ScrollReveal({
  children,
  animation = 'fade-up', // 'fade-up', 'fade-down', 'zoom-in', 'slide-right', 'slide-left'
  delay = 0,
  duration = 600,
  threshold = 0.15,
  className = '',
  style = {}
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            if (domRef.current) {
              observer.unobserve(domRef.current);
            }
          }
        });
      },
      { threshold }
    );

    const currentElement = domRef.current;
    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [threshold]);

  const getTransform = () => {
    if (isVisible) return 'none';
    switch (animation) {
      case 'fade-up':
        return 'translateY(36px)';
      case 'fade-down':
        return 'translateY(-36px)';
      case 'zoom-in':
        return 'scale(0.92)';
      case 'slide-right':
        return 'translateX(-40px)';
      case 'slide-left':
        return 'translateX(40px)';
      default:
        return 'translateY(36px)';
    }
  };

  return (
    <div
      ref={domRef}
      className={`scroll-reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: getTransform(),
        transition: `opacity ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}ms`,
        willChange: 'opacity, transform',
        ...style
      }}
    >
      {children}
    </div>
  );
}
