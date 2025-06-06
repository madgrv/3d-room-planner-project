// Sidebar.tsx
// Blender-like sidebar for the 3D Room Planner: accordion for Room Settings and Furniture Library
// All user-facing text is localised via lang. All UI primitives are SHADCN components.

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
import { useLanguage } from '@/lang';
import { RoomControls } from './RoomControls';
import { FurnitureLibrary } from './FurnitureLibrary';
import { TileSettingsPanel } from './TileSettingsPanel';

export function Sidebar() {
  const { lang } = useLanguage();

  return (
    <aside className="w-full max-w-xs bg-card text-card-foreground border-r border-border h-full flex flex-col">
      <Accordion type="multiple" defaultValue={["room-settings"]} className="w-full">
        <AccordionItem value="room-settings">
          <AccordionTrigger className="px-4">{lang.sidebar?.roomSettings || 'Room Settings'}</AccordionTrigger>
          <AccordionContent>
            <RoomControls />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="furniture-library">
          <AccordionTrigger className="px-4">{lang.sidebar?.furnitureLibrary || 'Furniture Library'}</AccordionTrigger>
          <AccordionContent>
            <FurnitureLibrary />
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tile-settings">
          <AccordionTrigger className="px-4">{lang.sidebar?.tileSettings || 'Tile Settings'}</AccordionTrigger>
          <AccordionContent>
            <TileSettingsPanel />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}
