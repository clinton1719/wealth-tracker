import type { Account } from '@/types/Account'
import type { AccountSectionProps } from '@/types/AccountSectionProps'
import { DynamicIcon } from 'lucide-react/dynamic'
import { ProfilePicture } from '@/components/building-blocks/profilePicture'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency } from '@/utilities/helper'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../ui/card'

export function AccountSection({
  account,
  profile,
  form,
  setAccountDialogOpen,
  setIsUpdate,
  handleDeleteAccount,
}: AccountSectionProps) {
  const handleUpdateAccount = (account: Account) => {
    form.reset({
      ...account,
      accountDescription: account.accountDescription ?? '',
    })
    form.setValue('profileName', profile.profileName)
    setAccountDialogOpen(true)
    setIsUpdate(true)
  }

  return (
    <Card
      className="card card-border"
      style={{ borderColor: profile.profileColorCode }}
    >
      <CardHeader>
        <CardTitle>
          <ProfilePicture
            imageSource={profile.profilePicture}
            fallbackName={profile.profileName.charAt(0)}
            imageColor={profile.profileColorCode}
          />
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col">
            <span className="card-title">{account.accountName}</span>
            <span className="description">{account.accountDescription}</span>
          </div>
        </CardDescription>
        <CardAction>
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
              <DropdownMenuItem
                onClick={() => handleUpdateAccount(account)}
                className="cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteAccount(account)}
                className="cursor-pointer"
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <p className="text-muted-foreground">Account balance:</p>
            <p className="font-medium">{formatCurrency(account.accountBalance)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Account type:</p>
            <p className="font-medium">{account.accountType}</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col gap-2"></CardFooter>
    </Card>
  )
}
