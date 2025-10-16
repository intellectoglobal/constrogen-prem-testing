import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { showToast } from "../utils/toast";
import { checkRefetchToken } from "../../shared/redux/slices/authSlice";
import { authApi } from "../services/api";
import { RootState } from "../store";
import { COLORS } from "../../shared/constants/theme";

interface FormData {
  otp: string;
}

export default function OtpVerificationScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = location.state as any || {};
  
  const { isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  ) as any;

  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      otp: "",
    },
  });

  useEffect(() => {
    if (params?.message) {
      showToast({
        message: params.message as string,
        toastType: "success",
      });
    }
  }, [params?.message]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const otp = data.otp;
    console.log("Submitting OTP:", { email: params?.email, otp, session_id: params?.Details });
    
    try {
      const { isAxiosError, message, ...res } = (await authApi.verifyOTP({
        email: params?.email,
        otp: Number(otp),
        session_id: params?.Details,
      })) as any;
      
      if (isAxiosError) {
        showToast({ message });
      } else {
        dispatch(checkRefetchToken({ ...res, isAuthenticatedVerify: false }));
      }
    } catch (error) {
      showToast({
        message: "An error occurred during OTP verification",
      });
      console.error("OTP Verification Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    reset({ otp: "" });
    
    try {
      const { isAxiosError, message } = (await authApi.verifyEmail({
        email: params?.email,
      })) as any;
      
      if (isAxiosError) {
        showToast({ message });
      } else {
        showToast({
          message: "OTP resent successfully",
          toastType: "success",
        });
      }
    } catch (error) {
      showToast({ message: "An error occurred while resending OTP" });
    } finally {
      setIsResending(false);
    }
  };

  const handleChangeEmail = () => {
    navigate("/login");
  };

  useEffect(() => {
    if (isAuthenticated) {
      console.log("Redirecting to dashboard due to isAuthenticated");
      navigate("/dashboard");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center p-5"
      style={{
        backgroundImage: 'url(/construction-bg.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-2xl">
        <div className="flex flex-col items-center">
          <img
            src="/hook128.png"
            alt="Logo"
            className="w-16 h-16 mb-5"
          />
          <h1 className="text-3xl font-bold mb-2" style={{ color: COLORS.primaryText }}>
            Constrogen
          </h1>
          <p className="text-base mb-6" style={{ color: COLORS.secondaryText }}>
            Enter verification code
          </p>

          <div 
            className="w-full p-4 rounded-md mb-5"
            style={{ backgroundColor: COLORS.blueBox }}
          >
            <p className="text-sm mb-1" style={{ color: COLORS.primaryText }}>
              OTP sent to:
            </p>
            <p className="font-bold mb-2" style={{ color: COLORS.primaryText }}>
              {params?.email || "No email provided"}
            </p>
            <button
              onClick={handleChangeEmail}
              className="font-semibold text-sm"
              style={{ color: COLORS.link }}
            >
              Change email
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <label className="block font-semibold mb-2" style={{ color: COLORS.primaryText }}>
              Verification Code
            </label>
            <Controller
              control={control}
              name="otp"
              rules={{
                required: "Please enter the OTP",
                pattern: {
                  value: /^[0-9]{6}$/,
                  message: "OTP must be 6 digits",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  type="text"
                  className={`w-full border rounded-md px-4 py-3 text-base mb-1 text-center tracking-widest text-lg font-mono focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.otp ? 'border-red-500' : 'border-gray-300'
                  }`}
                  value={value}
                  onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ""))}
                  maxLength={6}
                  placeholder="Enter 6-digit OTP"
                  autoFocus
                />
              )}
            />
            {errors.otp && (
              <p className="text-red-500 text-sm mb-3">
                {errors.otp.message || "Please enter a valid OTP"}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-md mt-4 font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: COLORS.button }}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
          </form>

          <button
            onClick={handleResendOtp}
            disabled={isResending}
            className="flex items-center mt-5 font-semibold text-sm disabled:opacity-50"
            style={{ color: isResending ? '#ccc' : COLORS.button }}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-5 w-5 mr-2" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            {isResending ? "Sending..." : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

