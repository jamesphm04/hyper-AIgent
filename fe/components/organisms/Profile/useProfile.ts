import { clearChatState } from "@/lib/redux/slices/chat/chatSlice";
import { clearGGSheetState } from "@/lib/redux/slices/gg-sheet/ggSheetSlice";
import { clearFileState } from "@/lib/redux/slices/upload/uploadSlice";
import { persistor } from "@/lib/redux/store";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";

export const useProfile = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const session = useSession();
  const dispatch = useDispatch();

  useEffect(() => {
    if (session.status === "authenticated") {
      setUsername(session.data?.user?.name || "");
      setEmail(session.data?.user?.email || "");
    } else {
      setUsername("");
      setEmail("");
    }
  }, [session]);

  const handleOpenProfile = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleCloseProfile = () => {
    setAnchorEl(null);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    toast.success("Logged out successfully!");

    // Clear Redux state first
    dispatch(clearFileState());
    dispatch(clearChatState());
    dispatch(clearGGSheetState());

    handleCloseProfile();
  };

  const handleSignIn = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    handleCloseProfile();
  };

  return {
    anchorEl,
    username,
    email,
    handleSignOut,
    handleSignIn,
    handleOpenProfile,
    handleCloseProfile,
  };
};
