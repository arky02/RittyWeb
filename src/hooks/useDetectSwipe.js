import { useState } from "react";

const useDetectSwipe = () => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [swiped, setSwiped] = useState(false);

  // the required distance between touchStart and touchEnd to be detected as a swipe
  const minSwipeDistance = 30;

  const onTouchStart = (e) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    setTouchStart(e.targetTouches[0].clientX);
    setStartTime(new Date().getTime());
  };

  const onTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const endTime = new Date().getTime();
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if ((isLeftSwipe || isRightSwipe) && endTime - startTime > 600) {
      // console.log(endTime - startTime);
      // console.log("swipe", isLeftSwipe ? "left" : "right");
      setSwiped(true);
      setTimeout(() => setSwiped(false), 2000);
    }
    // add your conditional logic here
  };

  return { onTouchStart, onTouchMove, onTouchEnd, swiped };
};

export default useDetectSwipe;
