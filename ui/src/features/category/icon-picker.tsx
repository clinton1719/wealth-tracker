"use client";

import * as React from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";
// Import all icons from lucide-react dynamically
import { icons as LucideIconsMap, type Icon as LucideIconType } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Typescript helper to get the icon names
type IconName = keyof typeof LucideIconsMap;

// Cast the icons object to the correct type
const lucideIconNames: IconName[] = Object.keys(LucideIconsMap) as IconName[];

// A helper component to render a Lucide Icon by name
const Icon = ({ name, ...props }: { name: IconName } & React.ComponentProps<LucideIconType>) => {
  // Look up the component using the name from the reliable map
  const LucideIconComponent = LucideIconsMap[name]; 
  // It's a good idea to check if it exists, though it should if your list is correct
  if (!LucideIconComponent) return null; 

  return <LucideIconComponent {...props} />;
};

interface IconPickerProps {
  value: IconName;
  onChange: (iconName: IconName) => void;
  // Optional for customization
  className?: string;
  triggerPlaceholder?: string;
}

export function IconPicker({
  value,
  onChange,
  className,
  triggerPlaceholder = "Select an icon",
}: IconPickerProps) {
  const [open, setOpen] = React.useState(false);
  const selectedIconName = value;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-[200px] justify-between", className)}
        >
          {selectedIconName ? (
            <div className="flex items-center">
              {/* Display the selected Icon itself */}
              <Icon name={selectedIconName} className="mr-2 h-4 w-4" />
              {/* Display a human-readable name */}
              {selectedIconName.replace(/([A-Z])/g, ' $1').trim()}
            </div>
          ) : (
            <div className="flex items-center text-muted-foreground">
              <Sparkles className="mr-2 h-4 w-4 opacity-50" />
              {triggerPlaceholder}
            </div>
          )}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search icons..." />
          <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
              {lucideIconNames.map((iconName) => (
                <CommandItem
                  key={iconName}
                  value={iconName}
                  onSelect={() => {
                    onChange(iconName);
                    setOpen(false);
                  }}
                  className="flex items-center justify-between"
                >
                  {/* Display the icon */}
                  <Icon name={iconName} className="h-4 w-4 mr-2" />
                  {/* Display the name */}
                  <span className="grow text-left">
                    {iconName.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                  {/* Checkmark for selection */}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedIconName === iconName ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}