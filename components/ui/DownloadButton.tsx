'use client';

import { useState } from 'react';

interface DownloadButtonProps {
  targetId: string;
  filename: string;
  label?: string;
  className?: string;
}

export default function DownloadButton({
  targetId,
  filename,
  label = 'Download as Image',
  className,
}: DownloadButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const element = document.getElementById(targetId);
      if (!element) return;

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
      });

      const link = document.createElement('a');
      link.download = filename;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={
        className ||
        'px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-[#FF6EC7] to-[#7B61FF] text-white hover:opacity-90 hover:scale-105 transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2'
      }
    >
      {loading ? (
        <>
          <span className="animate-spin">⏳</span> Generating...
        </>
      ) : (
        <>⬇️ {label}</>
      )}
    </button>
  );
}
