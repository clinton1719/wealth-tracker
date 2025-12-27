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
  CardHeader,
  CardTitle,
} from '../../ui/card'

export function AccountSection({
  account,
  profile,
  handleDeleteAccount,
  handleUpdateAccount,
}: AccountSectionProps) {
  return (
    <Card
      className="card card-border"
      style={{ borderColor: profile.profileColorCode }}
    >
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>
          <ProfilePicture
            imageSource={profile.profilePicture}
            fallbackName={profile.profileName.charAt(0)}
            imageColor={profile.profileColorCode}
          />
        </CardTitle>
        <CardDescription>
          <div className="flex flex-col">
            <span className="heading4">{account.accountName}</span>
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
                onClick={() => handleUpdateAccount(account, profile)}
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
          {account.accountDescription
            ? (
                <div>
                  <p className="text-muted-foreground">Description</p>
                  <p className="font-medium">{account.accountDescription}</p>
                </div>
              )
            : null}
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
    </Card>
  )
}
