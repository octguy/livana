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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createExperienceBooking } from "@/services/experienceBookingService";
import { createVNPayPayment } from "@/services/paymentService";
import { toast } from "sonner";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { CreditCard, Wallet } from "lucide-react";
import { BookingType } from "@/types/request/createPaymentRequest";

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
  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "later">(
    "vnpay"
  );

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
      const bookingResponse = await createExperienceBooking({
        sessionId,
        quantity: parseInt(quantity),
      });

      // If VNPay payment method selected, create payment and redirect
      if (paymentMethod === "vnpay") {
        try {
          const paymentResponse = await createVNPayPayment({
            bookingId: bookingResponse.id,
            bookingType: BookingType.EXPERIENCE,
            amount: calculateTotal(),
            orderInfo: `Payment for ${experienceTitle}`,
          });

          // Redirect to VNPay
          window.location.href = paymentResponse.paymentUrl;
          return;
        } catch {
          toast.error("Failed to create payment. Your booking has been saved.");
          onOpenChange(false);
          if (onBookingSuccess) onBookingSuccess();
          return;
        }
      }

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

          {/* Payment Method */}
          <div className="space-y-3 pt-4 border-t">
            <Label>Payment method</Label>
            <RadioGroup
              value={paymentMethod}
              onValueChange={(value) =>
                setPaymentMethod(value as "vnpay" | "later")
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="vnpay" id="vnpay" />
                <Label
                  htmlFor="vnpay"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <CreditCard className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Pay with VNPay</p>
                    <p className="text-xs text-muted-foreground">
                      Pay now via VNPay payment gateway
                    </p>
                  </div>
                </Label>
              </div>
              <div className="flex items-center space-x-3 rounded-lg border p-3 cursor-pointer hover:bg-muted/50">
                <RadioGroupItem value="later" id="later" />
                <Label
                  htmlFor="later"
                  className="flex items-center gap-2 cursor-pointer flex-1"
                >
                  <Wallet className="h-4 w-4" />
                  <div>
                    <p className="font-medium">Pay later</p>
                    <p className="text-xs text-muted-foreground">
                      Book now and pay at the experience
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
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
            {loading
              ? "Processing..."
              : paymentMethod === "vnpay"
              ? "Pay now"
              : "Confirm booking"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
