"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  showStrengthMeter?: boolean;
  value: string;
}

export default function PasswordInput({
  label = "Password",
  showStrengthMeter = false,
  value,
  onChange,
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  // Evaluate password strength
  const getStrength = (password: string) => {
    let score = 0;
    if (!password) return 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score;
  };

  const strengthScore = getStrength(value);

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
        return { label: "", color: "bg-slate-200" };
      case 1:
        return { label: "Weak", color: "bg-red-500" };
      case 2:
        return { label: "Fair", color: "bg-orange-400" };
      case 3:
        return { label: "Good", color: "bg-amber-400" };
      case 4:
        return { label: "Strong", color: "bg-emerald-500" };
      default:
        return { label: "", color: "bg-slate-200" };
    }
  };

  const strength = getStrengthLabel(strengthScore);

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...props}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          className={`w-full bg-white/60 border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 outline-none focus:border-orange-500 focus:bg-white transition-all pr-12 ${className}`}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {showStrengthMeter && value && (
        <div className="mt-1 flex flex-col gap-1">
          <div className="flex gap-1 h-1">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className={`flex-1 rounded-full transition-colors duration-300 ${
                  index <= strengthScore ? strength.color : "bg-slate-100"
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between items-center text-[10px] font-semibold text-slate-500 mt-0.5">
            <span>Password Strength</span>
            <span
              className={
                strengthScore === 4
                  ? "text-emerald-650"
                  : strengthScore === 3
                  ? "text-amber-500"
                  : strengthScore === 2
                  ? "text-orange-500"
                  : "text-red-500"
              }
            >
              {strength.label}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
