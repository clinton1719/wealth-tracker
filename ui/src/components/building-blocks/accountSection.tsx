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

export function AccountSection({
  account,
  profile,
  form,
  setAccountDialogOpen,
  setIsUpdate,
  handleDeleteAccount,
}: AccountSectionProps) {
  const handleUpdateAccount = (Account: Account) => {
    form.reset(Account);
    setAccountDialogOpen(true);
    setIsUpdate(true);
  };

  return (
    <div className="flex items-center justify-between p-3 border rounded-lg" style={{ backgroundColor: `${profile.colorCode}33` }}>
      <div className="flex items-center gap-3">
        <ProfilePicture
          imageSource={profile.profilePicture}
          fallbackName={profile.profileName.charAt(0)}
          imageColor={profile.colorCode}
        />
        <div className="flex flex-col">
          <span
            className="scroll-m-20 text-xl font-semibold tracking-tight"
          >
            {account.accountName}
          </span>
          <span>
            {account.description}
          </span>
        </div>
        <span>
            Account Balance: {account.accountBalance}
        </span>
        <span>
            Account Type: {account.accountType}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" size="icon">
              <DynamicIcon name="edit" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-56 bg-white shadow-md"
            align="start"
          >
            <DropdownMenuItem onClick={() => handleUpdateAccount(account)} style={{ cursor: 'pointer' }}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDeleteAccount(account)} style={{ cursor: 'pointer' }}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
