import { PDFDocument } from './src/app';

const document = new PDFDocument();

document.generateBasicPDF();
document.embedFont('./fonts/Roboto-Regular.ttf');
document.setFont('F1', 12);
document.save('test.pdf');

