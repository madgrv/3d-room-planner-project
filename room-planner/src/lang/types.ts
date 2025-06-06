// Type definitions for language strings
// All language files must conform to this structure

// Type for the top-level language object exported by each language file
// This object contains 'sidebar' (shared UI labels) and a language code key ('en', 'it', etc.)
// The language code key contains all actual translation strings, matching the structure of the 'en' object
// Type definition for the flat structure of localisation files
// All translation sections (sidebar, app, themeSwitcher, etc.) are at the top level
export type LanguageStrings = {
  sidebar: {
    roomSettings: string;
    furnitureLibrary: string;
    tileSettings: {
      title: string;
      enableTiling: string;
      tileSize: string;
      tileTexture: string;
      small: string;
      medium: string;
      large: string;
      extraLarge: string;
      ceramic: string;
      marble: string;
      floreal: string;
      wood: string;
      floor: string;
      wallFront: string;
      wallBack: string;
      wallLeft: string;
      wallRight: string;
      ceiling: string;
      selectSurface: string;
    };
  };
  code: string;
  app: {
    title: string;
    subtitle: string;
  };
  themeSwitcher: {
    toggleLabel: string;
    lightMode: string;
    darkMode: string;
  };
  languageSelector: {
    selectLanguage: string;
    english: string;
    italian: string;
    french: string;
    spanish: string;
  };
  roomControls: {
    title: string;
    widthLabel: string;
    lengthLabel: string;
    heightLabel: string;
    applyButton: string;
  };
  viewControls: {
    title: string;
    orthographicView: string;
    perspectiveView: string;
    cornerView: string;
    topView: string;
    frontView: string;
    sideView: string;
    loading: string;
  };
  furnitureControls: {
    title: string;
    addItem: string;
    removeItem: string;
    addLabel: string;
    removeLabel: string;
    selectType: string;
    noFurniture: string;
    chair: string;
    table: string;
    sofa: string;
    bed: string;
    wardrobe: string;
  };
  outlinerPanel: {
    title: string;
    emptyState: string;
    visibility: string;
    select: string;
    rename: string;
    delete: string;
  };
  contextMenu: {
    title: string;
    mode: string;
    select: string;
    move: string;
    rotate: string;
    snap: string;
    duplicate: string;
    edit: string;
    delete: string;
    hide: string;
    show: string;
    itemType: string;
    movementAxis: string;
    floorPlane: string;
    xAxis: string;
    yAxis: string;
    zAxis: string;
    operations: string;
    rotation: string;
    rotateCounterClockwise: string;
    rotateClockwise: string;
    snapOn: string;
    snapOff: string;
    placeOnFloor: string;
    hideElement: string;
    showElement: string;
    selectElement: string;
    editElement: string;
    changeTexture: string;
    textureChangeMessage: string;
    noItemSelected: string;
    floor: string;
    wallFront: string;
    wallBack: string;
    wallLeft: string;
    wallRight: string;
    ceiling: string;
    roomElement: string;
  };
  statusBar: {
    selectedObject: string;
    position: string;
    rotation: string;
    noSelection: string;
    snapEnabled: string;
    snapDisabled: string;
    mode: string;
    selectMode: string;
    moveMode: string;
    rotateMode: string;
    moveFloorPlane: string;
    moveXAxis: string;
    moveYAxis: string;
    moveZAxis: string;
    type: string;
    visible: string;
    grid: string;
    snapValue: string;
    axis: string;
    increment: string;
    rotateBy: string;
    rotate: string;
    rotateCounterClockwise: string;
    rotateClockwise: string;
    tiles: string;
    toggleTiling: string;
  };

  furnitureLibrary: {
    chairLabel: string;
    chairDimensions: string;
    tableLabel: string;
    tableDimensions: string;
    sofaLabel: string;
    sofaDimensions: string;
    bedLabel: string;
    bedDimensions: string;
    wardrobeLabel: string;
    wardrobeDimensions: string;
  };
};

// For future maintainers: All language files must export an object matching this shape.
// Access translation strings as lang.statusBar, lang.furnitureControls, etc.
// Shared sidebar labels are in lang.sidebar.
