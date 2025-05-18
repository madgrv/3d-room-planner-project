import { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
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

  // Position the panel below the toolbar
  useEffect(() => {
    if (panelRef.current && selectedElement) {
      // Position the panel at the top right, below the toolbar
      panelRef.current.style.right = '0';
      panelRef.current.style.top = '0';
    }
  }, [selectedElement]);

  // Only show panel when a room element is selected
  if (!selectedElement) {
    return null;
  }

  // Common styles for consistency
  const radioLabelStyle = 'text-xs font-medium';
  const radioGroupStyle = 'flex flex-col gap-1.5 mt-1';

  // Get readable name for the selected element
  const getElementName = (element: string) => {
    switch (element) {
      case 'floor':
        return lang.tileSettings.floor;
      case 'wall-front':
        return lang.tileSettings.wallFront;
      case 'wall-back':
        return lang.tileSettings.wallBack;
      case 'wall-left':
        return lang.tileSettings.wallLeft;
      case 'wall-right':
        return lang.tileSettings.wallRight;
      case 'ceiling':
        return lang.tileSettings.ceiling;
      default:
        return element;
    }
  };

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

  // Handle tiling toggle
  const handleTilingToggle = (enabled: boolean) => {
    if (selectedElement) {
      setTilingEnabled(selectedElement, enabled);
    }
  };

  return (
    <div
      ref={panelRef}
      className='absolute right-0 top-0 z-30 tile-controls-floating'
      style={{ marginTop: '-1px' }} // Connect seamlessly with the toolbar
    >
      <Card className='w-64 rounded-t-none rounded-br-none rounded-bl-md border-t-0 [box-shadow:var(--shadow-md)]'>
        <CardHeader className='pb-3'>
          <CardTitle className='text-sm'>
            {lang.tileSettings.title}: {getElementName(selectedElement)}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex items-center justify-between mb-3'>
            <label className='block text-xs font-medium'>
              {lang.tileSettings.enableTiling}
            </label>
            <Switch
              id='tiling-toggle'
              checked={tilingEnabled}
              onCheckedChange={handleTilingToggle}
              className='ml-2'
            />
          </div>

          {tilingEnabled && tileSettings && (
            <div className='flex flex-col gap-3'>
              <div>
                <label className={radioLabelStyle}>
                  {lang.tileSettings.tileSize}
                </label>
                <RadioGroup
                  value={tileSettings.size}
                  onValueChange={(value: string) => handleTileSizeChange(value)}
                  className={radioGroupStyle}
                >
                  <div className='flex items-center gap-1'>
                    <RadioGroupItem value='small' id='size-small' />
                    <label
                      htmlFor='size-small'
                      className='text-xs whitespace-nowrap'
                    >
                      {lang.tileSettings.small} (25cm)
                    </label>
                  </div>
                  <div className='flex items-center gap-1'>
                    <RadioGroupItem value='medium' id='size-medium' />
                    <label
                      htmlFor='size-medium'
                      className='text-xs whitespace-nowrap'
                    >
                      {lang.tileSettings.medium} (50cm)
                    </label>
                  </div>
                  <div className='flex items-center gap-1'>
                    <RadioGroupItem value='large' id='size-large' />
                    <label
                      htmlFor='size-large'
                      className='text-xs whitespace-nowrap'
                    >
                      {lang.tileSettings.large} (75cm)
                    </label>
                  </div>
                  <div className='flex items-center gap-1'>
                    <RadioGroupItem value='extraLarge' id='size-xl' />
                    <label
                      htmlFor='size-xl'
                      className='text-xs whitespace-nowrap'
                    >
                      {lang.tileSettings.extraLarge} (100cm)
                    </label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <label className={radioLabelStyle}>
                  {lang.tileSettings.tileTexture}
                </label>
                <RadioGroup
                  value={tileSettings.texture}
                  onValueChange={(value: string) => handleTextureChange(value)}
                  className={radioGroupStyle}
                >
                  <div className='flex items-center gap-1'>
                    <RadioGroupItem value='ceramic' id='texture-ceramic' />
                    <label htmlFor='texture-ceramic' className='text-xs'>
                      {lang.tileSettings.ceramic}
                    </label>
                  </div>
                  <div className='flex items-center gap-1'>
                    <RadioGroupItem value='marble' id='texture-floreal' />
                    <label htmlFor='texture-floreal' className='text-xs'>
                      {lang.tileSettings.floreal || 'Floreal'}
                    </label>
                  </div>
                </RadioGroup>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
