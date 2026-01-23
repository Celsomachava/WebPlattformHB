import React from 'react';
import { FormListManager } from './FormListManager';
import WochenplanModule from './WochenplanModule';
import { wochenplanService } from '../../services/wochenplanService';

const WochenplanList = () => {
  return (
    <FormListManager
      service={{
        getAll: () => wochenplanService.getAll(),
        delete: (id) => wochenplanService.delete(id)
      }}
      renderForm={(id, onBack) => <WochenplanModule serviceAnfrageId={id} onBack={onBack} />}
      getItemLabel={(item) => `KW ${item.kalenderwoche} - ${item.techniker_name || 'Unbekannt'}`}
      getItemId={(item) => item.id}
      title="Wochenplan"
    />
  );
};

export default WochenplanList;
