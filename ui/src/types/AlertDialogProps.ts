export interface AlertDialogProps {
  isDialogOpen: boolean
  alertType: string
  onSecondaryButtonClick: () => void
  onPrimaryButtonClick: () => void
}
