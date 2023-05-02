mod pdf_document;
use pdf_document::PdfDocument;

fn main() {
  let mut doc = PdfDocument::new();
    doc.add_page();
    doc.set_font("Helvetica", 12.0)
    doc.add_text("Hello, World!", 50.0, 50.0);

    if let Err(e) = doc.save("hello_world.pdf") {
        println!("Error while saving PDF: {}", e);
    }
}