import React from 'react';
import FormListManager from './FormListManager';
import GefaehrdungsbeurteilungModule from './GefaehrdungsbeurteilungModule';
import { gefaehrdungsbeurteilungService } from '../../services/gefaehrdungsbeurteilungService';
import { GefaehrdungsbeurteilungPDF } from './pdf/GefaehrdungsbeurteilungPDF';

const GefaehrdungsbeurteilungList: React.FC = () => {
  return (
    <FormListManager
      service={{
        getAll: () => gefaehrdungsbeurteilungService.getAll(),
        delete: (id: string) => gefaehrdungsbeurteilungService.delete(id)
      }}
      renderForm={(id, onBack) => <GefaehrdungsbeurteilungModule serviceAnfrageId={id} onBack={onBack} />}
      getItemLabel={(item) => `${item.unternehmen || 'Unbekannt'} - ${item.datum || ''}`}
      getItemId={(item) => item.id}
      PDFComponent={GefaehrdungsbeurteilungPDF}
      title="Gefährdungsbeurteilung"
    />
  );
};

export default GefaehrdungsbeurteilungList;
