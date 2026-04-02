// RT-062: Inline form validation helpers
// RT-089: Branded PDF filename generator
// RT-113: PDF page number utility

/**
 * Validate required fields and return an errors object
 * requiredFields: array of { key, label }
 */
export function validateRequired(form, requiredFields) {
  const errors = {};
  for (const { key, label } of requiredFields) {
    const val = form[key];
    if (!val || (typeof val === 'string' && !val.trim())) {
      errors[key] = `${label} is required`;
    }
  }
  return errors;
}

/**
 * RT-089: Generate a branded PDF filename
 * type: e.g. 'WrittenWarning', 'Evaluation'
 * employeeName: e.g. 'John Doe'
 */
export function brandedFilename(type, employeeName) {
  const date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const safeName = (employeeName || 'Employee')
    .trim()
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .replace(/\s+/g, '_');
  return `JMVG_${type}_${safeName}_${date}.pdf`;
}

/**
 * RT-113: Add page numbers to a jsPDF document
 * Call after all pages are added, before pdf.save()
 */
export function addPageNumbers(pdf, options = {}) {
  const { color = '#9ca3af', fontSize = 8, margin = 20 } = options;
  const total = pdf.internal.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    pdf.setPage(i);
    pdf.setFontSize(fontSize);
    pdf.setTextColor(color);
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    pdf.text(`Page ${i} of ${total}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
  }
}
