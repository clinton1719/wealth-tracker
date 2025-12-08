import { AccountsFeature } from "@/features/account/accountsFeature";
import { ProfilesFeature } from "@/features/profile/profilesFeature";
import { Separator } from "@/components/ui/separator";

function App() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <ProfilesFeature />
      <Separator decorative className="bg-accent"/>
      <AccountsFeature />
    </div>
  );
}

export default App;
