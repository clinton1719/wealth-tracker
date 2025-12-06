import { Avatar, AvatarFallback } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { Switch } from "@radix-ui/react-switch";
import { TabsContent } from "@radix-ui/react-tabs";
import { DynamicIcon } from "lucide-react/dynamic";
import { Button } from "@/components/ui/button";
// CHANGE FROM RADIX TO SHADECN
export function AccountsSection() {
  return (
    <TabsContent value="accounts">
      <div className="space-y-4 mt-2">
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback
                style={{ backgroundColor: "red", color: "white" }}
              >
                C
              </AvatarFallback>
            </Avatar>
            <span>Clinton Fernandes</span>
          </div>

          <div className="flex items-center gap-2">
            <Switch checked={true} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <DynamicIcon name="shield-x" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>Edit</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <Button variant="outline">Add Account</Button>
      </div>
    </TabsContent>
  );
}
