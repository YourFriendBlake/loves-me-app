# Custom Fonts Setup

## How to Add Your Custom Font

1. **Place your font files** in this directory (`assets/fonts/`)
   - Supported formats: `.ttf`, `.otf`
   - Example: `MyCustomFont-Regular.ttf`, `MyCustomFont-Bold.ttf`

2. **Update App.tsx** to load your fonts:
   ```typescript
   const [fontsLoaded] = useFonts({
     'MyCustomFont': require('./assets/fonts/MyCustomFont-Regular.ttf'),
     'MyCustomFont-Bold': require('./assets/fonts/MyCustomFont-Bold.ttf'),
   });
   ```

3. **Use the font** in your styles:
   ```typescript
   const styles = StyleSheet.create({
     title: {
       fontFamily: 'MyCustomFont',
       fontSize: 32,
       // ... other styles
     },
   });
   ```

## Font Naming Tips

- Use descriptive names that match your font family
- Include weight/style in the name (e.g., `-Regular`, `-Bold`, `-Italic`)
- The font name you use in `fontFamily` should match the key in `useFonts()`

## Notes

- After adding fonts, you may need to restart your Expo development server
- Fonts are loaded asynchronously, so the app shows a loading indicator until fonts are ready
- Make sure font file names don't have spaces (use hyphens or underscores instead)

