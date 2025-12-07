import { ProfilePicture } from "@/components/building-blocks/profilePicture";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Account } from "@/types/Account";
import type { AccountSectionProps } from "@/types/AccountSectionProps";
import { DynamicIcon } from "lucide-react/dynamic";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

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
      <div className="flex items-center gap-4 flex-1 min-w-0">

        <ProfilePicture
          imageSource={profile.profilePicture}
          fallbackName={profile.profileName.charAt(0)}
          imageColor={profile.colorCode}
        />

        <div className="flex flex-col min-w-0">
          <span className="text-lg font-semibold leading-none tracking-tight truncate">
            {account.accountName}
          </span>

          <span className="text-foreground/80 text-sm truncate">
            {account.description}
          </span>

          <div className="flex gap-2 mt-2">
            <Badge variant="default" className="px-2 py-1 text-sm whitespace-nowrap">
              ₹{account.accountBalance.toLocaleString()}
            </Badge>

            <Badge variant="secondary" className="px-2 py-1 text-sm whitespace-nowrap">
              {account.accountType}
            </Badge>
          </div>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="hover:bg-muted rounded-full shrink-0">
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
