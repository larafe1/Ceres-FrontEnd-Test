import toast, { Toaster } from "react-hot-toast";

export function handleToastNotification(onSuccess: boolean, msg?: string) {
  if (onSuccess && msg) {
    toast.success(msg);
  } else {
    toast.error('Alguma coisa deu errado');
  }
}

export function ToasterNotification() {
  return (
    <Toaster
      containerStyle={{
        top: 5
      }}
      toastOptions={{
        success: {
          style: {
            background: '#acffad'
          }
        },
        error: {
          style: {
            background: '#ff8585'
          }
        }
      }}
    />
  );
}
