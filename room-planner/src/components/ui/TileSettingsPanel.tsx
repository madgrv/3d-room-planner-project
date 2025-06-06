import { useRef } from 'react';
import { Switch } from './Switch';
import { RadioGroup, RadioGroupItem } from './radio-group';
import { useRoomElementStore } from '@/store/roomElementStore';
import { useTileStore, TileSize, TileTexture } from '@/store/tileStore';
import { useLanguage } from '@/lang';

export function TileSettingsPanel() {
  const { lang } = useLanguage();
  const selectedElement = useRoomElementStore((state) => state.selectedElement);
  const panelRef = useRef<HTMLDivElement>(null);

  // Get tile settings and functions from the tile store
  const tileSettings = useTileStore((state) =>
    selectedElement ? state.elementTileSettings[selectedElement] : null
  );
  const tilingEnabled = useTileStore((state) =>
    selectedElement ? state.elementTilingEnabled[selectedElement] : false
  );
  const setTileSettings = useTileStore((state) => state.setTileSettings);
  const setTilingEnabled = useTileStore((state) => state.setTilingEnabled);

  // Common styles for consistency
  const radioLabelStyle = 'text-xs font-medium';
  const radioGroupStyle = 'flex flex-col gap-1.5 mt-1';

  // Only show panel when a room element is selected
  if (!selectedElement) {
    return null;
  }

  // Handle tile size change
  const handleTileSizeChange = (value: string): void => {
    if (selectedElement) {
      setTileSettings(selectedElement, {
        ...(tileSettings || { size: 'medium', texture: 'ceramic' }),
        size: value as TileSize,
      });
    }
  };

  // Handle tile texture change
  const handleTextureChange = (value: string): void => {
    if (selectedElement) {
      setTileSettings(selectedElement, {
        ...(tileSettings || { size: 'medium', texture: 'ceramic' }),
        texture: value as TileTexture,
      });
    }
  };


  return (
    <div ref={panelRef} className='p-4 bg-card text-card-foreground'>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium">{lang.tileSettings.enableTiling}</span>
        <Switch
          checked={tilingEnabled}
          onCheckedChange={(checked) => setTilingEnabled(selectedElement, checked)}
          aria-label={lang.tileSettings.enableTiling}
        />
      </div>

      {tilingEnabled && (
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-semibold mb-2">{lang.tileSettings.tileSize}</h4>
            <RadioGroup
              value={tileSettings?.size || 'small'}
              onValueChange={handleTileSizeChange}
              className={radioGroupStyle}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="small" id="size-small" />
                <label htmlFor="size-small" className={radioLabelStyle}>{lang.tileSettings.small}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="medium" id="size-medium" />
                <label htmlFor="size-medium" className={radioLabelStyle}>{lang.tileSettings.medium}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="large" id="size-large" />
                <label htmlFor="size-large" className={radioLabelStyle}>{lang.tileSettings.large}</label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">{lang.tileSettings.tileTexture}</h4>
            <RadioGroup
              value={tileSettings?.texture || 'wood'}
              onValueChange={handleTextureChange}
              className={radioGroupStyle}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="wood" id="texture-wood" />
                <label htmlFor="texture-wood" className={radioLabelStyle}>{lang.tileSettings.wood}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="marble" id="texture-marble" />
                <label htmlFor="texture-marble" className={radioLabelStyle}>{lang.tileSettings.marble}</label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ceramic" id="texture-ceramic" />
                <label htmlFor="texture-ceramic" className={radioLabelStyle}>{lang.tileSettings.ceramic}</label>
              </div>
            </RadioGroup>
          </div>
        </div>
      )}
    </div>
  );
}
