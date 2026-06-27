/**
 * 🎓 RAZORPAY CHECKOUT COMPONENT
 * 
 * This is the wrapper that handles the frontend payment flow.
 * 
 * STEP 2 OF PAYMENT FLOW (Frontend):
 * 1. Takes the orderId we created on the server
 * 2. Loads the Razorpay checkout script (checkout.js)
 * 3. Opens the payment popup when the user clicks "Pay"
 * 4. On success: calls our verify-payment API
 * 5. On failure: handles the error
 */

"use client";

import { useState, useEffect } from "react";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

interface RazorpayCheckoutProps {
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  bookingId: string;
  venueName: string;
  userName: string;
  userEmail: string;
  onSuccess: () => void;
  onError: (msg: string) => void;
}

export default function RazorpayCheckout({
  orderId,
  amount,
  currency,
  keyId,
  bookingId,
  venueName,
  userName,
  userEmail,
  onSuccess,
  onError,
}: RazorpayCheckoutProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentVerified, setPaymentVerified] = useState(false);

  // ─── Step 1: Load Razorpay Script ───
  useEffect(() => {
    const loadRazorpay = () => {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
    };

    loadRazorpay().then((res) => {
      if (res) setIsScriptLoaded(true);
    });
  }, []);

  // ─── Auto-trigger payment modal ───
  useEffect(() => {
    if (isScriptLoaded && !isProcessing && !paymentVerified) {
      handlePayment();
    }
  }, [isScriptLoaded]);

  // ─── Step 2: Open Payment Popup ───
  const handlePayment = async () => {
    if (!isScriptLoaded) {
      onError("Razorpay SDK failed to load. Please check your connection.");
      return;
    }

    setIsProcessing(true);

    // Configuration for the Razorpay popup
    const options = {
      key: keyId, // Public key
      amount: amount * 100, // Amount in paise
      currency: currency,
      name: "SoulsWed",
      description: `Advance Payment for ${venueName}`,
      order_id: orderId, // The order ID from our server
      handler: async function (response: any) {
        // This runs when Razorpay says payment succeeded
        await verifyPayment(response);
      },
      prefill: {
        name: userName,
        email: userEmail,
      },
      theme: {
        color: "#EE7429", // SoulsWed Orange
      },
      modal: {
        ondismiss: function () {
          // User closed the popup without paying
          setIsProcessing(false);
        },
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.on("payment.failed", function (response: any) {
      setIsProcessing(false);
      onError(response.error.description || "Payment failed");
    });

    rzp.open();
  };

  // ─── Step 3: Verify Payment ───
  const verifyPayment = async (paymentResponse: any) => {
    try {
      // Send the payment details to our server to verify the signature
      const res = await fetch("/api/bookings/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          bookingId: bookingId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Payment verification failed");
      }

      // Verification successful!
      setPaymentVerified(true);
      setTimeout(() => {
        onSuccess();
      }, 2000);
    } catch (err: any) {
      setIsProcessing(false);
      onError(err.message || "An error occurred during verification");
    }
  };

  if (paymentVerified) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />
        <div>
          <h4 className="font-bold text-emerald-800">Payment Confirmed!</h4>
          <p className="text-xs text-emerald-600">Your booking is secured.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handlePayment}
        disabled={!isScriptLoaded || isProcessing}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Processing Payment...
          </>
        ) : !isScriptLoaded ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Loading secure payment...
          </>
        ) : (
          `Pay ${new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount)} to Confirm`
        )}
      </button>

      <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
        <ShieldCheck className="w-3.5 h-3.5" />
        Payments are secure and encrypted
      </div>
    </div>
  );
}
