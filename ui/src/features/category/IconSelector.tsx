"use client";

import { useState } from "react";
import { IconPicker } from "./icon-picker";

type IconName = any;

export default function IconPickerDemo() {
  const [selectedIcon, setSelectedIcon] = useState<IconName>("Sparkles");

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Choose a Category Icon</h1>
      <div className="flex items-center space-x-4">
        <IconPicker 
          value={selectedIcon} 
          onChange={setSelectedIcon} 
        />
        <p className="text-sm text-muted-foreground">
          Selected: <span className="font-semibold">{selectedIcon}</span>
        </p>
      </div>
    </div>
  );
}