import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../lib/axios";

function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("Verifying your email...");

  const verificationStarted = useRef(false);

  useEffect(() => {
    if (verificationStarted.current) return;

    verificationStarted.current = true;

    const verifyEmail = async () => {
      const token = searchParams.get("token");

      if (!token) {
        setStatus("Invalid verification link");
        return;
      }

      try {
        const { data } = await api.post("/auth/verifyemail", { token });

        console.log(data);
        setStatus("Email verified successfully!");
      } catch (error) {
        setStatus(error.response?.data?.message || "Email verification failed");
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div>
      <h1>Email Verification</h1>
      <p>{status}</p>
    </div>
  );
}

export default VerifyEmail;
