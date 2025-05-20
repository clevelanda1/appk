import { useRef, useState, useEffect } from 'react';

interface SwipeGestureProps {
  onSwipeUp?: (distance: number) => void;
  onSwipeDown?: (distance: number) => void;
  threshold?: number;
  maxY?: number;
}

export const useSwipeGesture = (
  elementRef: React.RefObject<HTMLElement>,
  {
    onSwipeUp,
    onSwipeDown,
    threshold = 80,
    maxY = 300
  }: SwipeGestureProps
) => {
  const [startY, setStartY] = useState<number>(0);
  const [currentY, setCurrentY] = useState<number>(0);
  const [isSwiping, setIsSwiping] = useState<boolean>(false);
  
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;
    
    const handleTouchStart = (e: TouchEvent | MouseEvent) => {
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      setStartY(clientY);
      setCurrentY(clientY);
      setIsSwiping(true);
    };
    
    const handleTouchMove = (e: TouchEvent | MouseEvent) => {
      if (!isSwiping) return;
      
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      setCurrentY(clientY);
      
      // Prevent default to stop scrolling
      e.preventDefault();
    };
    
    const handleTouchEnd = () => {
      if (!isSwiping) return;
      
      const diff = startY - currentY;
      
      if (diff > threshold && onSwipeUp) {
        onSwipeUp(diff);
      } else if (diff < -threshold && onSwipeDown) {
        onSwipeDown(Math.abs(diff));
      }
      
      setIsSwiping(false);
    };
    
    // Add event listeners
    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd);
    
    // Also support mouse events for testing on desktop
    element.addEventListener('mousedown', handleTouchStart as EventListener);
    element.addEventListener('mousemove', handleTouchMove as EventListener);
    element.addEventListener('mouseup', handleTouchEnd);
    
    return () => {
      // Remove event listeners on cleanup
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
      element.removeEventListener('mousedown', handleTouchStart as EventListener);
      element.removeEventListener('mousemove', handleTouchMove as EventListener);
      element.removeEventListener('mouseup', handleTouchEnd);
    };
  }, [elementRef, isSwiping, onSwipeUp, onSwipeDown, startY, currentY, threshold]);
  
  // Calculate swipe distance for animations
  const swipeDistance = isSwiping ? startY - currentY : 0;
  const limitedDistance = Math.max(Math.min(swipeDistance, maxY), -maxY);
  
  return {
    isSwiping,
    swipeDistance: limitedDistance,
    // Apply this style to animate elements based on swipe
    style: {
      transform: isSwiping ? `translateY(${-limitedDistance}px)` : 'translateY(0)'
    }
  };
};