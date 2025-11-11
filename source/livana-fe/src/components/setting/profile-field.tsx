import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { Input } from "@/components/ui/input";

interface ProfileFieldProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon: LucideIcon;
  label: string;
}

export const ProfileField = forwardRef<HTMLInputElement, ProfileFieldProps>(
  ({ icon: Icon, label, ...props }, ref) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-muted-foreground" />
          <label className="text-sm font-medium">{label}</label>
        </div>
        <Input ref={ref} {...props} />
      </div>
    );
  }
);

ProfileField.displayName = "ProfileField";
