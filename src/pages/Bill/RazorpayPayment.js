import axios from "axios";

export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      console.log("Razorpay script already loaded.");
      resolve(true);
      return;
    }

    console.log("Loading Razorpay script...");
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => {
      console.log("Razorpay script loaded successfully.");
      resolve(true);
    };
    script.onerror = () => {
      console.error("Failed to load Razorpay script.");
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const launchRazorpay = async (options) => {
  console.log("Launching Razorpay with options:", options);
  
  const loaded = await loadRazorpayScript();
  if (!loaded) {
    alert("Razorpay SDK failed to load. Are you online?");
    return;
  }

  const razorpay = new window.Razorpay({
    key: "rzp_test_8DZW71KgzJGwuY",
    ...options,
    handler: async function (response) {
      console.log("Razorpay payment success response:", response);

      try {
        console.log("Sending update request to backend...");
        const updateRes = await axios.put("http://localhost:5000/api/payment/update-payment", {
          bookingId: options.bookingId,
          paymentId: response.razorpay_payment_id,
        });

        console.log("Payment update response:", updateRes.data);

        if (typeof options.onSuccess === "function") {
  console.log("Calling onSuccess callback...");
  options.onSuccess(updateRes.data.bill);
}

      } catch (err) {
        console.error("Payment update failed", err);
        alert("Payment succeeded, but could not update status");
      }
    },
    theme: { color: "#6b46c1" },
  });

  console.log("Opening Razorpay checkout...");
  razorpay.open();
};
