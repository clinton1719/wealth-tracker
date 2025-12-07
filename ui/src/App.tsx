import { Tabs, TabsList, TabsTrigger } from "@/components/ui//tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccountsSection } from "@/features/account/accountsSection";
import { ProfilesSection } from "@/features/profile/profilesSection";

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

            <ProfilesSection />
            <AccountsSection />
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
