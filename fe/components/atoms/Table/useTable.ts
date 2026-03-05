import { usePathname } from "next/navigation";

export const useTable = () => {
  const pathname = usePathname();

  return {
    pathname,
  };
};
