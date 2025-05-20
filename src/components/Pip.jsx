import React, { useState, useEffect, useRef, useMemo } from 'react';
// import black_cross from '../assets/black_cross.png';
// import play_image from '../assets/play_image.png'
// import pause_image from '../assets/pause_image.png'
// import close_image from '../assets/close_image.png'
import { MdClose , MdPlayArrow, MdPause} from 'react-icons/md';
import { UserActionTrack } from '../Utilities/UserActionTrack.jsx';

const Pip = ({ access_token, campaigns, user_id }) => {
  const [pipVisible, setPipVisible] = useState(true);
  const [fullScreenPipVisible, setFullScreenPipVisible] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [pipData, setPipData] = useState()

  const [position, setPosition] = useState({ x: window.innerWidth - 180, y: window.innerHeight - 230 });
  const [dragging, setDragging] = useState(false);
  const [rel, setRel] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const margin = 20;

  const videoRef = useRef(null);
  const pipRef = useRef(null);

  // Handle mouse movement
  useEffect(() => {
    const handleMove = (e) => {
      if (!dragging) return;

      // Get coordinates based on event type
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      const newX = clientX - rel.x;
      const newY = clientY - rel.y;

      // Boundary checks with margin
      const boundedX = Math.max(margin, Math.min(newX, window.innerWidth - 150 - margin));
      const boundedY = Math.max(margin, Math.min(newY, window.innerHeight - 200 - margin));

      setPosition({ x: boundedX, y: boundedY });
    };

    const handleEnd = (e) => {
      if (dragging) {
        const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
        const endY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;

        const distanceMoved = Math.sqrt(
          Math.pow(endX - dragStart.x, 2) +
          Math.pow(endY - dragStart.y, 2)
        );

        // Only trigger video click if it wasn't a drag and not clicking close button
        if (distanceMoved < 5 && !e.target.closest('.close-button')) {
          handleVideoClick();
        }
      }
      setDragging(false);
      enableSelection();
    };

    // Add both mouse and touch event listeners
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchend', handleEnd);
      enableSelection();
    };
  }, [dragging, rel, dragStart]);

  const disableSelection = () => {
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.overflow = 'hidden'; // Prevent scrolling on mobile
  };

  const enableSelection = () => {
    document.body.style.userSelect = 'auto';
    document.body.style.webkitUserSelect = 'auto';
    document.body.style.mozUserSelect = 'auto';
    document.body.style.msUserSelect = 'auto';
    document.body.style.overflow = fullScreenPipVisible ? 'hidden' : 'auto';
  };

  const handleStart = (e) => {
    // Prevent default touch behavior
    if (e.cancelable) {
      e.preventDefault();
    }

    // Don't initiate drag if clicking close button
    if (e.target.closest('.close-button')) {
      return;
    }

    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;

    setDragging(true);
    setDragStart({ x: clientX, y: clientY });

    // Calculate relative position
    const rect = pipRef.current.getBoundingClientRect();
    setRel({
      x: clientX - rect.left,
      y: clientY - rect.top
    });

    disableSelection();
  };

  const handleVideoClick = () => {
    setFullScreenPipVisible(true);
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    setPipVisible(false);
  };

  const togglePause = () => {
    setIsPaused((prev) => {
      const newPauseState = !prev;
      if (videoRef.current) {
        newPauseState ? videoRef.current.pause() : videoRef.current.play();
      }
      return newPauseState;
    });
  };

  useEffect(() => {
    document.body.style.overflow = fullScreenPipVisible ? 'hidden' : 'auto';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [fullScreenPipVisible]);

  useEffect(() => {
    const data = campaigns.find(val => val.campaign_type === 'PIP');

    if (data && data.id) {
      setPipData(data);
      console.log("pipData : ", data)

      const trackImpression = async () => {
        try {
          await UserActionTrack(user_id, data.id, 'IMP');
        } catch (error) {
          console.error('Error in tracking impression:', error);
        }
      };
      trackImpression();
    } else {
      console.log('No matching data found.');
    }
  }, [access_token, user_id, fullScreenPipVisible]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition(prev => {
        const newX = Math.min(prev.x, window.innerWidth - 150 - margin);
        const newY = Math.min(prev.y, window.innerHeight - 200 - margin);
        return { x: newX, y: newY };
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (!pipVisible) return null;

  return (
    <div
      className="fixed select-none"
      style={{
        top: position.y,
        left: position.x,
        touchAction: 'none'
      }}
    >
      {!fullScreenPipVisible && (
        <div
          ref={pipRef}
          className="h-[200px] w-[150px] relative min-[430px]:mb-[10px] cursor-grab select-none"
          onMouseDown={handleStart}
          onTouchStart={handleStart}
          style={{
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            userSelect: 'none'
          }}
        >
          {/* <img
            src={black_cross}
            alt="close"
            className="close-button absolute h-[20px] bg-white rounded-full -top-1 -right-1 cursor-pointer select-none z-[1000]"
            onClick={handleCloseClick}
          /> */}
          <MdClose
            size={20}
            className="close-button absolute h-[20px] bg-white rounded-full -top-1 -right-1 cursor-pointer select-none z-[1000]"
            onClick={handleCloseClick}
          />
          <video
            src={pipData?.details?.small_video}
            autoPlay
            muted
            loop
            playsInline // Important for iOS
            className="h-full w-full object-cover rounded-lg select-none"
            draggable="false"
          />
        </div>
      )}

      {fullScreenPipVisible && (
        <div className="h-[100vh] w-full fixed top-0 left-0">
          <div className="bg-[#000000cd] h-full w-full flex flex-col justify-start items-start z-[1500] py-[10px] space-y-2 px-[15px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex h-full w-full justify-center items-center gap-x-[10px]">
              <div className="w-[350px] h-full relative">
                <div className="h-[50px] w-full flex justify-between items-center space-x-3">
                  <button onClick={togglePause} className="p-2 bg-[#00000047] text-white rounded-lg">
                    {/* <img
                      src={isPaused ? play_image : pause_image}
                      alt={isPaused ? "Play" : "Pause"}
                      className="h-[20px]"
                    /> */}
                    {isPaused ? (
                      <MdPlayArrow
                      size={20}
                      className="h-[20px]"
                      />
                    ) : (
                      <MdPause
                      size={20}
                      className="h-[20px]"
                      />
                    )}
                  </button>
                </div>
                <div className="w-full h-[90%] max-[430px]:h-[85%] mt-[10px] relative">
                  <video
                    ref={videoRef}
                    src={pipData?.details?.large_video}
                    className="w-full h-full object-cover rounded-[10px]"
                    autoPlay
                    loop
                    playsInline // Important for iOS
                  />
                  <div className="w-full flex justify-center">
                    <a
                      href={pipData?.details?.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white py-[5px] px-[15px] fixed bottom-[10%] max-[430px]:bottom-[15%] rounded-md"
                      onClick={async () => {
                        try {
                          await UserActionTrack(user_id, pipData.id, 'CLK');
                        } catch (error) {
                          console.error('Error in tracking click:', error);
                        }
                      }}
                    >
                      Continue to Site
                    </a>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setFullScreenPipVisible(false)}
                className="hover:cursor-pointer fixed top-5 right-5 p-2 bg-[#00000047] text-white rounded-lg"
              >
                {/* <img src={close_image} alt="Close" className="h-[15px] hover:cursor-pointer" /> */}
                <MdClose
                  size={20}
                  className="h-[20px] hover:cursor-pointer"
                />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pip;