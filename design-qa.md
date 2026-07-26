# Dark Mode Design QA

## Comparison target

- Source visual truth:
  - `/var/folders/l2/hs_3m4zd08d89jp_dzj2fqmw0000gn/T/TemporaryItems/NSIRD_screencaptureui_9fZN82/Screenshot 2026-07-26 at 10.58.52.png`
  - `/var/folders/l2/hs_3m4zd08d89jp_dzj2fqmw0000gn/T/TemporaryItems/NSIRD_screencaptureui_9iI9kt/Screenshot 2026-07-26 at 10.59.14.png`
- Rendered implementation and combined comparisons:
  - `docs/design-qa/dark-mode-course-access-codes.webp` (source at left, rendered implementation at right)
  - `docs/design-qa/dark-mode-learner-course-cards.webp` (source at left, rendered implementation at right)
- State: dark mode, administrator people workspace, learner assignment editor open.
- Browser viewport: 1280 × 720 CSS pixels at device pixel ratio 2. Browser captures were normalized to 1280 × 720 output pixels.
- Source pixels: 2330 × 918 and 1024 × 1766. Source density was not declared, so the comparisons normalize each focused region into a common display box instead of asserting pixel-for-pixel scale.
- Implementation pixels: 1280 × 720 for each browser capture.

## Findings

No actionable P0, P1, or P2 differences remain for the reported dark-mode defects.

- Fonts and typography: existing families, weights, hierarchy, and wrapping are unchanged.
- Spacing and layout rhythm: component dimensions, padding, gaps, radii, and responsive layout are unchanged.
- Colors and visual tokens: the access-code panel, course cards, inputs, labels, group headings, and status selectors now use the established dark surface, ink, border, and accent tokens.
- Image quality and asset fidelity: these controls contain no image assets.
- Copy and content: all labels, help text, course names, and actions remain unchanged.

## Comparison evidence

- Full-view comparison: the rendered administrator workspace stays consistently dark; no light panel breaks the page hierarchy.
- Focused access-code comparison: the formerly light gray manager is now `rgb(15, 25, 42)` with `rgb(244, 248, 255)` text and a subdued dark border.
- Focused course-card comparison: enabled and disabled cards remain distinguishable without white outer surfaces; headings use the brighter dark-mode accent and controls retain readable contrast.
- Primary interaction tested: opened the learner assignment editor and focused its selects and course controls.
- Browser log check: no errors; only Vite connection and hot-update debug messages.

## Comparison history

1. Initial user evidence showed a P1 dark-mode mismatch: light access-code and course-card surfaces dominated otherwise dark pages.
2. The first rendered pass fixed the course cards but exposed a remaining P1 in the access-code panel: its scoped dark selector compiled without the component qualifier, leaving the root at `rgba(255, 255, 255, 0.88)`.
3. The selector was corrected, the page was reloaded, and the post-fix capture confirmed the access-code root at `rgb(15, 25, 42)` with the intended dark text and border tokens. The focused comparisons show no remaining light-surface mismatch.

## Follow-up polish

None required for this fix.

final result: passed
