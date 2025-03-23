interface NavigateOptions {
  replace?: boolean;
}

export function useNavigate() {
  return (path: string, options: NavigateOptions = {}) => {
    if (typeof window === 'undefined') return;

    if (options.replace) {
      window.history.replaceState(null, '', path);
    } else {
      window.history.pushState(null, '', path);
    }

    // Dispatch a popstate event to trigger any listeners
    window.dispatchEvent(new PopStateEvent('popstate'));
  };
} 