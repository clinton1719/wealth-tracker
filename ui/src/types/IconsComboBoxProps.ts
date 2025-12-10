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
      categoryIcon?: string | undefined;
      profileName: string;
      tags?: string[] | undefined;
    },
    "categoryIcon"
  >;
  fieldState: ControllerFieldState;
  form: UseFormReturn<
    {
      categoryName: string;
      colorCode: string;
      description?: string | undefined;
      categoryIcon?: string | undefined;
      profileName: string;
      tags?: string[] | undefined;
    },
    any,
    {
      categoryName: string;
      colorCode: string;
      description?: string | undefined;
      categoryIcon?: string | undefined;
      profileName: string;
      tags?: string[] | undefined;
    }
  >;
}
