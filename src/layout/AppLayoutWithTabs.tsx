import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Paintbrush, Settings, ExternalLink } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import { ScreenStackContext } from "@/navigation/context";
import { getLastTab, saveLastTab } from "@/utils/storage";

type Props = {
  activeTab?: "clear" | "advanced";
  showTabs?: boolean;
  children: {
    clear: React.ReactNode;
    advanced: React.ReactNode;
  };
};

const AppLayoutWithTabs = ({
  children,
  activeTab = "clear",
  showTabs = true,
}: Props) => {
  const [tab, setTab] = useState<"clear" | "advanced">(activeTab);
  const extensionIcon = chrome.runtime?.getURL("icons/icon128.png");
  const isStandalonePopup =
    new URLSearchParams(window.location.search).get("popup") === "true";

  const { stack } = useContext(ScreenStackContext);

  useEffect(() => {
    getLastTab().then((storedTab) => {
      setTab(storedTab);
    });
  }, []);

  const handleTabChange = (val: string) => {
    const typed = val as "clear" | "advanced";
    setTab(typed);
    saveLastTab(typed);
  };

  const handleOpenInWindow = () => {
    const screenStackIds = stack.map((screen) => screen.id).join(",");
    const url = chrome.runtime.getURL(
      `src/index.html?popup=true&tab=${tab}&stack=${screenStackIds}`
    );

    chrome.windows.getCurrent((currentWindow) => {
      const screenWidth = currentWindow?.width || screen.availWidth;

      chrome.windows.create({
        url,
        type: "popup",
        width: 370,
        height: 490,
        left: screenWidth - 300,
        top: 130,
      });

      window.close();
    });
  };

  return (
    <Card
      className={`${
        isStandalonePopup ? "w-full h-screen" : "w-[370px] h-[490px]"
      } relative gap-2 py-0 rounded-none text-sm dark`}
    >
      <CardHeader className="m-0 px-4 border-b-2 flex justify-center py-2 relative">
        <div
          className={`flex justify-center items-center gap-2 ${
            isStandalonePopup ? "w-full max-w-[500px]" : ""
          }`}
        >
          <img src={extensionIcon} alt="NeatWeb Logo" className="w-6 h-6" />
          <h1 className="text-lg font-bold">Neat web</h1>
        </div>

        {!isStandalonePopup && (
          <ExternalLink
            className="h-6 w-6 text-gray-300 cursor-pointer absolute right-4 top-1/2 -translate-y-1/2"
            onClick={handleOpenInWindow}
          />
        )}
      </CardHeader>

      <CardContent className="flex flex-col px-0 flex-1 overflow-hidden">
        <Tabs
          value={tab}
          onValueChange={handleTabChange}
          className="flex flex-col flex-1 overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto space-y-4 pt-2 px-4 pb-20">
            <TabsContent value="clear">
              <div
                className={`${
                  isStandalonePopup ? "w-full max-w-[500px] mx-auto" : ""
                }`}
              >
                {children.clear}
              </div>
            </TabsContent>

            <TabsContent value="advanced">
              <div
                className={`${
                  isStandalonePopup ? "w-full max-w-[500px] mx-auto" : ""
                }`}
              >
                {children.advanced}
              </div>
            </TabsContent>
          </div>

          {showTabs && (
            <TabsList className="absolute bottom-0 left-0 w-full h-12 bg-muted border-t border-border z-10 rounded-none">
              <div className="w-full max-w-[500px] mx-auto grid grid-cols-2 h-full">
                <TabsTrigger
                  value="clear"
                  className="cursor-pointer w-full h-full flex items-center justify-center gap-1 data-[state=inactive]:bg-muted"
                >
                  <Paintbrush className="w-4 h-4" />
                  Clear
                </TabsTrigger>
                <TabsTrigger
                  value="advanced"
                  className="cursor-pointer w-full h-full flex items-center justify-center gap-1 data-[state=inactive]:bg-muted"
                >
                  <Settings className="w-4 h-4" />
                  Advanced
                </TabsTrigger>
              </div>
            </TabsList>
          )}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AppLayoutWithTabs;
