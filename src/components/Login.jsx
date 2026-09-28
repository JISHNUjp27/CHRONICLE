import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as authLogin } from '../store/authSlice';
import { Button, Input, Logo } from './index';
import { useDispatch } from "react-redux";
import authService from "../appwrite/auth";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useTilt from "../hooks/useTilt";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const cardTiltRef = useTilt({ max: 8, lift: -6 });

  const login = async (data) => {
    setError("");
    setIsLoading(true);
    try {
      const session = await authService.login(data);
      if (session) {
        const userData = await authService.getCurrentUser();
        if (userData) dispatch(authLogin(userData));
        toast.success("Welcome back to Chronicle!");
        navigate("/");
      }
    } catch (err) {
      const message = err?.message || "Failed to sign in. Please check your credentials.";
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[75vh] items-center justify-center py-12 px-4">
      <div className="orb orb-violet" style={{ width: "24rem", height: "24rem", top: "10%", left: "15%", opacity: 0.28 }} />
      <div className="orb orb-cyan" style={{ width: "20rem", height: "20rem", bottom: "10%", right: "15%", opacity: 0.22 }} />

      <div className="scene relative z-10 w-full max-w-md">
        <div
          ref={cardTiltRef}
          className="tilt card-3d glass relative overflow-hidden rounded-[30px] p-8 sm:p-10 noise"
        >
          <span className="spotlight" />

          <div className="relative z-10">
            <div className="mb-6 flex justify-center">
              <span className="block rounded-2xl bg-white/95 p-2 shadow-[0_16px_36px_-16px_rgba(34,211,238,0.9)] transition-transform duration-500 hover:-rotate-6 hover:scale-105">
                <Logo width="48px" />
              </span>
            </div>

            <div className="text-center">
              <span className="inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-300 backdrop-blur-md">
                Welcome back
              </span>
              <h2 className="font-display mt-3 text-3xl font-extrabold text-white">
                Sign in to <span className="text-gradient">Chronicle</span>
              </h2>
              <p className="mt-2 text-sm text-slate-400">
                Don&apos;t have an account?&nbsp;
                <Link
                  to="/signup"
                  className="font-semibold text-cyan-300 transition-colors duration-200 hover:text-cyan-200 hover:underline"
                >
                  Create one now
                </Link>
              </p>
            </div>

            {error && (
              <div className="mt-6 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-center text-xs font-medium text-rose-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(login)} className="mt-8 space-y-5">
              <Input
                label="Email address"
                placeholder="you@domain.com"
                type="email"
                error={errors.email?.message}
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    matchPatern: (value) =>
                      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                      "Email address must be a valid address",
                  },
                })}
              />

              <Input
                label="Password"
                type="password"
                placeholder="••••••••"
                error={errors.password?.message}
                {...register("password", {
                  required: "Password is required",
                })}
              />

              <div className="pt-2">
                <Button
                  type="submit"
                  className="btn-3d btn-primary w-full py-3.5 text-base"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                      Authenticating...
                    </span>
                  ) : (
                    <span>Sign into your account →</span>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;