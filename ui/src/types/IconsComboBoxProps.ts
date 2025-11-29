import type { ControllerFieldState, ControllerRenderProps, UseFormReturn } from "react-hook-form"

export interface IconsComboBoxProps {
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