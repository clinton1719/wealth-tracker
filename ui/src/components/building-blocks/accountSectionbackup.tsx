import type { Account } from "@/types/Account";
import type { AccountSectionProps } from "@/types/AccountSectionProps";
import { DynamicIcon } from "lucide-react/dynamic";
import { ProfilePicture } from "@/components/building-blocks/profilePicture";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "../ui/card";

export function AccountSection({
  account,
  profile,
  form,
  setAccountDialogOpen,
  setIsUpdate,
  handleDeleteAccount,
}: AccountSectionProps) {
  const handleUpdateAccount = (account: Account) => {
    form.reset(account);
    form.setValue("profileName", profile.profileName);
    setAccountDialogOpen(true);
    setIsUpdate(true);
  };

  return (
    <Card
      className="flex flex-row items-center justify-between p-4 shadow-sm border rounded-xl"
      style={{ backgroundColor: `${profile.colorCode}15` }}
    >
      <div className="flex items-center gap-4 flex-1 w-40 md:w-96 min-w-0">
        <ProfilePicture
          imageSource={profile.profilePicture}
          fallbackName={profile.profileName.charAt(0)}
          imageColor={profile.colorCode}
        />

        <div className="flex flex-col min-w-full">
          <span className="text-lg font-semibold leading-none tracking-tight wrap-break-word">
            {account.accountName}
          </span>

          <span className="text-foreground/70 text-sm mt-1 whitespace-normal wrap-break-word">
            {account.description}
          </span>

          <dl className="mt-3 text-sm space-y-1 mr-8">
            <div className="flex justify-between">
              <dt className="font-medium text-foreground">Account balance:</dt>
              <dd className="font-semibold">
                ₹{account.accountBalance.toLocaleString()}
              </dd>
            </div>

            <div className="flex justify-between">
              <dt className="font-medium text-foreground">Account type:</dt>
              <dd className="font-semibold">{account.accountType}</dd>
            </div>
          </dl>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-muted rounded-full shrink-0"
          >
            <DynamicIcon name="ellipsis-vertical" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuItem onClick={() => handleUpdateAccount(account)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDeleteAccount(account)}>
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Card>
  );
}
