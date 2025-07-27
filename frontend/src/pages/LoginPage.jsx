import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import useLogin from "../hooks/useLogin";

const LoginPage = () => {
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const { isPending, error, loginMutation } = useLogin();

  const handleLogin = (e) => {
    e.preventDefault();
    loginMutation(loginData);
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden flex items-center justify-center"
      data-theme="dracula"
    >
      <div className="flex flex-col lg:flex-row w-full h-full max-w-6xl mx-auto bg-base-100 rounded-xl shadow-lg">
        {/* Left: Form */}
        <div className="w-full lg:w-1/2 p-6 flex flex-col justify-center">
          <div className="mb-4 flex items-center gap-2">
            <MessageCircle className="text-white h-5 w-5" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">
              Chatter Box
            </span>
          </div>

          {error && (
            <div className="alert alert-error mb-2 text-sm py-1">
              <span>{error.response?.data?.message || "Login failed"}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Welcome Back</h2>
              <p className="text-sm opacity-70">
                Sign in to your account to continue your language journey
              </p>
            </div>

            <div className="form-control">
              <label className="label py-0">
                <span className="label-text text-sm">Email</span>
              </label>
              <input
                type="email"
                placeholder="hello@example.com"
                className="input input-bordered w-full"
                value={loginData.email}
                onChange={(e) =>
                  setLoginData({ ...loginData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="form-control">
              <label className="label py-0">
                <span className="label-text text-sm">Password</span>
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-sm text-center mt-2">
              Don't have an account?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>

        {/* Right: Image and Text */}
        <div className="hidden lg:flex w-full lg:w-1/2 flex-col">
          <div className="flex-grow w-full h-0">
            <img
              src="/image.jpeg"
              alt="Language connection illustration"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4 text-center bg-primary/10">
            <h2 className="text-lg font-semibold">
              Connect with language partners worldwide
            </h2>
            <p className="opacity-70 text-sm">
              Practice conversations, make friends, and improve your language skills together
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
