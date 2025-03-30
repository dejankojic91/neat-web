import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { CleanButton } from "@/components/clearButton/CleanButton";
import { getSettings, saveSettings } from "@/utils/storage";
import { PopupSettings } from "@/types/settings";
import { clearData } from "@/utils/clearData";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const ClearScreen = () => {
    const [period, setPeriod] = useState("1h");
    const [showPasswordDialog, setShowPasswordDialog] = useState(false);


    const timeOptions = [
        { label: "Last Hour", value: "1h" },
        { label: "Last Day", value: "24h" },
        { label: "Last Week", value: "7d" },
        { label: "Last Month", value: "30d" },
        { label: "All time", value: "forever" },
    ];

    useEffect(() => {
        getSettings<PopupSettings>("popupSettings").then((settings) => {
            if (settings?.period) {
                setPeriod(settings.period);
            }
        });
    }, []);

    const handlePeriodChange = async (value: string) => {
        setPeriod(value);

        const current = await getSettings<PopupSettings>("popupSettings");

        await saveSettings("popupSettings", {
            ...current,
            period: value,
        });
    };

    const handleClean = async () => {
        const settings = await getSettings<PopupSettings>("popupSettings");

        if (!settings?.dataToRemove || !settings.period) return;

        if (settings.dataToRemove.passwords) {
            setShowPasswordDialog(true);
            return;
        }


        await clearData(settings.period, settings.dataToRemove);

        // ... trigger animation, "done" state, etc.
    };

    return (
        <>
            <div className="flex flex-col justify-start items-center h-full w-full pt-6 px-4 space-y-8">
                <div className="w-full space-y-2">
                    <Label htmlFor="time-period" className="text-sm flex items-center gap-1">
                        🕒 Clear data from...
                    </Label>
                    <Select onValueChange={handlePeriodChange} defaultValue={period}>
                        <SelectTrigger id="time-period" className="w-full">
                            <SelectValue placeholder="Select time period" />
                        </SelectTrigger>
                        <SelectContent>
                            {timeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex-1 flex justify-center items-center w-full">
                    <CleanButton onClick={handleClean} />
                </div>
            </div>
            <AlertDialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Remove Saved Passwords?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You’ve selected to clear saved passwords. This will remove all stored logins in Chrome and cannot be undone. Are you sure?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleClean}
                        >
                            Yes, Clean Data
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

        </>
    );
};

export default ClearScreen;
