// src/types/opentype.js.d.ts
declare module 'opentype.js' {
    export class Font {
      tables: {
        head: { xMin: number; yMin: number; xMax: number; yMax: number };
        post: { italicAngle: number };
        hhea: { ascent: number; descent: number };
        os2: { sCapHeight: number };
      };
  
      static load(url: string, callback: (error: any, font: Font) => void): void;
      static loadFromDataBuffer(buffer: ArrayBuffer): Font;
      static fromBuffer(buffer: ArrayBuffer): Font;
  
      toArrayBuffer(): ArrayBuffer;
    }
  
    
  export function load(url: string): Promise<Font>;
  export function toArrayBuffer(buffer: any): ArrayBuffer;
  }
  