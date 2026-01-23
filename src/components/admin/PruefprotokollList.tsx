import React from 'react';
import { FormListManager } from './FormListManager';
import PruefprotokollForm from './PruefprotokollForm';
import { pruefprotokollService } from '../../services/pruefprotokollService';

const PruefprotokollList: React.FC = () => {
  return (
    <FormListManager
      service={{
        getAll: () => pruefprotokollService.getAll(),
        delete: (id: string) => pruefprotokollService.delete(id)
      }}
      renderForm={(id, onBack) => <PruefprotokollForm serviceAnfrageId={id} onBack={onBack} />}
      getItemLabel={(item) => `${item.fahrzeug_geraet || 'Unbekannt'} - ${item.protokoll_datum || ''}`}
      getItemId={(item) => item.id}
      title="Prüfprotokoll DGUV"
    />
  );
};

export default PruefprotokollList;
