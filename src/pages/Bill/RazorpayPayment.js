import axios from "axios";

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const launchRazorpay = async (options) => {
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const razorpay = new window.Razorpay({
    key: "rzp_test_8DZW71KgzJGwuY",
    ...options,
    handler: async function (response) {
      try {
        await axios.post("http://localhost:5000/api/payment/update-status", {
          bookingId: options.bookingId,
          paymentId: response.razorpay_payment_id,
        });
        alert("Payment successful!");
      } catch (err) {
        console.error("Payment update failed", err);
        alert("Payment succeeded, but could not update status");
      }
    },
    theme: { color: "#6b46c1" },
  });

  razorpay.open();
};
