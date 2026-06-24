import {ReactNode, useEffect, useState} from 'react';
import {useLocation} from '@docusaurus/router';

function HeartIcon({filled}: {filled: boolean}) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function getDocPath(): string {
  if (typeof window === 'undefined') return '';
  return window.location.pathname.replace(/\/$/, '') || '/';
}

export default function DocItemFooter(): ReactNode {
  const [liked, setLiked] = useState(false);
  const [feedback, setFeedback] = useState<'up' | 'down' | null>(null);
  const location = useLocation();

  useEffect(() => {
    const path = getDocPath();
    setLiked(localStorage.getItem(`anticloud_heart_${path}`) === 'true');
    const saved = localStorage.getItem(`anticloud_feedback_${path}`);
    setFeedback(saved as 'up' | 'down' | null);
  }, [location.pathname]);

  const toggleHeart = () => {
    const path = getDocPath();
    const next = !liked;
    setLiked(next);
    localStorage.setItem(`anticloud_heart_${path}`, String(next));
  };

  const setFeedbackValue = (val: 'up' | 'down') => {
    const path = getDocPath();
    const next = feedback === val ? null : val;
    setFeedback(next);
    if (next) {
      localStorage.setItem(`anticloud_feedback_${path}`, next);
    } else {
      localStorage.removeItem(`anticloud_feedback_${path}`);
    }
  };

  return (
    <div className="doc-reactions">
      <button className={`heart-btn${liked ? ' liked' : ''}`} onClick={toggleHeart} aria-label="Like this page">
        <HeartIcon filled={liked} />
        <span>{liked ? 'Liked' : 'Like'}</span>
      </button>
      <div className="doc-feedback">
        <span className="doc-feedback-label">Was this helpful?</span>
        <button className={`feedback-btn${feedback === 'up' ? ' selected' : ''}`} onClick={() => setFeedbackValue('up')}>
          Yes
        </button>
        <button className={`feedback-btn${feedback === 'down' ? ' selected negative' : ''}`} onClick={() => setFeedbackValue('down')}>
          No
        </button>
      </div>
    </div>
  );
}
