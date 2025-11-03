"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PARAPHRASE_MODES } from "@/lib/constants"

interface ModeSelectorProps {
  value: string
  onChange: (value: string) => void
}

export function ModeSelector({ value, onChange }: ModeSelectorProps) {
  const selectedMode = PARAPHRASE_MODES.find((m) => m.value === value)
  
  return (
    <div className="space-y-2">
      <Label htmlFor="mode-selector" className="text-center block">Paraphrasing Mode</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger id="mode-selector" className="text-center justify-center">
          <SelectValue placeholder="Select a mode" className="text-center">
            {selectedMode ? selectedMode.label : "Select a mode"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {PARAPHRASE_MODES.map((mode) => (
            <SelectItem key={mode.value} value={mode.value}>
              <div className="text-center w-full">
                <div className="font-medium">{mode.label}</div>
                <div className="text-xs text-muted-foreground">
                  {mode.description}
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

