type ToastOptions = {
  title: string;
  description: string;
  variant?: 'success' | 'destructive' | 'default';
};

export const toast = (options: ToastOptions) => {
  console.log(`${options.variant}: ${options.title} - ${options.description}`);
  // Replace with your preferred toast implementation
}; 