import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Minus } from "lucide-react";
import { Label } from "@/components/ui/label";

const CookieOptions = () => {
  const [mode, setMode] = useState<"whitelist" | "blacklist">("whitelist");
  const [domainInput, setDomainInput] = useState("");
  const [domains, setDomains] = useState<string[]>([]);

  const addDomain = () => {
    if (!domainInput.trim()) return;
    setDomains((prev) => [...prev, domainInput.trim()]);
    setDomainInput("");
  };

  const removeDomain = (index: number) => {
    setDomains((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="pl-4 pt-3 space-y-4 border-l border-muted text-sm">
      <RadioGroup
        value={mode}
        onValueChange={(v) => setMode(v as "whitelist" | "blacklist")}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="whitelist" id="only-clear" />
          <Label htmlFor="only-clear">Only clear the following (fast)</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="blacklist" id="dont-clear" />
          <Label htmlFor="dont-clear">Don't clear the following (slow)</Label>
        </div>
      </RadioGroup>

      <div className="flex gap-2">
        <Input
          value={domainInput}
          onChange={(e) => setDomainInput(e.target.value)}
          placeholder="e.g. .domain.com or sub.domain.com"
        />
        <Button type="button" variant="secondary" onClick={addDomain}>
          <Plus className="w-4 h-4" />
        </Button>
      </div>

      <div className="space-y-1">
        {domains.length === 0 ? (
          <p className="text-muted-foreground text-xs italic">
            No filters defined
          </p>
        ) : (
          domains.map((domain, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center bg-muted px-2 py-1 rounded-md"
            >
              <span className="text-sm">{domain}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeDomain(idx)}
              >
                <Minus className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CookieOptions;
