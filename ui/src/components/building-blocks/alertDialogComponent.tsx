import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export function AlertDialogComponent({ isDialogOpen, alertType, onSecondaryButtonClick, onPrimaryButtonClick }: AlertDialogProps) {
    let alert: AlertType | undefined;
    switch (alertType) {
        case 'DELETE_CATEGORY':
            alert = {
                title: 'Do you really want to delete this category?',
                description: 'Deleting this category will move all current assigned expenses/items to the default category.',
                primaryButton: "Delete this category",
                secondaryButton: "Cancel"
            }
    }
    return (
        <AlertDialog open={isDialogOpen}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{alert?.title}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {alert?.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onSecondaryButtonClick()}>{alert?.secondaryButton}</AlertDialogCancel>
                    <AlertDialogAction onClick={() => onPrimaryButtonClick()}>{alert?.primaryButton}</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

interface AlertDialogProps {
    isDialogOpen: boolean,
    alertType: string;
    onSecondaryButtonClick: any
    onPrimaryButtonClick: any
}

interface AlertType {
    title: string;
    description: string;
    primaryButton: string;
    secondaryButton: string;
}