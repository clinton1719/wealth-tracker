import type { ControllerFieldState, ControllerRenderProps, UseFormReturn } from 'react-hook-form'
import { Check, ChevronsUpDown } from 'lucide-react'

import { DynamicIcon, iconNames } from 'lucide-react/dynamic'
import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'

export function IconsComboBox({ field, fieldState, form }: IconsComboBoxProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {field.value
            ? iconNames.find(iconName => iconName === field.value)
            : 'Select an icon'}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command onChange={field.onChange}>
          <CommandInput placeholder="Search icon..." className="h-9" aria-invalid={fieldState.invalid} />
          <CommandList>
            <CommandEmpty>No icon found.</CommandEmpty>
            <CommandGroup>
              {iconNames.map(iconName => (
                <CommandItem
                  key={iconName}
                  value={iconName}
                  onChange={field.onChange}
                  aria-invalid={fieldState.invalid}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? '' : currentValue)
                    setOpen(false)
                    form.setValue('icon', currentValue)
                  }}
                >
                  <DynamicIcon name={iconName ?? 'badge-check'} />
                  {iconName}
                  <Check
                    className={cn(
                      'ml-auto',
                      value === iconName ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

interface IconsComboBoxProps {
  field: ControllerRenderProps<{
    name: string
    colorCode: string
    description?: string | undefined
    icon?: string | undefined
    tags?: string[] | undefined
  }, 'icon'>
  fieldState: ControllerFieldState
  form: UseFormReturn<{
    name: string
    colorCode: string
    description?: string | undefined
    icon?: string | undefined
    tags?: string[] | undefined
  }, any, {
    name: string
    colorCode: string
    description?: string | undefined
    icon?: string | undefined
    tags?: string[] | undefined
  }>
}
