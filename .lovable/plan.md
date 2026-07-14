Implement the selected "Diagonal streak shine" headline effect on the "We Build Brands That Scale." heading while keeping the existing robot unchanged.

What we'll do
- Update the existing `text-shine` CSS utility in `src/styles.css` so the shine gradient moves diagonally (120deg) instead of horizontally, with a sharper streak and 4s linear loop.
- Keep the underlying hero title gradient (`var(--gradient-hero-title)`) so the text remains fully readable when the shine is not sweeping across.
- Leave the robot markup, filters, and position exactly as-is.
- Verify the heading renders correctly on both mobile and desktop.

Files changed
- `src/styles.css` — update `@keyframes text-shine` and `@utility text-shine` to the diagonal streak treatment.

No other files will be modified. No new dependencies needed.