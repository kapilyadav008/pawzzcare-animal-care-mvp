import pdfParse from 'pdf-parse';

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(buffer);
    return data.text ? data.text.trim() : '';
  } catch (error: any) {
    console.error('[PDF Extractor Error]:', error.message);
    throw new Error(`Failed to parse PDF document: ${error.message}`);
  }
}
