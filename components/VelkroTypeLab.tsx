import React, { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_TEXT = 'Velkro Type';
const MIN_SIZE = 18;
const MAX_SIZE = 340;

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const VelkroTypeLab: React.FC = () => {
  const [text, setText] = useState('');
  const [fontSize, setFontSize] = useState(180);

  const previewRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const [bounds, setBounds] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = previewRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(entries => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setBounds({ width: rect.width, height: rect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!previewRef.current || !measureRef.current) return;
    const padding = bounds.width < 640 ? 20 : 32;
    const availableWidth = Math.max(140, previewRef.current.clientWidth - padding * 2);
    const availableHeight = Math.max(140, previewRef.current.clientHeight - padding * 2);
    const value = text.trim() || DEFAULT_TEXT;

    const measure = (size: number) => {
      const m = measureRef.current!;
      m.style.width = `${availableWidth}px`;
      m.style.fontSize = `${size}px`;
      m.textContent = value;
      const rect = m.getBoundingClientRect();
      return { w: rect.width, h: rect.height };
    };

    let low = MIN_SIZE;
    let high = MAX_SIZE;
    for (let i = 0; i < 12; i += 1) {
      const mid = (low + high) / 2;
      const { w, h } = measure(mid);
      if (w <= availableWidth && h <= availableHeight) {
        low = mid;
      } else {
        high = mid;
      }
    }
    setFontSize(Math.floor(low));
  }, [text, bounds.height, bounds.width]);

  const palette = useMemo(
    () => ({
      paper: '#f4f1ea',
      ink: '#302621',
      orange: '#e07a3f'
    }),
    []
  );

  const reset = () => {
    setText('');
    inputRef.current?.focus();
  };

  return (
    <div
      className="w-full h-full relative overflow-hidden"
      style={{
        background: palette.paper
      }}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-end px-4 md:px-6 pt-4 pb-2">
          <button
            type="button"
            onClick={reset}
            className="px-3 py-2 rounded-lg text-xs font-semibold border transition-all"
            style={{
              background: '#ffffff',
              borderColor: '#d8cdbf',
              color: palette.ink,
              boxShadow: '0 8px 16px rgba(0,0,0,0.06)'
            }}
          >
            Reset
          </button>
        </div>

        <div className="flex-1 px-4 md:px-8 pb-4 md:pb-8">
          <div
            ref={previewRef}
            className="relative w-full h-full rounded-2xl border overflow-hidden"
            style={{
              borderColor: '#e3d7c8',
              background: palette.paper,
              boxShadow: '0 18px 40px rgba(0,0,0,0.08)',
              minHeight: '320px'
            }}
            onClick={() => inputRef.current?.focus()}
          >
            <div className="absolute inset-0 flex items-center justify-center px-6 md:px-10">
              <div
                className="w-full text-center leading-[0.85] break-words"
                style={{
                  fontFamily: '"Velkro", ui-sans-serif, system-ui',
                  fontSize: `${fontSize}px`,
                  color: palette.orange,
                  textShadow: '0 6px 14px rgba(0,0,0,0.06)',
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap'
                }}
              >
                {text.trim() || DEFAULT_TEXT}
              </div>
            </div>

            <div
              ref={measureRef}
              className="absolute left-0 top-0 opacity-0 pointer-events-none"
              style={{
                position: 'absolute',
                visibility: 'hidden',
                whiteSpace: 'pre-wrap',
                textAlign: 'center',
                fontFamily: '"Velkro", ui-sans-serif, system-ui',
                lineHeight: 0.85,
                wordBreak: 'break-word'
              }}
            />
          </div>
        </div>

        <div className="px-4 md:px-8 pb-5">
          <textarea
            ref={inputRef}
            value={text}
            onChange={event => setText(event.target.value)}
            rows={2}
            className="w-full resize-none rounded-2xl px-4 py-6 md:px-6 md:py-7 text-2xl md:text-3xl border outline-none"
            style={{
              background: '#ffffff',
              borderColor: '#d8cdbf',
              color: palette.ink,
              fontFamily: '"Velkro", ui-sans-serif, system-ui',
              boxShadow: '0 12px 30px rgba(0,0,0,0.06)'
            }}
            placeholder="Type to fill the frame…"
          />
        </div>
      </div>
    </div>
  );
};

export default VelkroTypeLab;
