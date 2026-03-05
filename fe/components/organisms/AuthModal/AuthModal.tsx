"use client";

import { useForm } from "react-hook-form";
import styles from "./AuthModal.module.css";
import Button from "@/components/atoms/Button/Button";
import { Input } from "@/components/atoms/Input/Input";
import { useAuthModal } from "./useAuthModal";

interface FormInputs {
  email: string;
  password: string;
  name?: string;
}

const AuthModal = () => {
  const {
    pathname,
    isOpen,
    authType,
    isAnimating,
    onSubmit,
    setIsOpen,
    setAuthType,
  } = useAuthModal();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>();

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.overlayVisible : ""}`}>
      <div className={`${styles.modal} ${isOpen ? styles.modalVisible : ""}`}>
        {pathname !== "/sign-in" && (
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        )}

        <div className={styles.contentWrapper}>
          {authType === "welcome" && (
            <div
              className={`${styles.welcomeScreen} ${isAnimating ? styles.fadeOut : styles.fadeIn
                }`}
            >
              <div className={styles.titleGroup}>
                <h2 className={styles.title}>Welcome back</h2>
                <div className={styles.subTitle}>
                  <span>Log in or sign up to get smarter</span>
                  <span>responses, upload files and</span>
                  <span>images, and more.</span>
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <Button
                  variant="primary"
                  fullWidth
                  onClick={() => setAuthType("signin")}
                >
                  Log in
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={() => setAuthType("signup")}
                >
                  Sign Up
                </Button>
              </div>
            </div>
          )}

          {(authType === "signin" || authType === "signup") && (
            <div
              className={`${styles.formContainer} ${isAnimating ? styles.fadeOut : styles.fadeIn
                }`}
            >
              <div className={styles.titleGroup}>
                <h2 className={styles.title}>Welcome back</h2>
              </div>
              <form onSubmit={handleSubmit(onSubmit)}>
                {authType === "signup" && (
                  <div
                    className={`${styles.inputGroup} ${styles.slideIn}`}
                    style={{ animationDelay: "0.2s" }}
                  >
                    <Input
                      className={styles.input}
                      name="name"
                      placeholder="Name"
                      type="text"
                      register={register}
                      validationRules={{
                        required: "Name is required",
                      }}
                    />
                    {errors.name && (
                      <span className={styles.error}>
                        {errors.name.message}
                      </span>
                    )}
                  </div>
                )}

                <div
                  className={`${styles.inputGroup} ${styles.slideIn}`}
                  style={{ animationDelay: "0.2s" }}
                >
                  <Input
                    className={styles.input}
                    name="email"
                    placeholder="Email"
                    type="email"
                    register={register}
                    validationRules={{
                      required: "Email is required",
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: "Invalid email address",
                      },
                    }}
                  />
                  {errors.email && (
                    <span className={styles.error}>{errors.email.message}</span>
                  )}
                </div>

                <div
                  className={`${styles.inputGroup} ${styles.slideIn}`}
                  style={{ animationDelay: "0.3s" }}
                >
                  <Input
                    className={styles.input}
                    name="password"
                    placeholder="Password"
                    type="password"
                    register={register}
                    validationRules={{
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters",
                      },
                    }}
                  />

                  {errors.password && (
                    <span className={styles.error}>
                      {errors.password.message}
                    </span>
                  )}
                </div>

                {authType === "signin" && (
                  <Button
                    type="button"
                    variant="text"
                    className={styles.forgotPassword}
                  >
                    Forgot Password?
                  </Button>
                )}

                <Button type="submit" variant="primary" fullWidth>
                  {authType === "signin" ? "Sign In" : "Sign Up"}
                </Button>

                <Button
                  variant="text"
                  onClick={() => setAuthType("welcome")}
                  className={styles.backButton}
                >
                  Back
                </Button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
