import type {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn,
} from "react-hook-form";

export interface IconsComboBoxProps {
  field: ControllerRenderProps<
    {
      categoryName: string;
      colorCode: string;
      description?: string | undefined;
      icon?: string | undefined;
      tags?: string[] | undefined;
    },
    "icon"
  >;
  fieldState: ControllerFieldState;
  form: UseFormReturn<
    {
      categoryName: string;
      colorCode: string;
      description?: string | undefined;
      icon?: string | undefined;
      tags?: string[] | undefined;
    },
    any,
    {
      categoryName: string;
      colorCode: string;
      description?: string | undefined;
      icon?: string | undefined;
      tags?: string[] | undefined;
    }
  >;
}
