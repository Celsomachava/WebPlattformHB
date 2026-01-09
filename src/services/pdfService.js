import jsPDF from 'jspdf';

class PDFService {
  generateAngebotPDF(angebot) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Heduschka GmbH', 20, 30);
    doc.setFontSize(12);
    doc.text('Filterservice & Anlagentechnik', 20, 40);
    
    // Angebot Info
    doc.setFontSize(16);
    doc.text(`Angebot ${angebot.nummernkreis}`, 20, 60);
    doc.setFontSize(10);
    doc.text(`Datum: ${new Date(angebot.created_at).toLocaleDateString('de-DE')}`, 20, 70);
    doc.text(`Gueltig bis: ${new Date(angebot.gueltig_bis).toLocaleDateString('de-DE')}`, 20, 80);
    
    // Customer
    doc.text(`Kunde: ${angebot.kunden_id}`, 120, 70);
    
    // Positions
    let yPos = 100;
    doc.setFontSize(12);
    doc.text('Positionen:', 20, yPos);
    yPos += 10;
    
    angebot.positionen.forEach((pos, index) => {
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${pos.artikel}`, 20, yPos);
      doc.text(`${pos.menge} x ${pos.einzelpreis.toFixed(2)}€`, 120, yPos);
      doc.text(`${pos.gesamtpreis.toFixed(2)}€`, 160, yPos);
      yPos += 8;
    });
    
    // Totals
    yPos += 10;
    doc.text(`Netto: ${angebot.netto.toFixed(2)}€`, 120, yPos);
    yPos += 8;
    doc.text(`MwSt (${angebot.mwst}%): ${(angebot.brutto - angebot.netto).toFixed(2)}€`, 120, yPos);
    yPos += 8;
    doc.setFontSize(12);
    doc.text(`Brutto: ${angebot.brutto.toFixed(2)}€`, 120, yPos);
    
    doc.save(`Angebot_${angebot.nummernkreis}.pdf`);
  }

  generateRechnungPDF(rechnung) {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(20);
    doc.text('Heduschka GmbH', 20, 30);
    doc.setFontSize(12);
    doc.text('Filterservice & Anlagentechnik', 20, 40);
    
    // Rechnung Info
    doc.setFontSize(16);
    doc.text(`Rechnung ${rechnung.nummernkreis}`, 20, 60);
    doc.setFontSize(10);
    doc.text(`Datum: ${new Date(rechnung.created_at).toLocaleDateString('de-DE')}`, 20, 70);
    doc.text(`Faellig: ${new Date(rechnung.faellig_am).toLocaleDateString('de-DE')}`, 20, 80);
    
    // Customer
    doc.text(`Kunde: ${rechnung.kunden_id}`, 120, 70);
    
    // Positions
    let yPos = 100;
    doc.setFontSize(12);
    doc.text('Positionen:', 20, yPos);
    yPos += 10;
    
    rechnung.positionen.forEach((pos, index) => {
      doc.setFontSize(10);
      doc.text(`${index + 1}. ${pos.artikel}`, 20, yPos);
      doc.text(`${pos.menge} x ${pos.einzelpreis.toFixed(2)}€`, 120, yPos);
      doc.text(`${pos.gesamtpreis.toFixed(2)}€`, 160, yPos);
      yPos += 8;
    });
    
    // Totals
    yPos += 10;
    doc.text(`Netto: ${rechnung.netto.toFixed(2)}€`, 120, yPos);
    yPos += 8;
    doc.text(`MwSt: ${rechnung.mwst_betrag.toFixed(2)}€`, 120, yPos);
    yPos += 8;
    doc.setFontSize(12);
    doc.text(`Brutto: ${rechnung.brutto.toFixed(2)}€`, 120, yPos);
    
    // Payment terms
    yPos += 20;
    doc.setFontSize(10);
    doc.text('Zahlungsbedingungen:', 20, yPos);
    doc.text(rechnung.zahlungsbedingungen, 20, yPos + 8);
    
    doc.save(`Rechnung_${rechnung.nummernkreis}.pdf`);
  }
}

export const pdfService = new PDFService();