# Testing the Pagination Engine

## Quick Start Testing

### 1. Run the Demo Application

```bash
npm run dev
```

Then open http://localhost:5173/ in your browser.

### 2. What You Should See

- **Control Panel** at the top with dropdowns and sliders
- **Multiple pages** rendered below with borders
- **Page numbers** in the footer of each page
- **Sample content** including text, lists, tables, and code blocks

## Testing Checklist

### ✅ Basic Functionality

- [ ] Pages render with visible borders
- [ ] Content is distributed across multiple pages
- [ ] Headers show "Pagination Engine Demo"
- [ ] Footers show page numbers (e.g., "1", "2", "3")
- [ ] Can scroll to see all pages

### ✅ Page Configuration

- [ ] **Page Size**: Change to Letter, Legal, A3 - pages resize
- [ ] **Orientation**: Switch to Landscape - pages rotate
- [ ] **Scale**: Adjust slider - pages zoom in/out
- [ ] Changes are applied immediately

### ✅ View Modes

- [ ] **All Pages**: Shows all pages stacked vertically
- [ ] **Single Page**: Shows one page with Previous/Next buttons
- [ ] **Two-Page Spread**: Shows two pages side by side
- [ ] Navigation works correctly in single/spread modes

### ✅ Break Control

- [ ] **Orphan Control**: Set to 3 - fewer single lines at page bottoms
- [ ] **Widow Control**: Set to 3 - fewer single lines at page tops
- [ ] Setting both to 0 allows more aggressive splitting

### ✅ Content Types

- [ ] **Text**: Styled headings and paragraphs visible
- [ ] **Lists**: Bullet points with proper indentation
- [ ] **Tables**: Border and cells properly formatted
- [ ] **Containers**: Colored boxes with content

### ✅ Smart Features

- [ ] Table doesn't break in middle of row (if possible)
- [ ] Headings try to stay with their content
- [ ] No awkward single words at page tops/bottoms

## Manual Testing Scenarios

### Test 1: Orphan/Widow Control

1. Set Orphan Control to 0
2. Set Widow Control to 0
3. Observe: Content splits more freely
4. Set both to 3
5. Observe: Fewer splits, content kept together more

### Test 2: Page Size Changes

1. Select A4 (default)
2. Count number of pages
3. Switch to Letter
4. Number of pages should change slightly
5. Switch to Legal (taller pages)
6. Should have fewer pages

### Test 3: Orientation

1. Start with Portrait
2. Note page dimensions
3. Switch to Landscape
4. Pages should be wider than tall
5. Content should reflow

### Test 4: Scale

1. Set scale to 25%
2. Pages should be very small
3. Set scale to 150%
4. Pages should be larger
5. Content should remain the same (just zoomed)

## Browser Console Tests

Open browser DevTools (F12) and run:

```javascript
// Check if pages are generated
console.log('Total pages:', document.querySelectorAll('.pagination-engine-page').length);

// Should show multiple pages (probably 3-5)
```

## Performance Testing

### Test with More Content

Edit `src/demo/sampleContent.ts` and add more paragraphs:

```typescript
// Add this to the end of sampleContent array
...Array(20).fill(null).map((_, i) => ({
  content: {
    type: 'text',
    id: `perf-test-${i}`,
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(10),
    style: { fontSize: 14, lineHeight: 1.6 },
  },
}))
```

Then:
1. Save the file
2. Watch browser auto-reload
3. Should see many more pages
4. Check if pagination is still smooth

## Integration Testing

### Test in Your Own Project

1. Build the library:
```bash
npm run build
```

2. Create a new React project:
```bash
cd ..
npx create-vite@latest my-test-app --template react-ts
cd my-test-app
```

3. Link the pagination engine:
```bash
npm install
npm link ../paginationEngine
```

4. Use in your app:
```typescript
// src/App.tsx
import { usePagination, PaginatedDocument } from 'pagination-engine';

function App() {
  const { pages } = usePagination([
    {
      content: {
        type: 'text',
        id: '1',
        text: 'Hello from my app!',
        style: { fontSize: 24 }
      }
    }
  ], {
    pageConfig: {
      size: 'A4',
      orientation: 'portrait',
      margins: { top: 72, right: 72, bottom: 72, left: 72 }
    }
  });

  return <PaginatedDocument pages={pages} config={{...}} />;
}
```

## Automated Testing (Future)

To add unit tests, install testing libraries:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Example test (not yet implemented):

```typescript
import { describe, it, expect } from 'vitest';
import { PaginationEngine } from '../src/core/PaginationEngine';

describe('PaginationEngine', () => {
  it('should paginate content correctly', () => {
    const engine = new PaginationEngine({...});
    const pages = engine.paginate([...]);
    expect(pages.length).toBeGreaterThan(0);
  });
});
```

## Troubleshooting

### Issue: Blank pages
**Solution**: Check browser console for errors. Ensure content has valid IDs.

### Issue: No page breaks
**Solution**: Add more content. Short content may fit on one page.

### Issue: Content overlapping
**Solution**: Check that measurements are working. Canvas API should be available.

### Issue: Changes not applying
**Solution**: Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)

### Issue: Build errors
**Solution**:
```bash
rm -rf node_modules dist
npm install
npm run build
```

## Expected Results

With the default demo content, you should see:
- **Total Pages**: 3-5 pages (depends on page size)
- **Page 1**: Title, introduction, features list
- **Page 2**: More features, table
- **Page 3+**: Usage example, extended content

The exact page count will vary based on:
- Page size selected
- Orphan/widow control settings
- Browser rendering differences

## Success Criteria

✅ All content visible across pages
✅ No overlapping content
✅ Headers and footers on every page
✅ Page numbers increment correctly
✅ Controls change pagination in real-time
✅ No console errors
✅ Smooth scrolling between pages

If all of these pass, your pagination engine is working correctly!

## Next Steps

1. Try modifying `src/demo/sampleContent.ts` with your own content
2. Experiment with different page configurations
3. Test edge cases (very long text, large images, complex tables)
4. Build your own document editor on top of the engine

Happy testing! 🚀
