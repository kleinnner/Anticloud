import {ReactNode, useEffect, useState} from 'react';
import Seo from '@theme/Seo';

function BackToTopArrow() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20">
      <path d="M12 19V5M5 12l7-7 7 7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Root({children}: {children: ReactNode}): ReactNode {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, {passive: true});
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({top: 0, behavior: 'smooth'});
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const overlay = document.getElementById('anticloud-loading');
      if (overlay) {
        overlay.classList.add('hidden');
        setTimeout(() => overlay.remove(), 600);
      }
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <Seo />
      <noscript>
        <div style={{padding: '2rem', textAlign: 'center', fontFamily: 'sans-serif'}}>
          <p>Anticloud requires JavaScript to render. Please enable JavaScript in your browser.</p>
          <p>Visit <a href="https://github.com/kleinnner/Anticloud">our GitHub repository</a> for raw documentation.</p>
        </div>
      </noscript>
      {children}
      <div className={`back-to-top${showBackToTop ? ' visible' : ''}`} onClick={scrollToTop} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') scrollToTop(); }} aria-label="Back to top">
        <BackToTopArrow />
      </div>
    </>
  );
}

export default Root;
