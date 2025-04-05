import { useNavigate } from 'react-router-dom';

/**
 * Custom hook that combines navigation with automatic scroll-to-top behavior
 * @returns {Object} Navigation functions with scroll-to-top behavior
 */
const useScrollOnNavigate = () => {
  const navigate = useNavigate();

  /**
   * Navigate to a path and scroll to top
   * @param {string} path - The path to navigate to
   * @param {Object} options - Navigation options
   */
  const navigateTo = (path, options = {}) => {
    // Scroll to top
    window.scrollTo(0, 0);
    // Navigate to the path
    navigate(path, options);
  };

  /**
   * Go back in history and scroll to top
   * @param {number} [delta=-1] - Number of steps to go back
   */
  const goBack = (delta = -1) => {
    // Scroll to top
    window.scrollTo(0, 0);
    // Navigate back
    navigate(delta);
  };

  return {
    navigateTo,
    goBack,
    navigate // Original navigate function for backward compatibility
  };
};

export default useScrollOnNavigate; 