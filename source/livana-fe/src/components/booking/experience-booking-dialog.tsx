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
import { vi } from "date-fns/locale";

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
      toast.error("Vui lòng chọn số lượng người tham gia");
      return;
    }

    if (parseInt(quantity) > availableSlots) {
      toast.error("Số lượng người vượt quá chỗ trống còn lại");
      return;
    }

    setLoading(true);
    try {
      await createExperienceBooking({
        sessionId,
        quantity: parseInt(quantity),
      });

      toast.success("Đặt trải nghiệm thành công!");
      onOpenChange(false);
      if (onBookingSuccess) onBookingSuccess();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message || "Không thể đặt trải nghiệm";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Đặt trải nghiệm</DialogTitle>
          <DialogDescription>{experienceTitle}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Session Time Info */}
          <div className="space-y-2 p-4 bg-muted rounded-lg">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Ngày:</span>
              <span className="font-medium">
                {format(new Date(sessionStartTime), "dd/MM/yyyy", {
                  locale: vi,
                })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Thời gian:</span>
              <span className="font-medium">
                {format(new Date(sessionStartTime), "HH:mm")} -{" "}
                {format(new Date(sessionEndTime), "HH:mm")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Chỗ trống:</span>
              <span className="font-medium">{availableSlots} chỗ</span>
            </div>
          </div>

          {/* Number of Participants */}
          <div className="space-y-2">
            <Label>Số lượng người tham gia</Label>
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
                    {num} người
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Summary */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>
                ${pricePerPerson} x {quantity} người
              </span>
              <span>${calculateTotal()}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Tổng cộng</span>
              <span>${calculateTotal()}</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground">
            Bạn sẽ nhận được xác nhận đặt chỗ qua email sau khi thanh toán.
          </p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || availableSlots === 0}
          >
            {loading ? "Đang xử lý..." : "Xác nhận đặt chỗ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
