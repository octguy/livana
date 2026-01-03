import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExperienceBooking } from "@/services/experienceBookingService";
import { toast } from "sonner";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";

interface ExperienceBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sessionId: string;
  experienceTitle: string;
  sessionStartTime: string;
  sessionEndTime: string;
  pricePerPerson: number;
  availableSlots: number;
  onBookingSuccess?: () => void;
}

export function ExperienceBookingDialog({
  open,
  onOpenChange,
  sessionId,
  experienceTitle,
  sessionStartTime,
  sessionEndTime,
  pricePerPerson,
  availableSlots,
  onBookingSuccess,
}: ExperienceBookingDialogProps) {
  const [quantity, setQuantity] = useState("1");
  const [loading, setLoading] = useState(false);

  const calculateTotal = () => {
    return parseInt(quantity) * pricePerPerson;
  };

  const handleSubmit = async () => {
    if (parseInt(quantity) < 1) {
      toast.error("Please select the number of participants");
      return;
    }

    if (parseInt(quantity) > availableSlots) {
      toast.error("Number of participants exceeds available slots");
      return;
    }

    setLoading(true);
    try {
      await createExperienceBooking({
        sessionId,
        quantity: parseInt(quantity),
      });

      toast.success("Experience booking successful!");
      onOpenChange(false);
      if (onBookingSuccess) onBookingSuccess();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "Unable to book experience";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Book Experience</DialogTitle>
          <DialogDescription>{experienceTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Session Time Info */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Date:</span>
              <span className="font-medium">
                {format(new Date(sessionStartTime), "MM/dd/yyyy", {
                  locale: enUS,
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Time:</span>
              <span className="font-medium">
                {format(new Date(sessionStartTime), "HH:mm")} -{" "}
                {format(new Date(sessionEndTime), "HH:mm")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Available slots:</span>
              <span className="font-medium">{availableSlots} slots</span>
            </div>
          </div>

          {/* Number of Participants */}
          <div className="space-y-2">
            <Label>Number of participants</Label>
            <Select value={quantity} onValueChange={setQuantity}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(
                  { length: Math.min(availableSlots, 10) },
                  (_, i) => i + 1
                ).map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "person" : "people"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Summary */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>
                ${pricePerPerson} x {quantity}{" "}
                {parseInt(quantity) === 1 ? "person" : "people"}
              </span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            You will receive a booking confirmation via email after payment.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || availableSlots === 0}
          >
            {loading ? "Processing..." : "Confirm booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
