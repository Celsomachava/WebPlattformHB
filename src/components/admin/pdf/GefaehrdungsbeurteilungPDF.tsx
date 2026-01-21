import React from 'react';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { GefaehrdungsbeurteilungAussendienst } from '../../../types/gefaehrdungsbeurteilung';

const styles = StyleSheet.create({
  page: {
    padding: '10mm',
    fontSize: 7,
    fontFamily: 'Helvetica',
  },
  header: {
    textAlign: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  subtitle: {
    fontSize: 7,
    marginBottom: 5,
  },
  table: {
    width: '100%',
    marginBottom: 5,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottom: '1px solid #000',
  },
  tableCell: {
    padding: 2,
    borderRight: '1px solid #000',
    borderLeft: '1px solid #000',
    borderTop: '1px solid #000',
  },
  tableCellBold: {
    padding: 2,
    borderRight: '1px solid #000',
    borderLeft: '1px solid #000',
    borderTop: '1px solid #000',
    fontWeight: 'bold',
  },
  mainTable: {
    marginBottom: 6,
  },
  mainTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  col1: { width: '20%' },
  col2: { width: '8%' },
  col3: { width: '8%' },
  col4: { width: '14%' },
  col5: { width: '20%' },
  col6: { width: '8%' },
  col7: { width: '8%' },
  col8: { width: '14%' },
  footer: {
    fontSize: 6,
    textAlign: 'center',
    marginTop: 5,
  },
});

interface Props {
  data: GefaehrdungsbeurteilungAussendienst;
}

export const GefaehrdungsbeurteilungPDF: React.FC<Props> = ({ data }) => (
  <Document>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Gefährdungsbeurteilung nach §§ 5 und 6 Arbeitsschutzgesetz für Arbeiten im Außendienst
        </Text>
        <Text style={styles.title}>
          Baustellen/ Deponien/ Betriebsgelände/ Tagebaue/ Steinbruch
        </Text>
        <Text style={styles.subtitle}>
          Heduschka Dienstleister Betriebsanleitung/ Fachbauer Betriebsanweisung
        </Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCellBold, { width: '15%' }]}>
            <Text>Unternehmen:</Text>
          </View>
          <View style={[styles.tableCell, { width: '35%' }]}>
            <Text>{data.unternehmen}</Text>
          </View>
          <View style={[styles.tableCellBold, { width: '20%' }]}>
            <Text>Arbeitsbereich/ Baustelle:</Text>
          </View>
          <View style={[styles.tableCell, { width: '30%' }]}>
            <Text>{data.arbeitsbereich}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCellBold, { width: '15%' }]}>
            <Text>Verantwortlicher:</Text>
          </View>
          <View style={[styles.tableCell, { width: '35%' }]}>
            <Text>{data.verantwortlicher}</Text>
          </View>
          <View style={[styles.tableCellBold, { width: '20%' }]}>
            <Text>KP vor Ort:</Text>
          </View>
          <View style={[styles.tableCell, { width: '30%' }]}>
            <Text></Text>
          </View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCellBold, { width: '15%' }]}>
            <Text>Tätigkeiten:</Text>
          </View>
          <View style={[styles.tableCell, { width: '85%' }]}>
            <Text>{data.taetigkeit}</Text>
          </View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCellBold, { width: '15%' }]}>
            <Text>Arbeitsauftrag:</Text>
          </View>
          <View style={[styles.tableCell, { width: '35%' }]}>
            <Text>{data.arbeitsauftrag}</Text>
          </View>
          <View style={[styles.tableCellBold, { width: '15%' }]}>
            <Text>Auftraggeber:</Text>
          </View>
          <View style={[styles.tableCell, { width: '35%' }]}>
            <Text>{data.auftraggeber}</Text>
          </View>
        </View>
      </View>

      <View style={styles.mainTable}>
        <View style={styles.mainTableHeader}>
          <View style={[styles.tableCellBold, styles.col1]}><Text>Gefährdungen:</Text></View>
          <View style={[styles.tableCellBold, styles.col2]}><Text>ja</Text></View>
          <View style={[styles.tableCellBold, styles.col3]}><Text>nein</Text></View>
          <View style={[styles.tableCellBold, styles.col4]}><Text>Bemerkungen</Text></View>
          <View style={[styles.tableCellBold, styles.col5]}><Text>erforderliche PSA:</Text></View>
          <View style={[styles.tableCellBold, styles.col6]}><Text>ja</Text></View>
          <View style={[styles.tableCellBold, styles.col7]}><Text>nein</Text></View>
          <View style={[styles.tableCellBold, styles.col8]}><Text>Bemerkungen</Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Mechanische Gefährdung</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.mechanische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.mechanische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Schutzhelm</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text>{data.schutzhelm ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text>{!data.schutzhelm ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Elektrische Gefährdung</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.elektrische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.elektrische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Schutzbrille S3</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text>{data.schutzbrille ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text>{!data.schutzbrille ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Chemische Gefährdung</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.chemische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.chemische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Schutzhandschuhe</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text>{data.handschuhe ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text>{!data.handschuhe ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Biologische Gefährdung</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.biologische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.biologische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Sicherheitsschuhe</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Brand-/Explosionsgefährdung</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.brand_explosion ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.brand_explosion ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Gehörschutz</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text>{data.gehoerschutz ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text>{!data.gehoerschutz ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Thermische Gefährdung</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.thermische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.thermische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Atemschutz FFP2</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text>{data.ffp2_maske ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text>{!data.ffp2_maske ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Physikalische Belastungen</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.physikalische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.physikalische_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Einweghandschuhe</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text>{data.einweghandschuhe ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text>{!data.einweghandschuhe ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Umgebungsbedingungen</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.umgebungsbedingungen ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.umgebungsbedingungen ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Hautschutz</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Verkehrswege</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.verkehrswege ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.verkehrswege ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text>Fallschutz</Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>

        <View style={styles.tableRow}>
          <View style={[styles.tableCell, styles.col1]}><Text>Sonstige Gefährdung</Text></View>
          <View style={[styles.tableCell, styles.col2]}><Text>{data.sonstige_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col3]}><Text>{!data.sonstige_gefaehrdung ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, styles.col4]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col5]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col6]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col7]}><Text></Text></View>
          <View style={[styles.tableCell, styles.col8]}><Text></Text></View>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.mainTableHeader}>
          <View style={[styles.tableCellBold, { width: '30%' }]}><Text>Arbeits-/ Hilfsmittel:</Text></View>
          <View style={[styles.tableCellBold, { width: '10%' }]}><Text>ja</Text></View>
          <View style={[styles.tableCellBold, { width: '10%' }]}><Text>nein</Text></View>
          <View style={[styles.tableCellBold, { width: '30%' }]}><Text>besondere Genehmigung:</Text></View>
          <View style={[styles.tableCellBold, { width: '10%' }]}><Text>ja</Text></View>
          <View style={[styles.tableCellBold, { width: '10%' }]}><Text>nein</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '30%' }]}><Text>Leiter/ Gerüst</Text></View>
          <View style={[styles.tableCell, { width: '10%' }]}><Text>{data.leiter_geruest ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, { width: '10%' }]}><Text>{!data.leiter_geruest ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, { width: '30%' }]}><Text>Schweißerlaubnis</Text></View>
          <View style={[styles.tableCell, { width: '10%' }]}><Text>{data.schweisserlaubnis ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, { width: '10%' }]}><Text>{!data.schweisserlaubnis ? 'x' : ''}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '30%' }]}><Text>Sonstige</Text></View>
          <View style={[styles.tableCell, { width: '10%' }]}><Text></Text></View>
          <View style={[styles.tableCell, { width: '10%' }]}><Text></Text></View>
          <View style={[styles.tableCell, { width: '30%' }]}><Text>Befahrschein</Text></View>
          <View style={[styles.tableCell, { width: '10%' }]}><Text>{data.befahrschein ? 'x' : ''}</Text></View>
          <View style={[styles.tableCell, { width: '10%' }]}><Text>{!data.befahrschein ? 'x' : ''}</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '50%' }]}><Text></Text></View>
          <View style={[styles.tableCell, { width: '30%' }]}><Text>Sonstige</Text></View>
          <View style={[styles.tableCell, { width: '20%' }]}><Text>{data.besondere_genehmigung}</Text></View>
        </View>
      </View>

      <Text style={{ fontSize: 7, fontWeight: 'bold', marginBottom: 3 }}>Spezifische Sicherheitshinweise:</Text>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '40%' }]}><Text>Durchgeführte Beurteilung / Unterweisung vor Ort</Text></View>
          <View style={[styles.tableCell, { width: '15%' }]}><Text>Datum</Text></View>
          <View style={[styles.tableCell, { width: '22.5%' }]}><Text>Name, Vorname</Text></View>
          <View style={[styles.tableCell, { width: '22.5%' }]}><Text>Unterschrift</Text></View>
        </View>
        <View style={styles.tableRow}>
          <View style={[styles.tableCell, { width: '40%', height: 20 }]}><Text>{data.unterweisung_durchgefuehrt ? 'Ja' : ''}</Text></View>
          <View style={[styles.tableCell, { width: '15%' }]}><Text>{data.unterweisung_datum}</Text></View>
          <View style={[styles.tableCell, { width: '22.5%' }]}><Text>{data.unterweisung_name}</Text></View>
          <View style={[styles.tableCell, { width: '22.5%' }]}><Text>{data.unterweisung_unterschrift}</Text></View>
        </View>
      </View>

      <Text style={styles.footer}>
        Heduschka GmbH • Buchwälder Str. 28 • 01968 Senftenberg
      </Text>
    </Page>
  </Document>
);
