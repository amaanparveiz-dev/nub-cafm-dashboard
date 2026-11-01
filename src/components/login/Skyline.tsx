import type { CSSProperties } from 'react';

/** Decorative skyline: every window is an asset, red windows need attention. */

interface Block {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cols: number;
  rows: number;
}

interface SkylineWindow {
  key: string;
  x: number;
  y: number;
  width: number;
  height: number;
  className: string;
  delay: number;
}

const BLOCKS: Block[] = [
  { id: 'l', x: 30, y: 318, w: 84, h: 112, cols: 3, rows: 5 },
  { id: 'r', x: 326, y: 262, w: 80, h: 168, cols: 3, rows: 7 },
  { id: 't', x: 118, y: 84, w: 208, h: 346, cols: 6, rows: 15 },
  { id: 'c', x: 168, y: 48, w: 108, h: 36, cols: 4, rows: 1 },
  { id: 'p', x: 14, y: 430, w: 412, h: 90, cols: 12, rows: 3 },
];
const ATTENTION = new Set(['t:10:4', 't:3:1', 'r:4:2', 'p:1:8']);
const PADDING = 9;
const GAP = 6;

/** Small seeded PRNG so the skyline looks the same on every render. */
function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildWindows(block: Block, random: () => number): SkylineWindow[] {
  const width = (block.w - PADDING * 2 - GAP * (block.cols - 1)) / block.cols;
  const height = (block.h - PADDING * 2 - GAP * (block.rows - 1)) / block.rows;
  const windows: SkylineWindow[] = [];
  for (let row = 0; row < block.rows; row += 1) {
    for (let col = 0; col < block.cols; col += 1) {
      const x = block.x + PADDING + col * (width + GAP);
      const y = block.y + PADDING + row * (height + GAP);
      const [roll, shade, jitter] = [random(), random(), random()];
      const key = `${block.id}:${row}:${col}`;
      let className = 'w';
      if (ATTENTION.has(key)) className += ' lit x';
      else if (roll < 0.58) className += ` lit ${shade < 0.7 ? 'a' : 'b'}`;
      const delay = Math.round(250 + (1 - y / 520) * 1500 + jitter * 220);
      windows.push({ key, x, y, width, height, className, delay });
    }
  }
  return windows;
}

const SKYLINE = (() => {
  const random = mulberry32(11);
  return BLOCKS.map((block) => ({ ...block, windows: buildWindows(block, random) }));
})();

export default function Skyline() {
  return (
    <svg className="sky" viewBox="0 0 440 520" preserveAspectRatio="xMidYMax meet" aria-hidden="true" focusable="false">
      <line className="mast" x1="222" y1="16" x2="222" y2="48" />
      <circle className="beacon" cx="222" cy="12" r="4" />
      {SKYLINE.map((block) => (
        <g key={block.id}>
          <rect className="blk" x={block.x} y={block.y} width={block.w} height={block.h} />
          {block.windows.map((win) => (
            <rect
              key={win.key}
              className={win.className}
              x={win.x.toFixed(1)}
              y={win.y.toFixed(1)}
              width={win.width.toFixed(1)}
              height={win.height.toFixed(1)}
              rx="1.5"
              style={{ '--d': `${win.delay}ms` } as CSSProperties}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
