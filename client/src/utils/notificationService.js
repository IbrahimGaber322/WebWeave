let snackbarRef = null;

export const setSnackbarRef = (ref) => {
    snackbarRef = ref;
};

export const showSuccess = (message) => {
    if (snackbarRef) {
        snackbarRef.showSuccess(message);
    }
};

export const showError = (message) => {
    if (snackbarRef) {
        snackbarRef.showError(message);
    }
};

export const showWarning = (message) => {
    if (snackbarRef) {
        snackbarRef.showWarning(message);
    }
};

export const showInfo = (message) => {
    if (snackbarRef) {
        snackbarRef.showInfo(message);
    }
};

export default {
    setSnackbarRef,
    showSuccess,
    showError,
    showWarning,
    showInfo
};
