import type { AlertDialogProps } from "@/types/AlertDialogProps";
import type { AlertType } from "@/types/AlertType";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function AlertDialogComponent({
  isDialogOpen,
  alertType,
  onSecondaryButtonClick,
  onPrimaryButtonClick,
}: AlertDialogProps) {
  let alert: AlertType | undefined;
  switch (alertType) {
    case "DELETE_CATEGORY":
      alert = {
        title: "Do you really want to delete this category?",
        description:
          "Deleting this category will delete all expenses and other associated entities related to it",
        primaryButton: "I acknowledge. Delete this category",
        secondaryButton: "Cancel",
      };
      break;
    case "DELETE_PROFILE":
      alert = {
        title: "Do you really want to delete this profile?",
        description:
          "Deleting this profile will delete all expenses, accounts, and associated entities related to it",
        primaryButton: "I acknowledge. Delete this profile",
        secondaryButton: "Cancel",
      };
      break;
    case "DELETE_ACCOUNT":
      alert = {
        title: "Do you really want to delete this account?",
        description:
          "Deleting this account will delete all expenses, accounts and associated entities related to it",
        primaryButton: "I acknowledge. Delete this account",
        secondaryButton: "Cancel",
      };
      break;
  }
  return (
    <AlertDialog open={isDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
          <AlertDialogDescription>{alert?.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onSecondaryButtonClick()}>
            {alert?.secondaryButton}
          </AlertDialogCancel>
          <AlertDialogAction onClick={() => onPrimaryButtonClick()}>
            {alert?.primaryButton}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
