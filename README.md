# PDFDocument Class README

## Overview

The `PDFDocument` class is a simple utility to generate PDF documents programmatically using Node.js. It utilizes the OpenType.js library for font management and includes basic operations like creating pages, embedding fonts, and setting font size.

## Table of Contents

- [Dependencies](#dependencies)
- [Class Methods](#class-methods)
  - [Constructor](#constructor)
  - [generateBasicPDF](#generatebasicpdf)
  - [embedFont](#embedfont)
  - [setFont](#setfont)
  - [save](#save)
- [Private Methods](#private-methods)
- [Usage Example](#usage-example)
- [Error Handling](#error-handling)
- [Known Issues](#known-issues)

## Dependencies

- `opentype.js`: To handle and manipulate font data.
- `fs`: Node.js File System module, used to write the PDF data to a file.

## Class Methods

### Constructor

Initializes a new `PDFDocument` object with empty content, a default font, and a font counter.

### generateBasicPDF

Generates a simple PDF with basic structure, and sets the content to "Hello, World!".

### embedFont

```javascript
embedFont(fontFilePath: string): Promise<void>
```

Asynchronously loads a TrueType font from a given file path and embeds it into the PDF.

### setFont

```javascript
setFont(fontName: string, fontSize: number): void
```

Sets the font and font size to use in the PDF.

### save

```javascript
save(filename: string): void
```

Writes the generated PDF content to a file.

## Private Methods

- `embedTrueTypeFont(font: opentype.Font, fontName: string)`: Embeds a TrueType font into the PDF.
- `createStreamObject(data: ArrayBuffer)`: Creates a PDF object for stream data.
- `createFontDescriptorObject(font: opentype.Font, fontName: string)`: Creates a font descriptor PDF object.
- `createFontObject(...)`: Creates the font object with all necessary details.

## Usage Example

```javascript
const pdfDoc = new PDFDocument();
pdfDoc.generateBasicPDF();
pdfDoc.embedFont('path/to/font-file.ttf').then(() => {
  pdfDoc.setFont('F2', 14);
  pdfDoc.save('output.pdf');
});
```

## Error Handling

Any errors, particularly during font loading, are logged to the console.

## Known Issues

- No support for complex PDF features like images or tables.
- Only basic font manipulation supported.

Feel free to contribute and enhance its functionalities!
```
