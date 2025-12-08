import { AccountsSection } from "@/features/account/accountsSection";
import { ProfilesSection } from "@/features/profile/profilesSection";
import { Separator } from "@/components/ui/separator";

function App() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <ProfilesSection />
      <Separator decorative className="bg-accent"/>
      <AccountsSection />
    </div>
  );
}

export default App;
