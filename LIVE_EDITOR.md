# Live Document Editor Guide

## Overview

The Live Document Editor is a Google Docs-style editor where you can type content and see it paginate in real-time as you write. This is the main feature you requested - a WYSIWYG editor with live pagination!

## How to Use

### 1. Start the Editor

```bash
npm run dev
```

Then open http://localhost:5173/ in your browser.

You'll see the **Live Editor** mode by default with:
- **Left Pane**: Rich text editor where you type
- **Right Pane**: Live paginated preview

### 2. Editor Features

#### Formatting Toolbar

Located at the top of the editor:

**Text Styles**
- Dropdown: Normal, Heading 1-4
- Font size selector (10px - 48px)

**Text Formatting**
- **B** - Bold (or Ctrl+B)
- *I* - Italic (or Ctrl+I)
- <u>U</u> - Underline (or Ctrl+U)

**Alignment**
- Align Left
- Align Center
- Align Right
- Justify

**Lists**
- Bullet List
- Numbered List

**Insert**
- 📷 **Image** - Click to insert an image by URL
- ⊞ **Table** - Click to create a table (specify rows/cols)

**Color**
- Color picker for text color

#### Typing Content

1. **Click in the editor area** (left pane)
2. **Start typing** - your content appears on the left
3. **Watch the right pane** - it automatically paginates as you type!

The pagination updates with a 300ms debounce, so you can type smoothly without lag.

### 3. Live Pagination

As you type, the engine:
- ✅ Automatically flows content across pages
- ✅ Applies intelligent page breaks
- ✅ Updates page count in real-time
- ✅ Maintains proper spacing and formatting
- ✅ Shows "Processing..." when paginating

### 4. Page Controls

Top control panel options:

**Page Settings**
- **Page Size**: A4, Letter, Legal, A3
- **Orientation**: Portrait or Landscape

**View Settings**
- **Scale**: Zoom in/out (25% - 100%)
- **View**: All Pages / Single Page / Two-Page Spread

**Break Control**
- **Orphan**: Minimum lines at bottom of page (0-5)
- **Widow**: Minimum lines at top of page (0-5)

**Editor Toggle**
- **Hide Editor** - Show only the paginated preview (full width)
- **Show Editor** - Return to split view

### 5. Try These Examples

#### Example 1: Basic Document

```
1. Click in the editor
2. Type a title (select "Heading 1" from dropdown first)
3. Press Enter
4. Type some paragraphs
5. Watch them appear on the right, paginated!
```

#### Example 2: Formatted Document

```
1. Type a heading
2. Select the text, click "Heading 2"
3. Type a paragraph
4. Select some words, click Bold (B)
5. Continue typing
6. See the formatting preserved in pagination
```

#### Example 3: Lists

```
1. Click the "• List" button
2. Type your first item
3. Press Enter for next item
4. Keep adding items
5. Watch the list paginate across pages if needed
```

#### Example 4: Insert Image

```
1. Click "📷 Image" button
2. Enter an image URL (e.g., https://picsum.photos/400/300)
3. Press OK
4. Image appears in document and pagination
```

#### Example 5: Insert Table

```
1. Click "⊞ Table" button
2. Enter rows (e.g., 5)
3. Enter columns (e.g., 3)
4. Table appears
5. Click in cells to edit
```

### 6. Real-World Use Case

**Creating a Report:**

```
1. Start with "Heading 1" - "Quarterly Report"
2. Add "Heading 2" - "Executive Summary"
3. Type a few paragraphs
4. Add "Heading 2" - "Financial Results"
5. Insert a table with your data
6. Add "Heading 2" - "Conclusion"
7. Type final thoughts

Watch as your report automatically paginates with:
- Headers on each page
- Page numbers in footer
- Professional layout
- Proper page breaks
```

### 7. Keyboard Shortcuts

- **Ctrl+B** - Bold
- **Ctrl+I** - Italic
- **Ctrl+U** - Underline
- **Ctrl+Z** - Undo (browser default)
- **Ctrl+Y** - Redo (browser default)

### 8. Tips for Best Results

✅ **Use Headings** - They help structure your document
✅ **Adjust Orphan/Widow** - Set to 2-3 for professional documents
✅ **Try Different Page Sizes** - A4 for international, Letter for US
✅ **Hide Editor** - When you want to see just the final result
✅ **Scale Down** - To see multiple pages at once

### 9. What Happens as You Type

```
You Type → HTML Generated → Converted to ContentBlocks → Pagination Engine → Pages Rendered
  (Instant)    (Instant)         (Instant)                 (300ms debounce)    (Instant)
```

The 300ms debounce means:
- You can type continuously without lag
- Pagination updates shortly after you stop typing
- Smooth, responsive experience

### 10. Advanced Features

#### Custom Page Numbering
The footer automatically shows page numbers (1, 2, 3, etc.)

#### Headers
Each page shows "My Document" at the top

#### Multi-Page Spread
Switch to "Spread" view to see pages like an open book

#### Print-Ready
The pagination matches what you'd see in print/PDF

## Switching Demos

**View Static Demo**
- Click "View Static Demo" button (top right)
- See pre-made content with all features showcased
- Good for seeing what's possible

**Back to Live Editor**
- Click "Open Live Editor" to return
- Continue editing your content

## Troubleshooting

**Issue: Can't type in editor**
- Make sure you've clicked inside the white editor area
- Refresh the page if needed

**Issue: Pagination not updating**
- Wait 300ms after typing stops
- Check for "Processing..." indicator
- Refresh if stuck

**Issue: Formatting not working**
- Select text first, then click formatting button
- Some formats require text selection

**Issue: Image not showing**
- Make sure URL is valid and publicly accessible
- Try https://picsum.photos/400/300 as a test

**Issue: Can't see pages**
- Try clicking "Hide Editor" for full-width view
- Adjust scale slider
- Scroll down in the right pane

## What You Can Build

This editor is perfect for:
- 📄 Document creation
- 📊 Report generation
- 📝 Article writing
- 📋 Forms and templates
- 📖 E-books
- 🧾 Invoices
- 📜 Certificates
- 📰 Newsletters

## Next Steps

1. Try typing a full document
2. Experiment with all formatting options
3. Insert images and tables
4. Change page settings
5. See how content reflows automatically

The magic is that **you just type, and the pagination handles itself** - just like Google Docs!

Enjoy your document editor! 🎉
