import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { PruefprotokollDGUV201004 } from '../../../types/pruefprotokoll';

const styles = StyleSheet.create({
  page: { padding: 10, fontSize: 6 },
  title: { fontSize: 10, fontWeight: 'bold', marginBottom: 6, textAlign: 'center' },
  section: { marginBottom: 6, borderWidth: 1, borderColor: '#000', padding: 4 },
  sectionTitle: { fontSize: 8, fontWeight: 'bold', marginBottom: 3 },
  row: { flexDirection: 'row', marginBottom: 2 },
  label: { width: '50%', fontSize: 6 },
  value: { width: '50%', fontSize: 6 }
});

interface Props {
  data: PruefprotokollDGUV201004;
}

export const PruefprotokollPDF: React.FC<Props> = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Prüf-/ Übernahmeprotokoll für Atemluftversorgungs-/ Klimaanlagen</Text>
      <Text style={{ fontSize: 7, textAlign: 'center', marginBottom: 6 }}>nach Merkblatt DGUV 201-004</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kalenderjahr: {data.kalenderjahr}</Text>
        <View style={styles.row}>
          <View style={{ width: '50%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 6 }}>Auftraggeber</Text>
            <Text style={{ fontSize: 6 }}>{data.auftraggeber_name}</Text>
            <Text style={{ fontSize: 6 }}>{data.auftraggeber_strasse}</Text>
            <Text style={{ fontSize: 6 }}>{data.auftraggeber_ort}</Text>
          </View>
          <View style={{ width: '50%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 6 }}>Betreiber</Text>
            <Text style={{ fontSize: 6 }}>{data.betreiber_name}</Text>
            <Text style={{ fontSize: 6 }}>{data.betreiber_strasse}</Text>
            <Text style={{ fontSize: 6 }}>{data.betreiber_ort}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Projekt: {data.projekt}</Text>
          <Text style={styles.value}>Kostenstelle: {data.kostenstelle}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Gerät / Fahrzeug</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Fahrzeug/Gerät: {data.fahrzeug_geraet}</Text>
          <Text style={styles.value}>Hersteller/Typ: {data.hersteller_typ}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Fahrgestell-Nr.: {data.fahrgestell_nr}</Text>
          <Text style={styles.value}>BS/km-Stand: {data.bs_km_stand}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Baujahr: {data.baujahr}</Text>
          <Text style={styles.value}>E-Anlage: {data.e_anlage}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Motor: {data.motor}</Text>
          <Text style={styles.value}>Hersteller/Typ: {data.motor_hersteller_typ}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Atemluft - Filteranlage</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Hersteller/Typ: {data.atemluft_hersteller_typ}</Text>
          <Text style={styles.value}>Serien-Nr.: {data.atemluft_seriennr}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Baujahr: {data.atemluft_baujahr}</Text>
          <Text style={styles.value}>Gewicht: {data.atemluft_gewicht}</Text>
        </View>
        <Text style={{ fontSize: 6, marginTop: 2 }}>Überdruck - Überwachungssystem Typ: {data.ueberdruck_ueberwachung_typ} | Serien-Nr.: {data.ueberdruck_ueberwachung_seriennr}</Text>
        <Text style={{ fontSize: 6, marginTop: 2 }}>Umluft - Filteranlage Typ: {data.umluft_filteranlage_typ} | Serien-Nr.: {data.umluft_filteranlage_seriennr}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontSize: 6 }}>Betriebsanleitung/Filteranlage vorhanden: {data.betriebsanleitung_vorhanden}</Text>
        <Text style={{ fontSize: 6 }}>Filterkarte vorhanden: {data.filterkarte_vorhanden}</Text>
        <Text style={{ fontSize: 6 }}>Hinweisschild: max - min Kabinendruck vorhanden (300-100 Pascal): {data.hinweisschild_kabinendruck}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Filteranlage ist montiert:</Text>
        <Text style={{ fontSize: 6 }}>
          {data.montage_auf_dach && 'auf dem Dach | '}
          {data.montage_links_hinter_kabine && 'links hinter der Kabine | '}
          {data.montage_rechts_neben_kabine && 'rechts neben der Kabine | '}
          {data.montage_direkt_hinter_kabine && 'direkt hinter der Kabine'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6-13. Prüfpunkte</Text>
        <Text style={{ fontSize: 5 }}>Filterwechsel | Sicht/Bewegung | Überdruck | Monitoring | Sicherheit | Abdichtung | Klima | Heizung</Text>
        <Text style={{ fontSize: 6, marginTop: 2 }}>Überdruck bei laufendem Motor: {data.ueberdruck_laufend}</Text>
        <Text style={{ fontSize: 6 }}>Luftzufuhr bei laufendem Motor: {data.luftzufuhr_laufend}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>15. Mängel/Bemerkungen</Text>
        <Text style={{ fontSize: 6 }}>{data.maengel_bemerkungen}</Text>
        <Text style={{ fontSize: 6, marginTop: 2 }}>Nachkontrolle, nach Mängelabstellung, erforderlich: {data.nachkontrolle_erforderlich}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Ort: {data.ort}</Text>
          <Text style={styles.value}>Datum: {data.protokoll_datum}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Auftraggeber bzw. Betreiber: {data.auftraggeber_betreiber}</Text>
          <Text style={styles.value}>Servicetechniker: {data.servicetechniker}</Text>
        </View>
      </View>
    </Page>
  </Document>
);
