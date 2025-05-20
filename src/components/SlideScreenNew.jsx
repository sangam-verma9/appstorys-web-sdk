import React, { useEffect, useRef, useState } from "react";
// import close_image from "../assets/close_image.png";
// import white_arrow from "../assets/white_arrow.png";
// import pause_image from "../assets/pause_image.png";
// import play_image from "../assets/play_image.png";
import { MdClose, MdPlayArrow, MdPause, MdArrowForward } from 'react-icons/md';
import { UserActionTrack } from "../Utilities/UserActionTrack.jsx";
import { FaSpinner } from 'react-icons/fa';
// import Loader from "../assets/Loader.gif";

const SlideScreenNew = ({
  data,
  index,
  setSlideScreenVisible,
  storyCampaignId,
  userId,
}) => {
  const [content, setContent] = useState([]);
  const [current, setCurrent] = useState(0);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(index);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isContentReady, setIsContentReady] = useState(false);
  const [currentDuration, setCurrentDuration] = useState(5000);
  const animationRef = useRef(null);
  const videoRef = useRef(null);
  const startTimeRef = useRef(null);
  const elapsedRef = useRef(0); // Tracks the total elapsed time before pause

  useEffect(() => {
    if (data?.details[currentGroupIndex]?.slides) {
      const slides = data.details[currentGroupIndex].slides.map((slide) => ({
        ...slide,
        finish: 0,
      }));
      setContent(slides);
    }
  }, [data, currentGroupIndex]);

  useEffect(() => {
    setIsContentReady(false);
    setProgress(0);
    elapsedRef.current = 0;
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setIsPaused(false);
  }, [current]);

  const startProgress = (duration) => {
    if (!isContentReady) return;

    startTimeRef.current = performance.now();

    const animate = (timestamp) => {
      if (isPaused) return;

      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }

      const elapsed = timestamp - startTimeRef.current + elapsedRef.current;
      const progressValue = Math.min((elapsed / duration) * 100, 100);
      setProgress(progressValue);

      if (progressValue < 100) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        handleNext();
      }
    };

    animationRef.current = requestAnimationFrame(animate);
  };

  const togglePause = () => {
    setIsPaused((prevPaused) => {
      const newPausedState = !prevPaused;

      if (newPausedState) {
        // Pause
        elapsedRef.current += performance.now() - startTimeRef.current; // Save elapsed time
        if (videoRef.current && content[current]?.video) {
          videoRef.current.pause();
        }
        cancelAnimationFrame(animationRef.current);
      } else {
        // Resume
        if (videoRef.current && content[current]?.video) {
          videoRef.current.play();
        }
        startProgress(currentDuration);
      }

      return newPausedState;
    });
  };

  const handleNext = () => {
    cancelAnimationFrame(animationRef.current);
    elapsedRef.current = 0; // Reset elapsed time
    if (current < content.length - 1) {
      setContent((prev) =>
        prev.map((item, idx) =>
          idx === current ? { ...item, finish: 1 } : item
        )
      );
      setCurrent(current + 1);
    } else if (currentGroupIndex < data.details.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      setCurrent(0);
    } else {
      close();
    }
  };

  const handlePrevious = () => {
    cancelAnimationFrame(animationRef.current);
    elapsedRef.current = 0; // Reset elapsed time
    if (current > 0) {
      setContent((prev) =>
        prev.map((item, idx) =>
          idx === current ? { ...item, finish: 0 } : item
        )
      );
      setCurrent(current - 1);
    } else if (currentGroupIndex > 0) {
      setCurrentGroupIndex(currentGroupIndex - 1);
      const prevGroupSlides = data.details[currentGroupIndex - 1].slides;
      setContent(
        prevGroupSlides.map((slide) => ({
          ...slide,
          finish: 0,
        }))
      );
      setCurrent(prevGroupSlides.length - 1);
    }
  };

  const close = () => {
    setSlideScreenVisible(false);
  };

  const handleImageLoaded = () => {
    setIsContentReady(true);
    setCurrentDuration(5000);
  };

  const handleVideoLoaded = (e) => {
    setCurrentDuration(e.target.duration * 1000);
    setIsContentReady(true);
  };

  useEffect(() => {
    if (isContentReady && content[current]?.id && !isPaused) {
      UserActionTrack(userId, storyCampaignId, "IMP", content[current].id);
      startProgress(currentDuration);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isContentReady, content, current, currentDuration, storyCampaignId, userId, isPaused]);

  return (
    <div className="bg-[#000000cd] h-full w-full flex flex-col justify-start items-start z-50 min-[435px]:py-[10px] space-y-2 min-[435px]:px-[15px]">
      <div className="flex h-full w-full justify-center items-center gap-x-[10px]">
        <button
          onClick={handlePrevious}
          className="p-2 bg-[#00000047] text-white rounded-lg max-[435px]:fixed max-[435px]:left-[2%] z-[100]"
        >
          {/* <img
            src={white_arrow}
            alt="Previous"
            className="h-[25px] rotate-180"
          /> */}
          <MdArrowForward
          size={25}
          className="h-[25px] rotate-180"
          />
        </button>
        <div className="min-[435px]:w-[350px] h-full relative w-full">
          <div className="h-[50px] w-full flex justify-between items-center space-x-3 max-[435px]:fixed max-[435px]:top-[5%] max-[435px]:z-[200] max-[435px]:px-[15px]">
            <div className="gap-x-[10px] flex items-center">
              {data.details[currentGroupIndex]?.thumbnail && (
                <img
                  src={data.details[currentGroupIndex].thumbnail}
                  alt="Thumbnail"
                  className="w-10 h-10 rounded-full"
                />
              )}
              <p className="text-white">
                {data.details[currentGroupIndex]?.name}
              </p>
            </div>
            <div className="flex justify-start items-center gap-x-[5px]">
              <button
                onClick={togglePause}
                className="p-2 bg-[#00000047] text-white rounded-lg"
              >
                {isPaused ? (
                  // <img
                  //   src={play_image}
                  //   alt="Play"
                  //   className="h-[20px] max-[435px]:h-[15px]"
                  // />
                  <MdPlayArrow
                    size={20}
                    className="h-[20px] max-[435px]:h-[15px]"
                  />
                ) : (
                  // <img
                  //   src={pause_image}
                  //   alt="Pause"
                  //   className="h-[20px] max-[435px]:h-[15px]"
                  // />
                  <MdPause
                    size={20}
                    className="h-[20px] max-[435px]:h-[15px]"
                  />
                )}
              </button>
              <button
                onClick={close}
                className="hover:cursor-pointer p-2 bg-[#00000047] text-white rounded-lg"
              >
                {/* <img src={close_image} alt="Close" className="h-[15px]" /> */}
                <MdClose
                  size={20}
                  className="h-[20px]"
                  />
              </button>
            </div>
          </div>
          <div className="w-full h-[90%] max-[435px]:h-[100%] mt-[10px] relative">
            <div className="w-full flex space-x-1 absolute top-2 px-3">
              {content.map((_, idx) => (
                <div key={idx} className="flex-1 h-1 bg-gray-400 rounded">
                  <div
                    className="h-full bg-white rounded"
                    style={{
                      width:
                        current === idx
                          ? `${progress}%`
                          : content[idx].finish
                            ? "100%"
                            : "0%",
                    }}
                  ></div>
                </div>
              ))}
            </div>
            {!isContentReady && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-[10px]">
                {/* <img src={Loader} className="h-[60px]" alt="Loading" /> */}
                <FaSpinner className="animate-spin text-gray-500 h-[40px] w-[40px]" />
              </div>
            )}
            {content[current]?.image && (
              <img
                src={content[current].image}
                onLoad={handleImageLoaded}
                className="w-full h-full object-cover rounded-[10px]"
                alt="Story Slide"
              />
            )}
            {content[current]?.video && (
              <video
                ref={videoRef}
                src={content[current].video}
                className="w-full h-full object-cover rounded-[10px]"
                autoPlay
                onLoadedMetadata={handleVideoLoaded}
                onEnded={handleNext}
              />
            )}
            {content[current]?.link && content[current]?.button_text && (
              <div className="absolute bottom-[10%] w-full flex justify-center text-center">
                <a
                  href={content[current].link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white text-black font-bold py-[10px] px-[22px] rounded-3xl shadow-lg"
                  onClick={() =>
                    UserActionTrack(
                      userId,
                      storyCampaignId,
                      "CLK",
                      content[current]?.id
                    )
                  }
                >
                  {content[current].button_text}
                </a>
              </div>
            )}
          </div>
        </div>
        <button
          onClick={handleNext}
          className="p-2 bg-[#00000047] text-white rounded-lg max-[435px]:fixed max-[435px]:right-[2%] z-[100]"
        >
          {/* <img src={white_arrow} alt="Next" className="h-[25px]" /> */}
          <MdArrowForward
          size={25}
          className="h-[25px]"
          />
        </button>
      </div>
    </div>
  );
};

export default SlideScreenNew;




