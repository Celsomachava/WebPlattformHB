import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { Wochenplan } from '../../../types/wochenplan';

const styles = StyleSheet.create({
  page: { padding: 10, fontSize: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 14, fontWeight: 'bold' },
  table: { width: '100%', borderWidth: 1, borderColor: '#000' },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  cell: { padding: 3, borderRightWidth: 1, borderColor: '#000', fontSize: 7 },
  footer: { marginTop: 10, fontSize: 7 }
});

interface Props {
  data: Wochenplan;
}

export const WochenplanPDF: React.FC<Props> = ({ data }) => {
  const weeklyTotal = data.rows.reduce((sum, row) => sum + (row.preis || 0), 0);

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>Wochenplan KW {data.kalenderwoche}</Text>
          <Text>Servicetechniker: {data.servicetechniker}</Text>
        </View>

        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, { width: '5%' }]}>Tag</Text>
            <Text style={[styles.cell, { width: '8%' }]}>Datum</Text>
            <Text style={[styles.cell, { width: '7%' }]}>Zeit</Text>
            <Text style={[styles.cell, { width: '12%' }]}>Firma</Text>
            <Text style={[styles.cell, { width: '12%' }]}>Standort</Text>
            <Text style={[styles.cell, { width: '10%' }]}>Auftrag</Text>
            <Text style={[styles.cell, { width: '8%' }]}>Filter</Text>
            <Text style={[styles.cell, { width: '10%' }]}>Hotel</Text>
            <Text style={[styles.cell, { width: '12%' }]}>Adresse</Text>
            <Text style={[styles.cell, { width: '8%' }]}>Storno</Text>
            <Text style={[styles.cell, { width: '5%' }]}>Preis</Text>
            <Text style={[styles.cell, { width: '3%', borderRightWidth: 0 }]}>FS/G/B</Text>
          </View>

          {data.rows.map((row, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.cell, { width: '5%' }]}>{row.wochentag}</Text>
              <Text style={[styles.cell, { width: '8%' }]}>{row.datum}</Text>
              <Text style={[styles.cell, { width: '7%' }]}>{row.geplante_zeit}</Text>
              <Text style={[styles.cell, { width: '12%' }]}>{row.firma}</Text>
              <Text style={[styles.cell, { width: '12%' }]}>{row.standort}</Text>
              <Text style={[styles.cell, { width: '10%' }]}>{row.auftrag}</Text>
              <Text style={[styles.cell, { width: '8%' }]}>{row.filter}</Text>
              <Text style={[styles.cell, { width: '10%' }]}>{row.hotel_name}</Text>
              <Text style={[styles.cell, { width: '12%' }]}>{row.adresse}</Text>
              <Text style={[styles.cell, { width: '8%' }]}>{row.storno_bis}</Text>
              <Text style={[styles.cell, { width: '5%' }]}>€{row.preis}</Text>
              <Text style={[styles.cell, { width: '3%', borderRightWidth: 0 }]}>
                {row.inkl_fs ? 'F' : ''}{row.geb ? 'G' : ''}{row.bez ? 'B' : ''}
              </Text>
            </View>
          ))}

          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.cell, { width: '87%' }]}>Wochensumme:</Text>
            <Text style={[styles.cell, { width: '13%', borderRightWidth: 0 }]}>€{weeklyTotal.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text>Information: {data.information}</Text>
          <Text>Geld mitgeben: €{data.geld_mitgeben} | KM ca.: {data.km_ca} | Tanken: €{data.tanken} | Puffer: €{data.puffer} | Hotel: €{data.hotel_kosten}</Text>
          <Text>Zurück: {data.zurueck_datum}</Text>
          <Text>Unterschrift Monteur: {data.unterschrift_monteur} | Service: {data.unterschrift_service}</Text>
        </View>
      </Page>
    </Document>
  );
};
