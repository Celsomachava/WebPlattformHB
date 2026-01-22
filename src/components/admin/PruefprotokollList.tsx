import React from 'react';
import FormListManager from './FormListManager';
import PruefprotokollForm from './PruefprotokollForm';
import { pruefprotokollService } from '../../services/pruefprotokollService';
import { PruefprotokollPDF } from './pdf/PruefprotokollPDF';

const PruefprotokollList: React.FC = () => {
  return (
    <FormListManager
      service={{
        getAll: () => pruefprotokollService.getAll(),
        delete: (id: string) => pruefprotokollService.delete(id)
      }}
      renderForm={(id, onBack) => <PruefprotokollForm serviceAnfrageId={id} onBack={onBack} />}
      getItemLabel={(item) => `${item.fahrzeug_kennzeichen || 'Unbekannt'} - ${item.datum || ''}`}
      getItemId={(item) => item.id}
      PDFComponent={PruefprotokollPDF}
      title="Prüfprotokoll DGUV"
    />
  );
};

export default PruefprotokollList;
