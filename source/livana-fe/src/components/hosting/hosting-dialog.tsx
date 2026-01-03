import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { Home, Compass } from "lucide-react";

interface HostingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function HostingDialog({ open, onOpenChange }: HostingDialogProps) {
  const navigate = useNavigate();

  const handleSelectListingType = (type: "homes" | "experiences") => {
    if (type === "homes") {
      navigate("/host/homes/create");
    } else {
      navigate("/host/experiences/create");
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Choose your listing type
          </DialogTitle>
        </DialogHeader>

        <div className="py-8">
          <div className="grid grid-cols-2 gap-6">
            <Card
              className="h-48 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:shadow-lg hover:border-foreground/50 border-2"
              onClick={() => handleSelectListingType("homes")}
            >
              <Home className="h-12 w-12" />
              <span className="text-2xl font-semibold">Homes</span>
            </Card>
            <Card
              className="h-48 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all hover:shadow-lg hover:border-foreground/50 border-2"
              onClick={() => handleSelectListingType("experiences")}
            >
              <Compass className="h-12 w-12" />
              <span className="text-2xl font-semibold">Experiences</span>
            </Card>
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
