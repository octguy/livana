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
import { createHomeBooking } from "@/services/homeBookingService";
import { toast } from "sonner";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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
      toast.error("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }

    if (checkOutDate <= checkInDate) {
      toast.error("Ngày trả phòng phải sau ngày nhận phòng");
      return;
    }

    setLoading(true);
    try {
      const checkInTime = new Date(checkInDate);
      checkInTime.setHours(14, 0, 0, 0); // 2 PM check-in
      const checkOutTime = new Date(checkOutDate);
      checkOutTime.setHours(11, 0, 0, 0); // 11 AM check-out

      await createHomeBooking({
        homeListingId: listingId,
        checkInTime: checkInTime.toISOString(),
        checkOutTime: checkOutTime.toISOString(),
        guests: parseInt(guests),
      });

      toast.success("Đặt phòng thành công!");
      onOpenChange(false);
      if (onBookingSuccess) onBookingSuccess();
    } catch (error: unknown) {
      const axiosError = error as {
        response?: { data?: { message?: string } };
      };
      const errorMessage =
        axiosError?.response?.data?.message || "Không thể đặt phòng";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Đặt phòng</DialogTitle>
          <DialogDescription>{listingTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Check-in Date */}
          <div className="space-y-2">
            <Label>Ngày nhận phòng</Label>
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
                    ? format(checkInDate, "dd/MM/yyyy")
                    : "Chọn ngày"}
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
            <Label>Ngày trả phòng</Label>
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
                    ? format(checkOutDate, "dd/MM/yyyy")
                    : "Chọn ngày"}
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
            <Label>Số lượng khách</Label>
            <Select value={guests} onValueChange={setGuests}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: maxGuests }, (_, i) => i + 1).map(
                  (num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} khách
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
                  ${pricePerNight} x {calculateNights()} đêm
                </span>
                <span>${calculateTotal()}</span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Tổng cộng</span>
                <span>${calculateTotal()}</span>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Đang xử lý..." : "Xác nhận đặt phòng"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
