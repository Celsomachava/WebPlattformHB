import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PruefprotokollDGUV201004 } from '../../../types/pruefprotokoll';

const styles = StyleSheet.create({
  page: { padding: 10, fontSize: 7 },
  title: { fontSize: 12, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  section: { marginBottom: 8 },
  sectionTitle: { fontSize: 9, fontWeight: 'bold', marginBottom: 4 },
  row: { flexDirection: 'row', marginBottom: 3 },
  label: { width: '40%', fontWeight: 'bold' },
  value: { width: '60%' },
  table: { borderWidth: 1, borderColor: '#000', marginBottom: 5 },
  tableRow: { flexDirection: 'row', borderBottomWidth: 1, borderColor: '#000' },
  tableCell: { padding: 2, borderRightWidth: 1, borderColor: '#000', fontSize: 6 }
});

interface Props {
  data: PruefprotokollDGUV201004;
}

export const PruefprotokollPDF: React.FC<Props> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Prüfprotokoll DGUV 201-004</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kalenderjahr: {data.kalenderjahr}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Auftraggeber / Betreiber</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Auftraggeber:</Text>
          <Text style={styles.value}>{data.auftraggeber_name}, {data.auftraggeber_strasse}, {data.auftraggeber_ort}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Betreiber:</Text>
          <Text style={styles.value}>{data.betreiber_name}, {data.betreiber_strasse}, {data.betreiber_ort}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Projekt / Kostenstelle:</Text>
          <Text style={styles.value}>{data.projekt} / {data.kostenstelle}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Gerät / Fahrzeug</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Fahrzeug/Gerät:</Text>
          <Text style={styles.value}>{data.fahrzeug_geraet}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Hersteller/Typ:</Text>
          <Text style={styles.value}>{data.hersteller_typ}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fahrgestell-Nr. / Baujahr:</Text>
          <Text style={styles.value}>{data.fahrgestell_nr} / {data.baujahr}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Motor / Filteranlagen</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Motor:</Text>
          <Text style={styles.value}>{data.motor_hersteller_typ}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Filter:</Text>
          <Text style={styles.value}>{data.filter_hersteller_typ} (SN: {data.filter_seriennr})</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Dokumentation</Text>
        <Text>Betriebsanleitung: {data.betriebsanleitung_vorhanden}</Text>
        <Text>Filterkarte: {data.filterkarte_vorhanden}</Text>
        <Text>Hinweisschild: {data.hinweisschild_vorhanden}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Filteranlage montiert</Text>
        <Text>
          {data.montage_auf_dach && 'Auf Dach | '}
          {data.montage_links_hinter_kabine && 'Links hinter Kabine | '}
          {data.montage_rechts_neben_kabine && 'Rechts neben Kabine | '}
          {data.montage_direkt_hinter_kabine && 'Direkt hinter Kabine'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6-14. Prüfpunkte</Text>
        <Text>Sicherer Standplatz: {data.sicherer_standplatz}</Text>
        <Text>ROPS/FOPS unbeschädigt: {data.rops_fops_unbeschaedigt}</Text>
        <Text>Kontrollanzeige vorhanden: {data.kontrollanzeige_vorhanden}</Text>
        <Text>Kabine Abdichtung OK: {data.kabine_abdichtung_ok}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>15. Abschluss</Text>
        <Text>Mängel/Bemerkungen: {data.maengel_bemerkungen}</Text>
        <Text>Nachkontrolle erforderlich: {data.nachkontrolle_erforderlich}</Text>
        <Text>Ort: {data.ort} | Datum: {data.protokoll_datum}</Text>
        <Text>Auftraggeber: {data.auftraggeber_unterschrift} | Servicetechniker: {data.servicetechniker_unterschrift}</Text>
      </View>
    </Page>
  </Document>
);
