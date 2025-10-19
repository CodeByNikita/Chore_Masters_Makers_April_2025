import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { postAddParent } from "../services/parent";
import { useNavigate } from "react-router";
import { convertToBase64, validatePassword } from "../utils/utils";
import { PasswordRequirements } from "./PasswordRequirements";

interface SignupProps {
  onToggleLogin: () => void;
}

export interface SignupData {
  username: string;
  password: string;
  profilePic: any;
}

const Signup: React.FC<SignupProps> = ({ onToggleLogin }) => {
  const [newParentData, setNewParentData] = useState<SignupData>({
    username: "",
    password: "",
    profilePic: "",
  });
  const navigate = useNavigate();
  const [passwordError, setPasswordError] = useState<boolean | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { isError, isPending, mutate, error } = useMutation({
    mutationFn: (signupData: SignupData) => postAddParent(signupData),
    onSuccess: () => {
      navigate("/parent");
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (passwordError) {
      return;
    }

    let base64PrizePic = null;
    if (newParentData.profilePic) {
      base64PrizePic = await convertToBase64(newParentData.profilePic);
    }

    const finalPrizeData = {
      ...newParentData,
      profilePic: base64PrizePic,
    };

    mutate(finalPrizeData);
  };

  return (
    <div className="ml-16 -mt-32">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md overflow-hidden mx-12">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-indigo-800 text-center mb-6">
            Get Started
          </h1>

          {isError && (
            <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
              <p>
                {error instanceof Error
                  ? error.message
                  : "Something went wrong"}
              </p>
              <p>
                {!newParentData.password ||
                  !newParentData.profilePic ||
                  (!newParentData.username && "Please complete all fields")}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                value={newParentData.username}
                onChange={(e) =>
                  setNewParentData({
                    ...newParentData,
                    username: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                value={newParentData.password}
                onBlur={(e) => {
                  const newPassword = e.target.value;
                  setPasswordError(validatePassword(newPassword));
                }}
                onChange={(e) => {
                  setPasswordError(null);
                  setNewParentData({
                    ...newParentData,
                    password: e.target.value,
                  });
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your password"
                required
              />
              {isSubmitted && passwordError && (
                <p className="text-red-500 text-sm mt-1">
                  Password criteria not met
                </p>
              )}
              <PasswordRequirements password={newParentData.password} />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="profile picture"
                className="block text-sm font-medium text-gray-700"
              >
                Profile picture
              </label>
              <div className="flex items-center space-x-4">
                {newParentData.profilePic && (
                  <img
                    src={URL.createObjectURL(newParentData.profilePic)}
                    className="w-20 h-20 rounded-full object-cover"
                  />
                )}
                <input
                  type="file"
                  accept="image/*"
                  className="border border-gray-300 w-full rounded-lg p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:text-sm
                            file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-200 text-sm"
                  onChange={(e) =>
                    setNewParentData({
                      ...newParentData,
                      profilePic: e.target.files?.[0] || null,
                    })
                  }
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors hover:cursor-pointer"
              >
                {isPending ? (
                  <span className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                    Creating account...
                  </span>
                ) : (
                  "Sign Up"
                )}
              </button>
            </div>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onToggleLogin}
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
