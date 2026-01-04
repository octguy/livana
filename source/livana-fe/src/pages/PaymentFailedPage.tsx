import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router";
import { XCircle, ArrowLeft, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getPaymentByTransactionId } from "@/services/paymentService";
import type { PaymentResponse } from "@/types/response/paymentResponse";

export default function PaymentFailedPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const transactionId = searchParams.get("transactionId");
  const errorMessage = searchParams.get("error");
  const [payment, setPayment] = useState<PaymentResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayment = async () => {
      if (transactionId) {
        try {
          const response = await getPaymentByTransactionId(transactionId);
          setPayment(response.data.data);
        } catch (error) {
          console.error("Failed to fetch payment:", error);
        }
      }
      setLoading(false);
    };

    fetchPayment();
  }, [transactionId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl text-red-600">
            Payment Failed
          </CardTitle>
          <CardDescription>
            {errorMessage ||
              "Your payment could not be processed. Please try again."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {payment && (
            <div className="rounded-lg bg-muted p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-medium">{payment.transactionId}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-medium">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(payment.amount)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="font-medium text-red-600">
                  {payment.status}
                </span>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 pt-4">
            <Button onClick={() => navigate(-1)} className="w-full">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/my-bookings")}
              className="w-full"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              View My Bookings
            </Button>
            <Button
              variant="ghost"
              onClick={() => navigate("/")}
              className="w-full"
            >
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
