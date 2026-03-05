import { useState, useEffect } from "react";
import { loginUser, signupUser } from "@/services/users/authService";
import { signIn } from "next-auth/react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { setAuthToken } from "@/services/axiosInstance";
import { toast } from "react-hot-toast";

export const useAuthModal = () => {
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);
  const [authType, setAuthType] = useState<"welcome" | "signin" | "signup">(
    "welcome"
  );
  const [isAnimating, setIsAnimating] = useState(false);
  const { data: session, status } = useSession(); // Status can be "loading", "authenticated", or "unauthenticated"

  useEffect(() => {
    if (status === "loading") return; // Wait for session to load

    if (session?.user.token) {
      setIsOpen(false);
      setAuthToken(session?.user?.token);
    } else if (status === "unauthenticated" || status === undefined) {
      setTimeout(() => setIsOpen(true), 100);
    }
  }, [status, pathname]);

  const handleAuthTypeChange = (newType: "welcome" | "signin" | "signup") => {
    setIsAnimating(true);
    setTimeout(() => {
      setAuthType(newType);
      setIsAnimating(false);
    }, 300); // Match this with CSS animation duration
  };

  const onSubmit = async (data: {
    email: string;
    password: string;
    name?: string;
  }) => {
    if (authType === "signin") {
      signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      }).then((res) => {
        if (res?.error) {
          if (res.status === 401) {
            toast.error("Invalid email or password. Please try again.");
          }
        } else {
          toast.success("Logged in successfully!");
          setIsOpen(false);

          if (pathname === "/sign-in") {
            window.history.back();
          }
        }
      });
    } else {
      const signupData = await signupUser(
        data.email,
        data.password,
        data.name || ""
      );
      if (signupData) {
        const loginData = await loginUser(data.email, data.password);
        // console.log("Login data: ", loginData);
        if (loginData) {
          signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
          }).then((res) => {
            if (res?.error) {
              if (res.status === 401) {
                toast.error("Invalid email or password. Please try again.");
              } else {
                toast.error(
                  "An error occurred during login. Please try again."
                );
              }
            } else {
              setIsOpen(false);
              toast.success("Signed up and logged in successfully!");
            }
          });
        } else {
          toast.error("Signup failed. Please try again.");
        }
      } else {
        toast.error("Signup failed. Please try again.");
      }
    }
  };

  return {
    pathname,
    isOpen,
    authType,
    isAnimating,
    handleAuthTypeChange,
    onSubmit,
    setIsOpen,
    setAuthType,
  };
};
