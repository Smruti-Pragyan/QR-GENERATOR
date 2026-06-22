/**
 * App.jsx — QR Code Generator (v3)
 *
 * Features:
 *  ✅ Input validation + character counter
 *  🌙 Dark / Light mode toggle (persisted via localStorage)
 *  📋 Copy QR image to clipboard
 *  📥 Download QR as PNG
 *  🕘 Recent QR Codes history (localStorage, max 8)
 *  🔗 URL detection → "Visit Link" button
 *  ✅ Graceful error handling + loading states
 *  ✅ Mobile-responsive
 */

import { useState, useRef, useCallback, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import {
  IconLink,
  IconQr,
  IconDownload,
  IconX,
  IconAlert,
  IconCheck,
  IconHeroes,
  IconSpinner,
  IconPlaceholderQr,
  IconCopy,
  IconSun,
  IconMoon,
  IconClock,
  IconTrash,
  IconExternalLink,
} from './icons';

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_CHARS     = 500;
const QR_SIZE       = 220;
const MAX_HISTORY   = 8;
const CONTACT_EMAIL = 'pragyan.smruti27@gmail.com';

/** Returns true only if `str` already contains an http/https protocol */
const isValidUrl = (str) => {
  try {
    const { protocol } = new URL(str);
    return protocol === 'http:' || protocol === 'https:';
  } catch { return false; }
};

/** Friendly relative-time label */
const relativeTime = (ts) => {
  const s = Math.floor((Date.now() - ts) / 1000);
  if (s < 5)  return 'Just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
};

// ── App Component ─────────────────────────────────────────────────────────────

function App() {

  // ── State ──────────────────────────────────────────────────────────────────

  const [inputValue,   setInputValue]   = useState('');
  const [qrValue,      setQrValue]      = useState('');    // committed value rendered in QR
  const [error,        setError]        = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [dlState,      setDlState]      = useState('idle');   // 'idle' | 'saving' | 'saved'
  const [copyState,    setCopyState]    = useState('idle');   // 'idle' | 'copying' | 'copied'

  /** Dark mode — init from localStorage, default true */
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem('qr-theme') !== 'light'
  );

  /** History — up to MAX_HISTORY entries, persisted in localStorage */
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('qr-history') || '[]'); }
    catch { return []; }
  });

  const qrRef = useRef(null);

  // ── Side-effects ───────────────────────────────────────────────────────────

  /** Sync theme attribute → CSS variables cascade automatically via html[data-theme] */
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    localStorage.setItem('qr-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  /** Persist history on every change */
  useEffect(() => {
    localStorage.setItem('qr-history', JSON.stringify(history));
  }, [history]);

  // ── Handlers ───────────────────────────────────────────────────────────────

  const handleInputChange = useCallback((e) => {
    setInputValue(e.target.value.slice(0, MAX_CHARS));
    setError('');
  }, []);

  /**
   * Validates and generates the QR code.
   * Accepts an optional `valueOverride` so history items can trigger generation
   * without waiting for React state to flush the inputValue update.
   */
  const handleGenerate = useCallback(async (valueOverride) => {
    const trimmed = (typeof valueOverride === 'string' ? valueOverride : inputValue).trim();
    if (!trimmed) {
      setError('Please enter a URL or text to generate a QR code.');
      setQrValue('');
      return;
    }
    setError('');
    setIsGenerating(true);
    await new Promise((r) => setTimeout(r, 400)); // brief loading state
    setQrValue(trimmed);
    setIsGenerating(false);
    setDlState('idle');
    setCopyState('idle');
    // Add to history, deduplicated, newest first
    setHistory((prev) => {
      const deduped = prev.filter((h) => h.value !== trimmed);
      return [{ value: trimmed, ts: Date.now() }, ...deduped].slice(0, MAX_HISTORY);
    });
  }, [inputValue]);

  const handleClear = useCallback(() => {
    setInputValue('');
    setQrValue('');
    setError('');
    setDlState('idle');
    setCopyState('idle');
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !isGenerating) handleGenerate();
  }, [handleGenerate, isGenerating]);

  /** Export QR canvas as a timestamped PNG file */
  const handleDownload = useCallback(async () => {
    if (!qrRef.current || dlState !== 'idle') return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    setDlState('saving');
    try {
      const url  = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href     = url;
      link.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDlState('saved');
      setTimeout(() => setDlState('idle'), 2500);
    } catch { setDlState('idle'); }
  }, [dlState]);

  /** Copy QR canvas image to clipboard using the modern Clipboard API */
  const handleCopy = useCallback(async () => {
    if (!qrRef.current || copyState !== 'idle') return;
    const canvas = qrRef.current.querySelector('canvas');
    if (!canvas) return;
    setCopyState('copying');
    try {
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopyState('copied');
      setTimeout(() => setCopyState('idle'), 2500);
    } catch { setCopyState('idle'); }
  }, [copyState]);

  /** Load a history item back into the input and immediately regenerate */
  const handleHistoryClick = useCallback((value) => {
    setInputValue(value);
    handleGenerate(value);
  }, [handleGenerate]);

  const handleClearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem('qr-history');
  }, []);

  // ── Derived values ─────────────────────────────────────────────────────────

  const charCount   = inputValue.length;
  const isOverLimit = charCount > MAX_CHARS;
  const canClear    = Boolean(inputValue || qrValue);
  const qrIsUrl     = qrValue && isValidUrl(qrValue);

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="app-wrapper">
      <main className="main-content">

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <header className="app-header">

          {/* Dark / Light mode toggle */}
          <button
            id="btn-theme-toggle"
            className="theme-toggle"
            onClick={() => setIsDark((d) => !d)}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
          >
            {isDark ? <IconSun size={18} /> : <IconMoon size={18} />}
          </button>

          <div className="header-badge">
            <span className="header-badge-dot" aria-hidden="true" />
            Instant QR Generator
          </div>
          <h1 className="app-title">QR Code Generator</h1>
          <p className="app-subtitle">
            Transform any URL or text into a scannable QR code in seconds.
          </p>
        </header>

        {/* ── Input Card ─────────────────────────────────────────────────── */}
        <section className="glass-card" aria-label="QR Code input">
          <div className="input-section">

            {/* Label + character counter */}
            <div className="input-label-row">
              <label className="input-label" htmlFor="qr-input">
                Enter URL or Text
              </label>
              <span
                className={`char-counter${
                  isOverLimit              ? ' char-counter--over' :
                  charCount > MAX_CHARS * 0.9 ? ' char-counter--warn' : ''
                }`}
                aria-live="polite"
                aria-label={`${charCount} of ${MAX_CHARS} characters`}
              >
                {charCount}/{MAX_CHARS}
              </span>
            </div>

            {/* Input field */}
            <div className="input-wrapper">
              <input
                id="qr-input"
                type="text"
                className={`text-input${error ? ' input-error' : ''}`}
                placeholder="https://github.com/username"
                value={inputValue}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                aria-describedby={error ? 'input-error-msg' : 'char-hint'}
                aria-invalid={!!error}
                aria-label="URL or text to encode as QR code"
                autoComplete="off"
                spellCheck="false"
                maxLength={MAX_CHARS}
                disabled={isGenerating}
              />
              <IconLink className="input-icon" />
            </div>

            {/* Validation error */}
            {error && (
              <div
                id="input-error-msg"
                className="error-message"
                role="alert"
                aria-live="assertive"
              >
                <IconAlert size={16} />
                {error}
              </div>
            )}

            {/* Generate + Clear */}
            <div className="btn-group">
              <button
                id="btn-generate"
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={isGenerating || isOverLimit}
                aria-busy={isGenerating}
                aria-label={isGenerating ? 'Generating QR Code…' : 'Generate QR Code'}
              >
                {isGenerating
                  ? <><IconSpinner size={18} /> Generating…</>
                  : <><IconQr size={18} /> Generate QR Code</>}
              </button>

              <button
                id="btn-clear"
                className="btn btn-clear"
                onClick={handleClear}
                disabled={!canClear || isGenerating}
                aria-label="Clear input and output"
              >
                <IconX size={16} /> Clear
              </button>
            </div>

            <span id="char-hint" className="sr-only">
              {MAX_CHARS - charCount} characters remaining
            </span>
          </div>
        </section>

        {/* ── QR Output ──────────────────────────────────────────────────── */}
        {qrValue ? (
          <>
            <div className="section-divider" aria-hidden="true">
              <div className="divider-line" />
              <span className="divider-text">Your QR Code</span>
              <div className="divider-line" />
            </div>

            {/* key forces re-mount (and re-animation) on every new value */}
            <section
              key={qrValue}
              className="glass-card qr-output-card"
              aria-label="Generated QR Code"
            >
              <div className="qr-display-area">

                {/* QR canvas — white background for scan contrast */}
                <div className="qr-canvas-wrapper" ref={qrRef}>
                  <QRCodeCanvas
                    value={qrValue}
                    size={QR_SIZE}
                    level="H"
                    includeMargin={false}
                    bgColor="#ffffff"
                    fgColor="#111827"
                  />
                </div>

                {/* Encoded value label */}
                <div className="qr-label">
                  <p className="qr-label-title">Encodes</p>
                  <p className="qr-label-value" title={qrValue}>{qrValue}</p>
                </div>

                {/* Visit Link — only shown when QR encodes a valid URL */}
                {qrIsUrl && (
                  <a
                    href={qrValue}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-visit"
                    id="btn-visit-link"
                    aria-label={`Visit ${qrValue} (opens in new tab)`}
                  >
                    <IconExternalLink size={16} />
                    Visit Link
                  </a>
                )}

                {/* Copy Image + Download PNG — side-by-side */}
                <div className="qr-actions">

                  {/* 📋 Copy to Clipboard */}
                  <button
                    id="btn-copy"
                    className={`btn btn-action${copyState === 'copied' ? ' btn-action--success' : ''}`}
                    onClick={handleCopy}
                    disabled={copyState !== 'idle'}
                    aria-busy={copyState === 'copying'}
                    aria-label={
                      copyState === 'copied'  ? 'Image copied to clipboard!' :
                      copyState === 'copying' ? 'Copying image…' :
                      'Copy QR code as image'
                    }
                  >
                    {copyState === 'copying' ? <><IconSpinner size={18} /> Copying…</>
                    : copyState === 'copied'  ? <><IconCheck   size={18} /> Copied!</>
                    : <><IconCopy size={18} /> Copy Image</>}
                  </button>

                  {/* 📥 Download PNG */}
                  <button
                    id="btn-download"
                    className={`btn btn-action${dlState === 'saved' ? ' btn-action--success' : ''}`}
                    onClick={handleDownload}
                    disabled={dlState !== 'idle'}
                    aria-busy={dlState === 'saving'}
                    aria-label={
                      dlState === 'saved'  ? 'QR code saved!' :
                      dlState === 'saving' ? 'Saving QR code…' :
                      'Download QR code as PNG'
                    }
                  >
                    {dlState === 'saving' ? <><IconSpinner size={18} /> Saving…</>
                    : dlState === 'saved'  ? <><IconCheck   size={18} /> Saved!</>
                    : <><IconDownload size={18} /> Download PNG</>}
                  </button>
                </div>

              </div>
            </section>
          </>
        ) : (
          /* Empty placeholder */
          <div className="empty-state" aria-label="QR code preview area">
            <IconPlaceholderQr className="empty-state-icon" />
            <p className="empty-state-text">Your QR Code will appear here</p>
            <p className="empty-state-hint">
              Enter any URL or text above and click "Generate QR Code"
            </p>
          </div>
        )}

        {/* ── Recent QR Codes ─────────────────────────────────────────────── */}
        {history.length > 0 && (
          <>
            <div className="section-divider" aria-hidden="true">
              <div className="divider-line" />
              <span className="divider-text">Recent</span>
              <div className="divider-line" />
            </div>

            <section className="glass-card history-section" aria-label="Recent QR Codes">

              <div className="history-header">
                <div className="history-title">
                  <IconClock size={15} />
                  Recent QR Codes
                </div>
                <button
                  className="history-clear-btn"
                  onClick={handleClearHistory}
                  aria-label="Clear all recent QR codes"
                  title="Clear history"
                >
                  <IconTrash size={13} /> Clear all
                </button>
              </div>

              <div className="history-grid" role="list">
                {history.map((item) => (
                  <button
                    key={item.ts}
                    className={`history-item${item.value === qrValue ? ' history-item--active' : ''}`}
                    onClick={() => handleHistoryClick(item.value)}
                    aria-label={`Regenerate QR for: ${item.value}`}
                    title={item.value}
                    role="listitem"
                  >
                    <div className="history-qr">
                      <QRCodeCanvas
                        value={item.value}
                        size={60}
                        level="L"
                        includeMargin={false}
                        bgColor="#ffffff"
                        fgColor="#111827"
                      />
                    </div>
                    <p className="history-value">{item.value}</p>
                    <p className="history-time">{relativeTime(item.ts)}</p>
                  </button>
                ))}
              </div>

            </section>
          </>
        )}

        {/* ── Digital Heroes CTA ─────────────────────────────────────────── */}
        <div className="dh-button-section">
          <a
            id="btn-digital-heroes"
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-digital-heroes"
            aria-label="Visit Digital Heroes website (opens in new tab)"
          >
            <IconHeroes size={18} />
            Built for Digital Heroes
          </a>
          <span className="dh-tagline">
            Empowering the next generation of digital creators
          </span>
        </div>

      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="app-footer" role="contentinfo">
        <div className="footer-inner">

          <div className="footer-contact">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="footer-email-link"
              aria-label={`Send email to ${CONTACT_EMAIL}`}
            >
              <span className="footer-email-icon" aria-hidden="true">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2"
                  strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </span>
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="footer-divider" aria-hidden="true" />

          <p className="footer-owner">
            Designed and developed by{' '}
            <span className="footer-owner-name">Smruti Pragyan</span>
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} Smruti Pragyan. All rights reserved.
          </p>

        </div>
      </footer>
    </div>
  );
}

export default App;
