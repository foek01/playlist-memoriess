import { useSnackbar } from "notistack";

export function useToaster() {
    const { enqueueSnackbar } = useSnackbar();

    return {
        addToast: (message, options) => {
            enqueueSnackbar(message, {
                anchorOrigin: { horizontal: "left", vertical: "top" },
                ...(options || {}),
            });
        },
    };
}
