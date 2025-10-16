import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { authApi } from "../services/api";
import { showToast } from "../utils/toast";
import { COLORS } from "@shared/constants/theme";

export default function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.(com|in|org|net|co\.uk|edu|gov|io|ai)$/i;
    return regex.test(email.trim());
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { isAxiosError, message, ...res } = (await authApi.verifyEmail(
        data
      )) as any;
      
      if (isAxiosError) {
        showToast({ message });
      } else {
        navigate("/otp-verification", {
          state: { ...data, ...res, message },
        });
      }
    } finally {
      setLoading(false);
    }
  };

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
            Welcome back!
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full">
            <label className="block font-semibold mb-2" style={{ color: COLORS.primaryText }}>
              Email Address
            </label>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                validate: (value) => isValidEmail(value) || "Invalid email format",
              }}
              render={({ field: { onChange, value } }) => (
                <input
                  type="email"
                  className={`w-full border rounded-md px-4 py-3 text-base mb-1 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mb-3">{errors.email.message}</p>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center py-4 rounded-md mt-4 font-semibold text-white transition-colors disabled:opacity-50"
              style={{ backgroundColor: COLORS.button }}
              disabled={loading}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 mr-2" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
              </svg>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

