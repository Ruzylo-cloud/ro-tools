'use client';

import { useEffect } from 'react';

/**
 * Scroll progress bar — matches RC implementation.
 * Desktop: 3px red bar starting after the sidebar (left: 220px), top:0.
 * Mobile (≤768px): bar below the mobile topbar (top: 56px), full width.
 * Collapses to 0 when sidebar is collapsed.
 */
export default function ScrollProgress() {
  useEffect(() => {
    const bar = document.createElement('div');
    bar.id = 'rt-scroll-progress';
    Object.assign(bar.style, {
      position: 'fixed',
      top: '0',
      left: 'var(--rt-sidebar-w, 220px)',
      right: '0',
      height: '3px',
      background: 'var(--jm-red, #EE3227)',
      zIndex: '9999',
      width: '0%',
      borderRadius: '0 2px 2px 0',
      pointerEvents: 'none',
      transition: 'width 0.1s linear',
    });
    document.body.appendChild(bar);

    // Responsive: below topbar on mobile, after sidebar on desktop
    const mq = window.matchMedia('(max-width: 768px)');
    const applyLayout = () => {
      if (mq.matches) {
        bar.style.top = 'var(--rt-topbar-h, 56px)';
        bar.style.left = '0';
      } else {
        bar.style.top = '0';
        // Adjust for sidebar collapse
        const collapsed = document.body.classList.contains('rt-sidebar-collapsed');
        bar.style.left = collapsed ? '0' : 'var(--rt-sidebar-w, 220px)';
      }
    };
    applyLayout();
    mq.addEventListener('change', applyLayout);

    // Also update left position when sidebar collapses/expands
    const observer = new MutationObserver(() => applyLayout());
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docH = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      bar.style.width = (docH > 0 ? (scrollTop / docH * 100) : 0) + '%';
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mq.removeEventListener('change', applyLayout);
      observer.disconnect();
      bar.remove();
    };
  }, []);

  return null;
}
