// Italian language strings for the 3D Room Planner application
// This file follows the structure defined in the English language file

import en from './en';

// Define the Italian language using the English file as the type definition
const it: typeof en = {
  code: 'it',
  app: {
    title: 'offCanvas',
    subtitle: 'Pianificatore di Stanze 3D',
  },
  themeSwitcher: {
    toggleLabel: 'Cambia tema',
    lightMode: 'Tema Chiaro',
    darkMode: 'Tema Scuro',
  },
  roomControls: {
    title: 'Impostazioni Stanza',
    widthLabel: 'Larghezza',
    lengthLabel: 'Lunghezza',
    heightLabel: 'Altezza',
    applyButton: 'Applica Modifiche',
  },
  viewControls: {
    title: 'Impostazioni Vista',
    orthographicView: 'Ortografica',
    perspectiveView: 'Prospettiva',
    cornerView: 'Vista 3D',
    topView: 'Vista dall\'Alto',
    frontView: 'Vista Frontale',
    sideView: 'Vista Laterale',
    loading: 'Caricamento...',
  },
  furnitureControls: {
    title: 'Arredamento',
    addItem: 'Aggiungi Elemento',
    removeItem: 'Rimuovi Elemento',
    addLabel: 'Aggiungi',
    removeLabel: 'Rimuovi',
    selectType: 'Seleziona tipo',
    noFurniture: 'Nessun arredamento aggiunto',
    chair: 'Sedia',
    table: 'Tavolo',
    sofa: 'Divano',
    bed: 'Letto',
    wardrobe: 'Armadio',
  },
  outlinerPanel: {
    title: 'Struttura',
    emptyState: 'Nessun oggetto nella scena',
    visibility: 'Attiva/disattiva visibilità',
    select: 'Seleziona oggetto',
    rename: 'Rinomina',
    delete: 'Elimina',
  },
  contextMenu: {
    title: 'Opzioni Oggetto',
    mode: 'Modalità',
    select: 'Seleziona',
    move: 'Sposta',
    rotate: 'Ruota',
    snap: 'Aggancia elemento',
    duplicate: 'Duplica',
    edit: 'Modifica',
    delete: 'Elimina',
    hide: 'Nascondi',
    show: 'Mostra',
  },
  statusBar: {
    selectedObject: 'Selezionato:',
    position: 'Posizione:',
    rotation: 'Rotazione:',
    noSelection: 'Nessuna selezione',
    snapEnabled: 'Aggancio attivato',
    snapDisabled: 'Aggancio disattivato',
    mode: 'Modalità:',
    selectMode: 'Seleziona',
    moveMode: 'Sposta',
    rotateMode: 'Ruota',
  },
};

export default it;
