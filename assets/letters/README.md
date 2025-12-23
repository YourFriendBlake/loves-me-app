# Letter Images for Custom Font

## How to Add Your Letter Images

1. **Place your letter image files** in this directory (`assets/letters/`)
   - Name them with the uppercase letter: `A.png`, `B.png`, `C.png`, etc.
   - Supported formats: `.png` (recommended for transparency)

2. **Naming Convention:**
   - Uppercase letters: `A.png`, `B.png`, `C.png`, etc.
   - Numbers: `0.png`, `1.png`, `2.png`, etc.
   - If you have lowercase letters, name them: `a.png`, `b.png`, etc. (you'll need to update ImageText.tsx to map them)
   - Punctuation: `period.png`, `comma.png`, `exclamation.png`, `question.png`, etc.

3. **Image Requirements:**
   - Use PNG format with transparency for best results
   - Keep consistent sizing across all letters
   - The component will scale them proportionally

## Current Letter Images Needed

Based on the component, you need:
- All uppercase letters: A-Z
- Numbers: 0-9 (optional)
- Spaces are handled automatically (no image needed)

## Usage

The `ImageText` component will automatically use these images when rendering text. See `components/ImageText.tsx` for customization options.

