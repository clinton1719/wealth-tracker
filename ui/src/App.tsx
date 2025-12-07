import { Tabs, TabsList, TabsTrigger } from "@/components/ui//tabs";
import { AccountsSection } from "@/features/account/accountsSection";
import { ProfilesSection } from "@/features/profile/profilesSection";

function App() {
  return (
     <div className="flex w-full max-w-sm flex-col gap-6 mx-auto mt-8">
          <Tabs defaultValue="profiles">
            <TabsList>
              <TabsTrigger value="profiles">Profiles</TabsTrigger>
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
            </TabsList>

            <ProfilesSection />
            <AccountsSection />
          </Tabs>
    </div>
  );
}

export default App;
