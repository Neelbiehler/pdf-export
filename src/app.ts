import opentype from 'opentype.js';
import fs from 'fs';

export class PDFDocument {
  private content: string;
  private currentFont: string;
  private fontCounter: number;

  constructor() {
    this.content = '';
    this.currentFont = 'F1';
    this.fontCounter = 0;
  }

  generateBasicPDF(): void {
    let pdf = '%PDF-1.7\n';

    // 1. Generate the PDF structure (objects, trailer, etc.)
    pdf += '1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n';
    pdf += '2 0 obj\n<< /Type /Pages /Count 1 /Kids [ 3 0 R ] >>\nendobj\n';
    pdf += '3 0 obj\n<< /Type /Page /Parent 2 0 R /Resources << /Font << /F1 4 0 R >> >> /MediaBox [0 0 595.28 841.89] /Contents 5 0 R >>\nendobj\n';
    
    // 2. Add the content stream
    const content = 'BT /F1 12 Tf 50 800 Td (Hello, World!) Tj ET';
    const contentStream = this.createStreamObject(new TextEncoder().encode(content).buffer);
    pdf += contentStream;
    
    // 3. Add the XRef table and trailer
    const xrefPosition = pdf.length;
    pdf += 'xref\n';
    pdf += '0 6\n';
    pdf += '0000000000 65535 f \n';
    pdf += '0000000009 00000 n \n';
    pdf += '0000000074 00000 n \n';
    pdf += '0000000120 00000 n \n';
    pdf += 'trailer\n';
    pdf += `<< /Size 6 /Root 1 0 R /Info 4 0 R /ID [<0123456789abcdef0123456789abcdef> <0123456789abcdef0123456789abcdef>] >>\n`;
    pdf += 'startxref\n';
    pdf += `${xrefPosition}\n`;
    pdf += '%%EOF\n';

    this.content = pdf;
  }

  async embedFont(fontFilePath: string): Promise<void> {
    try {
      const font = await opentype.load(fontFilePath);
      this.fontCounter++;
      const fontName = `F${this.fontCounter}`;

      // Embed font in PDF content (implementation below)
      this.embedTrueTypeFont(font, fontName);
    } catch (error) {
      console.error('Error loading font:', error);
    }
  }

  private embedTrueTypeFont(font: opentype.Font, fontName: string): void {
    // Create font descriptor object
    const fontDescriptor = this.createFontDescriptorObject(font, fontName);
    
    // Create font stream object
    const fontStreamData = font.toArrayBuffer();
    const fontStream = this.createStreamObject(fontStreamData);
    
    // Create font object
    const fontObject = this.createFontObject(font, fontName, fontDescriptor, fontStream);
    
    // Add font objects to the PDF content
    this.content += fontDescriptor;
    this.content += fontStream;
    this.content += fontObject;
  }

  setFont(fontName: string, fontSize: number): void {
    this.currentFont = fontName;
    this.content = this.content.replace(new RegExp(`/${fontName} \\d+ Tf`, 'g'), `/${fontName} ${fontSize} Tf`);
  }

  private createStreamObject(data: ArrayBuffer): string {
    const encodedData = Buffer.from(data).toString('base64');
    const streamLength = data.byteLength;
    const object = `<< /Length ${streamLength} /Filter /ASCII85Decode >>\nstream\n${encodedData}\nendstream\n`;

    return object;
  }

  private createFontDescriptorObject(font: opentype.Font, fontName: string): string {
    const descriptor = `<< /Type /FontDescriptor /FontName /${fontName} /Flags 32 /FontBBox [ ${font.tables.head.xMin} ${font.tables.head.yMin} ${font.tables.head.xMax} ${font.tables.head.yMax} ] /ItalicAngle ${font.tables.post.italicAngle} /Ascent ${font.tables.hhea.ascent} /Descent ${font.tables.hhea.descent} /CapHeight ${font.tables.os2.sCapHeight} /StemV 80 >>\n`;
  
    return descriptor;
  }
  
  private createFontObject(font: opentype.Font, fontName: string, fontDescriptor: string, fontStream: string): string {
    const stringToGlyphs = (font as any).stringToGlyphs.bind(font);
    const glyphs = stringToGlyphs(
      Array.from({ length: 127 - 32 }, (_, i) => String.fromCharCode(i + 32)).join('')
    );
    const glyphWidths = glyphs.map((glyph: any) => Math.round(glyph.advanceWidth));
  
    const firstObjectNumber = this.fontCounter * 3 + 4;
    const descriptorObjectNumber = firstObjectNumber + 1;
    const streamObjectNumber = firstObjectNumber + 2;
  
    const object = `${firstObjectNumber} 0 obj\n<< /Type /Font /Subtype /TrueType /BaseFont /${fontName} /FirstChar 32 /LastChar 126 /Widths [ ${glyphWidths.join(' ')} ] /FontDescriptor ${descriptorObjectNumber} 0 R >>\nendobj\n`;
    const descriptorObject = `${descriptorObjectNumber} 0 obj\n${fontDescriptor}\nendobj\n`;
    const streamObject = `${streamObjectNumber} 0 obj\n${fontStream}\nendobj\n`;
  
    return object + descriptorObject + streamObject;
  }
  
  save(filename: string): void {
    fs.writeFileSync(filename, this.content);
  }

}

