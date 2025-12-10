import type {
  ControllerFieldState,
  ControllerRenderProps,
  UseFormReturn,
} from "react-hook-form";

export interface IconsComboBoxProps {
  field: ControllerRenderProps<
    {
      categoryName: string;
      categoryColorCode: string;
      categoryDescription?: string | undefined;
      categoryIcon?: string | undefined;
      profileName: string;
      categoryTags?: string[] | undefined;
    },
    "categoryIcon"
  >;
  fieldState: ControllerFieldState;
  form: UseFormReturn<
    {
      categoryName: string;
      categoryColorCode: string;
      categoryDescription?: string | undefined;
      categoryIcon?: string | undefined;
      profileName: string;
      categoryTags?: string[] | undefined;
    },
    any,
    {
      categoryName: string;
      categoryColorCode: string;
      categoryDescription?: string | undefined;
      categoryIcon?: string | undefined;
      profileName: string;
      categoryTags?: string[] | undefined;
    }
  >;
}
