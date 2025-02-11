import { useMediaQuery } from "react-responsive";

export const useScreenSize = () => {
    const isLarge = useMediaQuery({ minWidth: 1280 });
    const isMedium = useMediaQuery({ minWidth: 960 });
    const isSmall = useMediaQuery({ minWidth: 600 });

    if (isLarge) return "large";
    if (isMedium) return "medium";
    if (isSmall) return "small";
    return "mobile";
};
