import toast from 'react-hot-toast';

export function toastSuccess(message: string) {
    toast.success(message, {
        style: {
            background: '#1e9c44',
            padding: '16px',
            color: '#fff',
            height: '3rem',
        },
        iconTheme: {
            primary: '#fff',
            secondary: '#1e9c44',
        },
        });
}

export function toastError(message: string) {
    toast.error(message, {
        style: {
        background: '#ee4d4d',
        padding: '16px',
        color: '#fff',
        height: '3rem',
        },
        iconTheme: {
        primary: '#fff',
        secondary: '#ee4d4d',
        },
    });
}