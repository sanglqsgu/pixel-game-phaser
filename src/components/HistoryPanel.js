import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getGameHistory, clearGameHistory } from '../Phaser/src/Game/gameHistory';
import { emit, on } from '../Phaser/src/Game/gameEvents';

const ITEM_LABELS = {
  'random-ob': 'Búa',
  'random-ob1': 'Rìu',
  'random-ob2': 'Kiếm',
  'random-ob3': 'Khiên',
  'random-ob4': 'Mũ',
};

const BASE = process.env.PUBLIC_URL || '';
const ITEM_ICONS = {
  'random-ob': `${BASE}/assets/tiled/ob.png`,
  'random-ob1': `${BASE}/assets/tiled/ob1.png`,
  'random-ob2': `${BASE}/assets/tiled/ob2.png`,
  'random-ob3': `${BASE}/assets/tiled/ob3.png`,
  'random-ob4': `${BASE}/assets/tiled/ob4.png`,
};

export default function HistoryPanel() {
  const [visible, setVisible] = useState(false);
  const [history, setHistory] = useState([]);
  const [selected, setSelected] = useState(0);
  const [canvasSize, setCanvasSize] = useState(0);

  const panelRef = useRef(null);
  const closeBtnRef = useRef(null);

  const hide = useCallback(() => {
    setVisible(false);
    emit('hide-history');
  }, []);

  const clear = useCallback(() => {
    clearGameHistory();
    setHistory([]);
  }, []);

  const prevEntry = useCallback(() => {
    setSelected((s) => Math.max(0, s - 1));
  }, []);

  const nextEntry = useCallback(() => {
    setSelected((s) => Math.min(history.length - 1, s + 1));
  }, [history.length]);

  // Listen for show-history event
  useEffect(() => {
    const unsub = on('show-history', () => {
      setHistory(getGameHistory());
      setSelected(0);
      const canvas = document.querySelector('#phaser-parent canvas');
      if (canvas) {
        setCanvasSize(canvas.width);
      } else {
        const dim = Math.min(window.innerWidth, window.innerHeight);
        setCanvasSize(dim * 0.8);
      }
      setVisible(true);
    });
    return unsub;
  }, []);

  // Focus close button when panel opens
  useEffect(() => {
    if (visible && closeBtnRef.current) {
      var btn = closeBtnRef.current;
      var timer = setTimeout(function () {
        if (btn) btn.focus();
      }, 50);
      return function () { clearTimeout(timer); };
    }
  }, [visible]);

  // Focus trap + Escape key
  useEffect(() => {
    if (!visible || !panelRef.current) return;

    const panel = panelRef.current;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        hide();
        return;
      }

      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevEntry();
        return;
      }

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextEntry();
        return;
      }

      if (e.key === 'Tab') {
        const focusable = panel.querySelectorAll(
          'button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [visible, hide, prevEntry, nextEntry]);

  // Prevent body scroll when overlay is open
  useEffect(() => {
    if (visible) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [visible]);

  if (!visible) return null;

  const entry = history[selected];

  return (
    <div
      className="history-overlay"
      role="presentation"
      onClick={hide}
    >
      <div
        ref={panelRef}
        className="history-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
        onClick={(e) => e.stopPropagation()}
        style={canvasSize ? { width: canvasSize, height: canvasSize } : {}}
      >
        <div className="history-header">
          <h2 id="history-title">LỊCH SỬ</h2>
          {history.length > 0 && (
            <span className="history-count" aria-live="polite">
              {selected + 1} / {history.length}
            </span>
          )}
        </div>

        {history.length === 0 ? (
          <div className="history-empty" role="status">
            <p>Chưa có dữ liệu</p>
          </div>
        ) : (
          <>
            <div className="history-entry-header">
              <span className="entry-date">
                {new Date(entry.date).toLocaleDateString('vi-VN', {
                  day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit',
                })}
              </span>
              <span className="entry-total">
                Tổng: {entry.totalTime}s
              </span>
            </div>

            <div className="history-table" role="table" aria-label="Kết quả từng màn chơi">
              <div className="table-header" role="row">
                <span className="col-level" role="columnheader">Màn</span>
                <span className="col-items" role="columnheader">Vật phẩm</span>
                <span className="col-time" role="columnheader">Giờ</span>
              </div>
              <div className="table-body" role="rowgroup">
                {(entry.levelResults || []).map((lvl, i) => (
                  <div
                    key={i}
                    className={`table-row${i % 2 === 0 ? ' table-row--even' : ''}`}
                    role="row"
                  >
                    <span className="col-level" role="cell">
                      <span className="lvl-num">M{lvl.level}</span>
                      <span className="lvl-size">{lvl.gridSize}&times;{lvl.gridSize}</span>
                    </span>
                    <span className="col-items" role="cell">
                      {lvl.items.length === 0 ? (
                        <span className="no-items">&mdash;</span>
                      ) : (
                        lvl.items.map((key) => (
                          <span key={key} className="item-badge">
                            <img
                              src={ITEM_ICONS[key]}
                              alt={ITEM_LABELS[key] || key}
                              className="item-icon"
                            />
                            {ITEM_LABELS[key] || key}
                          </span>
                        ))
                      )}
                    </span>
                    <span className="col-time" role="cell">{lvl.time}s</span>
                  </div>
                ))}
              </div>
            </div>

            <nav className="history-nav" aria-label="Điều hướng lịch sử">
              <button
                className="nav-btn"
                disabled={selected <= 0}
                onClick={prevEntry}
                aria-label="Bản ghi trước"
              >
                &larr; Trước
              </button>
              <button
                className="nav-btn"
                disabled={selected >= history.length - 1}
                onClick={nextEntry}
                aria-label="Bản ghi sau"
              >
                Sau &rarr;
              </button>
            </nav>
          </>
        )}

        <div className="history-actions">
          {history.length > 0 && (
            <button
              className="btn btn--danger"
              onClick={clear}
            >
              Xoá lịch sử
            </button>
          )}
          <button
            ref={closeBtnRef}
            className="btn btn--primary"
            onClick={hide}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
