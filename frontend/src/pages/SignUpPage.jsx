import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import useSignup from "../hooks/useSignUp";

const SignUpPage = () => {
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isPending, error, signupMutation } = useSignup();

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutation(signupData);
  };

  return (
    <div className="w-screen h-screen overflow-hidden flex items-center justify-center" data-theme="dracula">
      <div className="flex w-full h-full max-w-6xl bg-base-100 shadow-lg rounded-lg overflow-hidden">
        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2 p-8 flex flex-col justify-center">
          {/* App Logo and Name */}
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="text-white w-6 h-6" />
            <span className="text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              Chatter Box
            </span>
          </div>

          {/* Error message */}
          {error && (
            <div className="alert alert-error text-sm mb-4 py-2">
              <span>{error.response?.data?.message || "Signup failed"}</span>
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold">Create an Account</h2>
              <p className="text-sm opacity-70">
                Join now and start your language journey with us
              </p>
            </div>

            <input
              type="text"
              placeholder="Your Name"
              className="input input-bordered w-full"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
              required
            />
            <input
              type="email"
              placeholder="hello@example.com"
              className="input input-bordered w-full"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              required
            />
            <input
              type="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              value={signupData.password}
              onChange={(e) =>
                setSignupData({ ...signupData, password: e.target.value })
              }
              required
            />

            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <span className="loading loading-spinner loading-xs"></span>
                  Signing up...
                </>
              ) : (
                "Sign Up"
              )}
            </button>

            <p className="text-sm text-center mt-2">
              Already have an account?{" "}
              <Link to="/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </form>
        </div>

        {/* Right Side - Image and Text */}
        <div className="hidden lg:flex flex-col w-1/2 h-full">
          {/* Image */}
          <div className="flex-grow h-2/3">
            <img
              src="/image.jpeg"
              alt="Language connection illustration"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Text */}
          <div className="bg-primary/10 p-4 text-center h-1/3 flex flex-col justify-center">
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

export default SignUpPage;
