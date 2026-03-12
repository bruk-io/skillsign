/**
 * SkillSign pixel logo — magnifying glass inspecting "MD".
 *
 * Finds all <bh-pixel-display class="site-logo"> elements,
 * sets cols/rows/data so the logo renders automatically.
 */

const P = 1, G = 2, _ = 0;

const LOGO_COLS = 14;
const LOGO_ROWS = 14;

// Magnifying glass with "MD" inside the lens
// Lens rim + handle = primary (1), "MD" text = success/green (2)
const LOGO_GRID = [
  [_,_,_,P,P,P,P,P,_,_,_,_,_,_],
  [_,_,P,_,_,_,_,_,P,_,_,_,_,_],
  [_,P,_,_,_,_,_,_,_,P,_,_,_,_],
  [P,_,_,G,_,G,_,G,G,_,P,_,_,_],  // M:1_1  D:11_
  [P,_,_,G,G,G,_,G,_,G,P,_,_,_],  // M:111  D:1_1
  [P,_,_,G,_,G,_,G,_,G,P,_,_,_],  // M:1_1  D:1_1
  [P,_,_,G,_,G,_,G,_,G,P,_,_,_],  // M:1_1  D:1_1
  [P,_,_,G,_,G,_,G,G,_,P,_,_,_],  // M:1_1  D:11_
  [_,P,_,_,_,_,_,_,_,P,_,_,_,_],
  [_,_,P,_,_,_,_,_,P,P,_,_,_,_],  // handle starts
  [_,_,_,P,P,P,P,P,_,_,P,_,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,P,_,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,P,_],
  [_,_,_,_,_,_,_,_,_,_,_,_,_,_],
];

const LOGO_DATA = new Uint8Array(LOGO_GRID.flat());

customElements.whenDefined('bh-pixel-display').then(() => {
  for (const el of document.querySelectorAll('.site-logo')) {
    el.cols = LOGO_COLS;
    el.rows = LOGO_ROWS;
    el.data = LOGO_DATA;
  }
});
