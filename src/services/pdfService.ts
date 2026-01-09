import jsPDF from 'jspdf';

export const generatePDF = async (data) => {
  try {
    const doc = new jsPDF();
    
    // Simple PDF generation
    doc.setFontSize(20);
    doc.text('Heduschka GmbH', 20, 30);
    
    doc.setFontSize(16);
    const title = data.type === 'angebot' ? 'ANGEBOT' : 'RECHNUNG';
    doc.text(title, 20, 50);
    
    doc.setFontSize(12);
    doc.text(`${title}-Nr.: ${data.nummer}`, 20, 70);
    doc.text(`Kunde: ${data.kunde}`, 20, 80);
    doc.text(`Datum: ${data.datum}`, 20, 90);
    doc.text(`Betrag: ${data.brutto.toFixed(2)} €`, 20, 100);
    
    const filename = `${data.type}_${data.nummer}.pdf`;
    doc.save(filename);
    
    return doc;
  } catch (error) {
    console.error('PDF generation failed:', error);
    // Fallback to text download
    const content = `${data.type.toUpperCase()}: ${data.nummer}\nKunde: ${data.kunde}\nBetrag: ${data.brutto} €`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${data.type}_${data.nummer}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};

export const generateServiceRequestPDF = async (serviceRequest) => {
  try {
    const doc = new jsPDF();
    
    doc.setFontSize(20);
    doc.text('Heduschka GmbH', 20, 30);
    
    doc.setFontSize(16);
    doc.text('SERVICEANFRAGE', 20, 50);
    
    doc.setFontSize(12);
    doc.text(`ID: ${serviceRequest.id}`, 20, 70);
    doc.text(`Kunde: ${serviceRequest.formData?.kundendaten?.kunden_id}`, 20, 80);
    doc.text(`Service: ${serviceRequest.formData?.serviceangaben?.serviceart}`, 20, 90);
    
    const filename = `Serviceanfrage_${serviceRequest.id}.pdf`;
    doc.save(filename);
    
    return doc;
  } catch (error) {
    console.error('PDF generation failed:', error);
    // Fallback to text download
    const content = `SERVICEANFRAGE\nID: ${serviceRequest.id}\nKunde: ${serviceRequest.formData?.kundendaten?.kunden_id}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Serviceanfrage_${serviceRequest.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};