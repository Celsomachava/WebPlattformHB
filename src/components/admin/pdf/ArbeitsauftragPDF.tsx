import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { ArbeitsauftragServicebericht } from '../../../types/arbeitsauftrag';

const styles = StyleSheet.create({
  page: { padding: 10, fontSize: 8 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  title: { fontSize: 14, fontWeight: 'bold' },
  section: { marginBottom: 8, borderWidth: 1, borderColor: '#000', padding: 5 },
  sectionTitle: { fontSize: 10, fontWeight: 'bold', marginBottom: 4 },
  row: { flexDirection: 'row', marginBottom: 2 },
  label: { width: '30%', fontWeight: 'bold', fontSize: 7 },
  value: { width: '70%', fontSize: 7 },
  table: { borderWidth: 1, borderColor: '#000', marginBottom: 5 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
  tableHeader: { backgroundColor: '#f0f0f0', fontWeight: 'bold' },
  tableCell: { padding: 2, borderRightWidth: 1, borderColor: '#000', fontSize: 6 },
  footer: { fontSize: 6, marginTop: 10 }
});

interface Props {
  data: ArbeitsauftragServicebericht;
}

export const ArbeitsauftragPDF: React.FC<Props> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Heduschka GmbH</Text>
        <Text>Datum: {data.datum}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Auftraggeber / Kunde</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Auftraggeber:</Text>
          <Text style={styles.value}>{data.auftraggeber_name}, {data.auftraggeber_strasse}, {data.auftraggeber_ort}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kd-Nr.:</Text>
          <Text style={styles.value}>{data.kd_nr}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kundenanschrift:</Text>
          <Text style={styles.value}>{data.kundenanschrift_name}, {data.kundenanschrift_adresse}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>AP:</Text>
          <Text style={styles.value}>{data.ap_name} | Tel: {data.ap_tel}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Fahrzeug / Arbeitsauftrag</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Fahrzeug:</Text>
          <Text style={styles.value}>{data.fahrzeug}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Kennzeichen:</Text>
          <Text style={styles.value}>{data.kennzeichen}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Serien-Nr. / Baujahr:</Text>
          <Text style={styles.value}>{data.serien_nr} / {data.baujahr}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Arbeitsauftrag:</Text>
          <Text style={styles.value}>{data.arbeitsauftrag}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Arbeitszeiten</Text>
        <View style={styles.table}>
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableCell, { width: '12%' }]}>Datum</Text>
            <Text style={[styles.tableCell, { width: '15%' }]}>Monteur</Text>
            <Text style={[styles.tableCell, { width: '10%' }]}>Anfahrt</Text>
            <Text style={[styles.tableCell, { width: '8%' }]}>km</Text>
            <Text style={[styles.tableCell, { width: '10%' }]}>Arbeit</Text>
            <Text style={[styles.tableCell, { width: '8%' }]}>Pause</Text>
            <Text style={[styles.tableCell, { width: '10%' }]}>Rück</Text>
            <Text style={[styles.tableCell, { width: '8%', borderRightWidth: 0 }]}>km</Text>
          </View>
          {data.zeiten.map((z, i) => (
            <View key={i} style={styles.tableRow}>
              <Text style={[styles.tableCell, { width: '12%' }]}>{z.datum}</Text>
              <Text style={[styles.tableCell, { width: '15%' }]}>{z.monteur}</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>{z.anfahrt_von}-{z.anfahrt_bis}</Text>
              <Text style={[styles.tableCell, { width: '8%' }]}>{z.anfahrt_km}</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>{z.arbeitszeit_von}-{z.arbeitszeit_bis}</Text>
              <Text style={[styles.tableCell, { width: '8%' }]}>{z.pausen}</Text>
              <Text style={[styles.tableCell, { width: '10%' }]}>{z.rueckfahrt_von}-{z.rueckfahrt_bis}</Text>
              <Text style={[styles.tableCell, { width: '8%', borderRightWidth: 0 }]}>{z.rueckfahrt_km}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Ausgeführte Arbeiten</Text>
        <Text style={{ fontSize: 7 }}>{data.ausgefuehrte_arbeiten}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Material</Text>
        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
          <Text style={{ width: '33%', fontSize: 7 }}>{data.material_zeile1_col1}</Text>
          <Text style={{ width: '33%', fontSize: 7 }}>{data.material_zeile1_col2}</Text>
          <Text style={{ width: '34%', fontSize: 7 }}>{data.material_zeile1_col3}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
          <Text style={{ width: '33%', fontSize: 7 }}>{data.material_zeile2_col1}</Text>
          <Text style={{ width: '33%', fontSize: 7 }}>{data.material_zeile2_col2}</Text>
          <Text style={{ width: '34%', fontSize: 7 }}>{data.material_zeile2_col3}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 2 }}>
          <Text style={{ width: '33%', fontSize: 7 }}>{data.material_zeile3_col1}</Text>
          <Text style={{ width: '33%', fontSize: 7 }}>{data.material_zeile3_col2}</Text>
          <Text style={{ width: '34%', fontSize: 7 }}>{data.material_zeile3_col3}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ width: '33%', fontSize: 7 }}>{data.material_zeile4_col1}</Text>
          <Text style={{ width: '33%', fontSize: 7 }}>{data.material_zeile4_col2}</Text>
          <Text style={{ width: '34%', fontSize: 7 }}>{data.material_zeile4_col3}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Bemerkungen</Text>
        <Text style={{ fontSize: 7 }}>{data.bemerkungen}</Text>
      </View>

      <View style={{ marginBottom: 8, padding: 5, fontSize: 6, lineHeight: 1.4 }}>
        <Text>Reklamationen nur innerhalb von 8 Tagen nach unserer erbrachten Leistung. Für alle Maschinen, Ersatzteile und Waren gelten die Garantiebestimmungen des Herstellers. Die gelieferte Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.</Text>
        <Text style={{ marginTop: 4 }}>Mit dieser Unterschrift wird bestätigt, dass die Arbeiten ordnungsgemäß durchgeführt wurden, die oben genannte Reise- und Arbeitszeit, sowie km angefallen sind und auf dem Materialschein aufgeführten Ersatzteile benötigt wurden.</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Unterschriften</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Unterschrift/ Monteur:</Text>
          <Text style={styles.value}>{data.unterschrift_monteur}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Stempel/ Unterschrift Kunde bzw. Bevollmächtigte/ Druckbuchstaben:</Text>
          <Text style={styles.value}>{data.unterschrift_kunde}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text>&gt;&gt; Es gelten unsere allgemeinen Geschäftsbedingungen (AGB), die sie umseitig und unter www.heduschka.de finden &lt;&lt;</Text>
        <Text>Heduschka GmbH . Buchwalder Str. 28 . 01968 Senftenberg . Tel. 03573/ 79 32 25 . Fax 03573 30 66 . www.heduschka.de</Text>
      </View>
    </Page>
  </Document>
);
