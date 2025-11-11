import { Input } from "@/components/ui/input";
import type { LucideIcon } from "lucide-react";

interface ProfileFieldProps {
  icon: LucideIcon;
  label: string;
  type?: string;
  placeholder: string;
}

export function ProfileField({
  icon: Icon,
  label,
  type = "text",
  placeholder,
}: ProfileFieldProps) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5 text-muted-foreground" />
        <label className="text-sm font-medium">{label}</label>
      </div>
      <Input type={type} placeholder={placeholder} className="w-full" />
    </div>
  );
}
