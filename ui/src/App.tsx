import { AccountsSection } from "@/features/account/accountsSection";
import { ProfilesSection } from "@/features/profile/profilesSection";

function App() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-8">
      <ProfilesSection />
      <AccountsSection />
    </div>
  );
}

export default App;
