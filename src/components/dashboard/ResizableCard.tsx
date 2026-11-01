import { useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from 'react';
import type { CardSize } from '../../types';

const COLUMNS = 12;
const GAP = 14;
const MIN_SPAN = 3;
const MIN_HEIGHT = 120;
const NARROW_GRID_WIDTH = 900; // below this the grid collapses and width is not resizable
const KEY_STEP = 20;
const EDGE_HANDLES = ['n', 's', 'e', 'w', 'ne', 'nw', 'sw'];

const clampSpan = (span: number): number => Math.max(MIN_SPAN, Math.min(COLUMNS, span));

/** Smallest height that still fits the card's content. */
function getNaturalHeight(card: HTMLElement): number {
  const { height, alignSelf } = card.style;
  card.style.height = 'auto';
  card.style.alignSelf = 'start';
  const natural = Math.ceil(card.getBoundingClientRect().height);
  card.style.height = height;
  card.style.alignSelf = alignSelf;
  return Math.max(natural, MIN_HEIGHT);
}

/**
 * Grid card that can be resized by dragging any edge/corner (width snaps to the
 * 12-column grid, height is free), with arrow keys on the corner grip, and reset
 * with double-click / Escape.
 */
interface ResizableCardProps {
  id: string;
  defaultSpan: number;
  size?: CardSize;
  className?: string;
  onResize: (id: string, patch: CardSize) => void;
  onReset: (id: string) => void;
  children: ReactNode;
}

export default function ResizableCard({
  id, defaultSpan, size = {}, className = '', onResize, onReset, children,
}: ResizableCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const [dragLabel, setDragLabel] = useState<string | null>(null);
  const span = size.span ?? defaultSpan;

  const startResize = (direction: string) => (event: PointerEvent<HTMLElement>) => {
    event.preventDefault();
    const handle = event.currentTarget;
    const card = cardRef.current;
    const grid = card?.parentElement;
    if (!card || !grid) return;
    const isNarrow = grid.clientWidth <= NARROW_GRID_WIDTH;
    const columnWidth = (grid.clientWidth - GAP * (COLUMNS - 1)) / COLUMNS;
    const start = card.getBoundingClientRect();
    const minHeight = getNaturalHeight(card);
    const [startX, startY] = [event.clientX, event.clientY];
    const dx = direction.includes('e') ? 1 : direction.includes('w') ? -1 : 0;
    const dy = direction.includes('s') ? 1 : direction.includes('n') ? -1 : 0;

    handle.setPointerCapture(event.pointerId);
    setActiveHandle(direction);
    document.body.classList.add('rzdrag');

    const onMove = (moveEvent: globalThis.PointerEvent) => {
      const patch: CardSize = {};
      if (dx && !isNarrow) {
        const width = start.width + dx * (moveEvent.clientX - startX);
        patch.span = clampSpan(Math.round((width + GAP) / (columnWidth + GAP)));
      }
      if (dy) patch.height = Math.round(Math.max(minHeight, start.height + dy * (moveEvent.clientY - startY)));
      onResize(id, patch);

      const height = patch.height ?? Math.round(size.height ?? start.height);
      setDragLabel(isNarrow ? `${height}px` : `${patch.span ?? span}/${COLUMNS} · ${height}px`);
    };
    const stop = () => {
      handle.removeEventListener('pointermove', onMove);
      handle.removeEventListener('pointerup', stop);
      handle.removeEventListener('pointercancel', stop);
      document.body.classList.remove('rzdrag');
      setActiveHandle(null);
      setDragLabel(null);
    };
    handle.addEventListener('pointermove', onMove);
    handle.addEventListener('pointerup', stop);
    handle.addEventListener('pointercancel', stop);
  };

  const handleGripKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const card = cardRef.current;
    if (!card) return;
    const height = size.height ?? card.getBoundingClientRect().height;
    const reset = () => onReset(id);
    const actions: Record<string, () => void> = {
      ArrowRight: () => onResize(id, { span: clampSpan(span + 1) }),
      ArrowLeft: () => onResize(id, { span: clampSpan(span - 1) }),
      ArrowDown: () => onResize(id, { height: height + KEY_STEP }),
      ArrowUp: () => onResize(id, { height: Math.max(getNaturalHeight(card), height - KEY_STEP) }),
      Escape: reset,
      Delete: reset,
      Backspace: reset,
    };
    const action = actions[event.key];
    if (action) {
      event.preventDefault();
      action();
    }
  };

  const classes = ['rz', className, span >= 8 && 'big', activeHandle && 'rzing'].filter(Boolean).join(' ');

  return (
    <section
      ref={cardRef}
      className={classes}
      style={{ '--cs': span, height: size.height ? `${size.height}px` : undefined } as CSSProperties}
    >
      {children}
      <button
        type="button"
        className="rzg"
        aria-label="Resize card. Drag any edge or corner, or use arrow keys on this handle. Double-click to reset."
        title="Drag to resize · double-click to reset"
        onPointerDown={startResize('se')}
        onDoubleClick={() => onReset(id)}
        onKeyDown={handleGripKeyDown}
      />
      {EDGE_HANDLES.map((direction) => (
        <div
          key={direction}
          className={`rzh ${direction}${activeHandle === direction ? ' act' : ''}`}
          aria-hidden="true"
          onPointerDown={startResize(direction)}
          onDoubleClick={() => onReset(id)}
        />
      ))}
      {dragLabel && <div className="rzlbl">{dragLabel}</div>}
    </section>
  );
}
