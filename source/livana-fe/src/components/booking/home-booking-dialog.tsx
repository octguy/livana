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
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { createHomeBooking } from "@/services/homeBookingService";
import { createVNPayPayment } from "@/services/paymentService";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon, CreditCard, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { BookingType } from "@/types/response/paymentResponse";

interface HomeBookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listingId: string;
  listingTitle: string;
  pricePerNight: number;
  maxGuests: number;
  onBookingSuccess?: () => void;
}

export function HomeBookingDialog({
  open,
  onOpenChange,
  listingId,
  listingTitle,
  pricePerNight,
  maxGuests,
  onBookingSuccess,
}: HomeBookingDialogProps) {
  const [checkInDate, setCheckInDate] = useState<Date>();
  const [checkOutDate, setCheckOutDate] = useState<Date>();
  const [guests, setGuests] = useState("1");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"vnpay" | "later">(
    "vnpay"
  );

  const calculateNights = () => {
    if (!checkInDate || !checkOutDate) return 0;
    const diffTime = Math.abs(checkOutDate.getTime() - checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return calculateNights() * pricePerNight;
  };

  const handleSubmit = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Please select check-in and check-out dates");
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error("Check-out date must be after check-in date");
      return;
    }

    setLoading(true);
    try {
      const checkInTime = new Date(checkInDate);
      checkInTime.setHours(14, 0, 0, 0); // 2 PM check-in
      const checkOutTime = new Date(checkOutDate);
      checkOutTime.setHours(11, 0, 0, 0); // 11 AM check-out

      const bookingResponse = await createHomeBooking({
        homeListingId: listingId,
        checkInTime: checkInTime.toISOString(),
        checkOutTime: checkOutTime.toISOString(),
        guests: parseInt(guests),
      });

      const bookingId = bookingResponse.data.data.id;

      // If VNPay payment is selected, redirect to payment
      if (paymentMethod === "vnpay") {
        try {
          const paymentResponse = await createVNPayPayment({
            bookingId: bookingId,
            bookingType: BookingType.HOME,
          });

          // Redirect to VNPay payment page
          window.location.href = paymentResponse.data.data.paymentUrl;
          return;
        } catch (paymentError) {
          console.error("Payment creation failed:", paymentError);
          toast.error(
            "Failed to create payment. Your booking is saved but unpaid."
          );
        }
      }

      toast.success("Booking successful!");
      onOpenChange(false);
      if (onBookingSuccess) onBookingSuccess();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "Failed to book";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Book your stay</DialogTitle>
          <DialogDescription>{listingTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Check-in Date */}
          <div className="space-y-2">
            <Label>Check-in date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkInDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkInDate
                    ? format(checkInDate, "MMM d, yyyy")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkInDate}
                  onSelect={setCheckInDate}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Check-out Date */}
          <div className="space-y-2">
            <Label>Check-out date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !checkOutDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {checkOutDate
                    ? format(checkOutDate, "MMM d, yyyy")
                    : "Select date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={checkOutDate}
                  onSelect={setCheckOutDate}
                  disabled={(date) => date < (checkInDate || new Date())}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Number of Guests */}
          <div className="space-y-2">
            <Label>Number of guests</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map(
                  (num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} guest{num > 1 ? "s" : ""}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Price Summary */}
          {checkInDate && checkOutDate && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span>
                  ${pricePerNight} x {calculateNights()} night
                  {calculateNights() > 1 ? "s" : ""}
                </span>
                <span>${calculateTotal()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          )}

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
                      Book now and pay at the property
                    </p>
                  </div>
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
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
