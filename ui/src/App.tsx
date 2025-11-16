import { DynamicIcon } from "lucide-react/dynamic"
import { Avatar, AvatarFallback } from "./components/ui/avatar"
import { Button } from "./components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./components/ui/dropdown-menu"
import { Switch } from "./components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs"

function App() {

  return (
    <div className="flex justify-center">
      <Card className="hover:shadow-md transition flex justify-between sm:min-w-lg">
        <CardHeader>
          <CardTitle>Manage Profiles & Accounts</CardTitle>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="profiles">
            <TabsList>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="profiles">
              <div className="space-y-4 mt-2">
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback style={{backgroundColor: 'red', color: 'white'}}>C</AvatarFallback>
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

                <Button variant="outline">Add Profile</Button>
              </div>
            </TabsContent>

            <TabsContent value="accounts">{/* similar */}</TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default App
