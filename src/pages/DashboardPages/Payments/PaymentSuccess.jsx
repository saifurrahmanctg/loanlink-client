import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import Swal from "sweetalert2";

const API = import.meta.env.VITE_API_URL;

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) return;

    fetch(`${API}/payments/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId }),
    })
      .then((res) => res.json())
      .then(() => {
        Swal.fire("Success", "Payment completed successfully!", "success");
        navigate("/dashboard/my-loans");
      })
      .catch(() => {
        Swal.fire("Error", "Payment verification failed", "error");
      });
  }, []);

  return <p className="text-center mt-20">Processing payment...</p>;
}
