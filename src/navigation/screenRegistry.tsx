import React from "react";
import CommonSettings from "@/components/settings/CommonSettings";
import DataToRemove from "@/components/settings/DataToRemove";
import AutoRemove from "@/components/settings/AutoRemove";

export const getScreenById = (id: string): React.ReactNode => {
  switch (id) {
    case "common-settings":
      return <CommonSettings />;
    case "data-to-remove":
      return <DataToRemove />;
    case "auto-remove":
      return <AutoRemove />;
    default:
      return null;
  }
};



