import { setCurrentGGSheetId } from "@/lib/redux/slices/gg-sheet/ggSheetSlice";
import { uploadGGSheetURL } from "@/services/gg-sheets/ggSheetService";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";

type GGSheetModalProps = {
  setIsOpen: (isOpen: boolean) => void;
};

export const useGGSheetModal = ({ setIsOpen }: GGSheetModalProps) => {
  const dispatch = useDispatch();
  const [uploading, setUploading] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [fileName, setFileName] = useState<string | null>(null);

  const session = useSession();
  const user = {
    isLoggedIn: session.status === "authenticated",
    id: session.data?.user?.id || 0,
    username: session.data?.user?.name || "",
    email: session.data?.user?.email || "",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async () => {
    if (inputValue.trim() === "") return;

    setUploading(true);
    try {
      const resData = await uploadGGSheetURL(inputValue, user.id);

      dispatch(setCurrentGGSheetId(resData.ggSheetFileId));
      setFileName(resData.ggSheetFileName);
      toast.success("Google Sheet URL uploaded successfully!");
      setIsOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Failed to upload Google Sheet URL.");
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    inputValue,
    handleInputChange,
    handleSubmit,
  };
};
