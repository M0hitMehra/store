import { useEffect } from 'react';

function useScrollAnimation() {
  useEffect(() => {
    const handleScroll = () => {
      const elements = document.querySelectorAll('.scroll-appear-animations');
      elements.forEach((element) => {
        const rect = element.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          element.classList.add('scroll-visible');
        } else {
          element.classList.remove('scroll-visible');
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
}

export default useScrollAnimation;
