import React from 'react';
import FormListManager from './FormListManager';
import ArbeitsauftragModule from './ArbeitsauftragModule';
import { arbeitsauftragService } from '../../services/arbeitsauftragService';
import { ArbeitsauftragPDF } from './pdf/ArbeitsauftragPDF';

const ArbeitsauftragList: React.FC = () => {
  return (
    <FormListManager
      service={{
        getAll: () => arbeitsauftragService.getAll(),
        delete: (id: string) => arbeitsauftragService.delete(id)
      }}
      renderForm={(id, onBack) => <ArbeitsauftragModule serviceAnfrageId={id} onBack={onBack} />}
      getItemLabel={(item) => `${item.kunde_name || 'Unbekannt'} - ${item.datum || ''}`}
      getItemId={(item) => item.id}
      PDFComponent={ArbeitsauftragPDF}
      title="Arbeitsauftrag"
    />
  );
};

export default ArbeitsauftragList;
