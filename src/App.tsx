import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch"
import { Settings, Paintbrush } from "lucide-react";


import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import ClearScreen from "./components/tabs/ClearScreen";
import AdvancedScreen from "./components/tabs/AdvancedScreen";
import { ScreenStackProvider } from "./navigation/ScreenStackProvider";


const App = () => {
  const [isDark, setIsDark] = useState(true);

  return (

    <Card className={`w-[370px] relative py-4 gap-2 rounded-none text-sm ${isDark ? "dark" : ""}`}>
      <CardHeader className="m-0 px-4 border-b-2">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold">Neat web</h1>
          <div className="flex items-center gap-2">
            <span>{isDark ? "🌙" : "☀️"}</span>
            <Switch checked={isDark} onCheckedChange={setIsDark} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex flex-col px-0">
        <Tabs defaultValue="clear" className="flex flex-col flex-1">
          <div className="overflow-y-auto space-y-4 h-[370px] pt-2 px-4 pb-4 mb-8">
            <TabsContent value="clear">
              <ClearScreen />
            </TabsContent>

            <TabsContent value="advanced">
              <ScreenStackProvider>
                <AdvancedScreen />
              </ScreenStackProvider>
            </TabsContent>
          </div>

          <TabsList className="grid grid-cols-2 rounded-none w-full h-12 mt-4 absolute left-0 bottom-0">
            <TabsTrigger value="clear" className="rounded-none w-full flex items-center justify-center gap-1">
              <Paintbrush className="w-4 h-4" />
              Clear
            </TabsTrigger>
            <TabsTrigger value="advanced" className="rounded-none w-full flex items-center justify-center gap-1">
              <Settings className="w-4 h-4" />
              Advanced
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardContent>
    </Card>

  );
};

export default App;
