import type { FixedDepositSectionProps } from '@/types/FixedDepositSectionProps'
import { DynamicIcon } from 'lucide-react/dynamic'
import { ProfilePicture } from '@/components/building-blocks/profilePicture'
import { Badge } from '@/components/ui/badge'
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

export function FixedDepositSection({
  fixedDeposit,
  profile,
  handleDeleteFixedDeposit,
}: FixedDepositSectionProps) {
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
            <span className="heading4">{fixedDeposit.fixedDepositName}</span>
          </div>
        </CardDescription>
        <Badge variant="secondary">Active</Badge>
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
                // onClick={() => handleUpdateAccount(account)}
                className="cursor-pointer"
              >
                Cancel (penalty incl.)
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteFixedDeposit(fixedDeposit)}
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
            <p className="text-muted-foreground">Interest rate:</p>
            <p className="font-medium">{formatCurrency(fixedDeposit.fixedDepositInterestRate)}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Principal:</p>
            <p className="font-medium">{fixedDeposit.fixedDepositPrincipal}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Start date:</p>
            {/* <p className="font-medium">{formatDate(fixedDeposit.fixedDepositStartDate)}</p> */}
          </div>
          <div>
            <p className="text-muted-foreground">Tenure:</p>
            <p className="font-medium">{fixedDeposit.fixedDepositTenure}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
