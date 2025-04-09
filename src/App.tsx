import ClearScreen from "./components/tabs/ClearScreen";
import AdvancedScreen from "./components/tabs/AdvancedScreen";
import AppLayoutWithTabs from "@/layout/AppLayoutWithTabs";

const App = () => {
  const params = new URLSearchParams(window.location.search);
  const initialTab = params.get("tab") || "clear";

  console.log("initialTab", initialTab);

  return (
    <AppLayoutWithTabs activeTab={initialTab as "clear" | "advanced"}>
      {{
        clear: <ClearScreen />,
        advanced: <AdvancedScreen />,
      }}
    </AppLayoutWithTabs>
  );
};

export default App;
