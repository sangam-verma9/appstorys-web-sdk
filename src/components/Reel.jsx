import React, { useState, useEffect, useRef } from 'react';
import { UserActionTrack } from '../Utilities/UserActionTrack.jsx';
import { RxCross2 } from "react-icons/rx";
import { FaHeart, FaChevronUp, FaChevronDown } from "react-icons/fa";

const Reels = ({ access_token, campaigns, user_id }) => {
    const [reelsData, setReelsData] = useState(null);
    const [isViewerOpen, setIsViewerOpen] = useState(false);
    const [currentReelIndex, setCurrentReelIndex] = useState(0);
    const [isLiked, setIsLiked] = useState([]);
    const videoRef = useRef(null);

    useEffect(() => {
        const filteredData = campaigns.find(val => val.campaign_type === 'REL');

        if (filteredData && filteredData.details && filteredData.details.reels) {
            setReelsData(filteredData);

            if (filteredData.details.reels.length > 0) {
                setIsLiked(new Array(filteredData.details.reels.length).fill(false));
            }

            const trackImpression = async () => {
                try {
                    await UserActionTrack(user_id, filteredData.details.id, 'IMP');
                } catch (error) {
                    console.error('Error in tracking impression:', error);
                }
            };
            trackImpression();
        } else {
            console.log('No matching reels data found.');
        }
    }, [campaigns, user_id]);

    const handleReelClick = (index) => {
        setCurrentReelIndex(index);
        setIsViewerOpen(true);

        const trackClick = async () => {
            if (reelsData && reelsData.details && reelsData.details.reels[index]) {
                try {
                    await UserActionTrack(user_id, reelsData.details.reels[index].id, 'CLK');
                } catch (error) {
                    console.error('Error in tracking click:', error);
                }
            }
        };
        trackClick();
    };

    const handleClose = () => {
        setIsViewerOpen(false);
        if (videoRef.current) {
            videoRef.current.pause();
        }
    };

    const handleNextReel = () => {
        if (reelsData && reelsData.details && reelsData.details.reels) {
            const nextIndex = (currentReelIndex + 1) % reelsData.details.reels.length;
            setCurrentReelIndex(nextIndex);

            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.load();
                videoRef.current.play().catch(err => console.error('Error playing video:', err));
            }

            const trackImpression = async () => {
                try {
                    await UserActionTrack(user_id, reelsData.details.reels[nextIndex].id, 'IMP');
                } catch (error) {
                    console.error('Error in tracking impression:', error);
                }
            };
            trackImpression();
        }
    };

    const handlePrevReel = () => {
        if (reelsData && reelsData.details && reelsData.details.reels) {
            const prevIndex = (currentReelIndex - 1 + reelsData.details.reels.length) % reelsData.details.reels.length;
            setCurrentReelIndex(prevIndex);

            if (videoRef.current) {
                videoRef.current.pause();
                videoRef.current.load();
                videoRef.current.play().catch(err => console.error('Error playing video:', err));
            }

            const trackImpression = async () => {
                try {
                    await UserActionTrack(user_id, reelsData.details.reels[prevIndex].id, 'IMP');
                } catch (error) {
                    console.error('Error in tracking impression:', error);
                }
            };
            trackImpression();
        }
    };

    const handleLinkClick = () => {
        if (reelsData && reelsData.details && reelsData.details.reels && reelsData.details.reels[currentReelIndex]) {
            const currentReel = reelsData.details.reels[currentReelIndex];
            if (currentReel.link) {
                window.open(currentReel.link, '_blank');
            }
        }
    };

    // Handle liking a reel
    const handleLike = async (index) => {

        const newLikedState = [...isLiked];
        newLikedState[index] = !newLikedState[index];
        setIsLiked(newLikedState);

        if (reelsData && reelsData.details && reelsData.details.reels[index]) {
            try {
                await UserActionTrack(user_id, reelsData.details.reels[index].id, 'LIK');
            } catch (error) {
                console.error('Error in tracking like:', error);
            }
        }
    };

    // Auto-play video when reel viewer opens
    useEffect(() => {
        if (isViewerOpen && videoRef.current) {
            videoRef.current.play().catch(err => console.error('Error playing video:', err));
        }
    }, [isViewerOpen, currentReelIndex]);

    if (!reelsData || !reelsData.details || !reelsData.details.reels) {
        return null;
    }

    const { reels } = reelsData.details;

    return (
        <div className="reels-container">

            <div className="flex overflow-x-auto gap-4 py-4 px-2">
                {reels.map((reel, index) => {

                    const cornerRadius = reel.styling?.cornerRadius || "0";
                    const ctaBoxColor = reel.styling?.ctaBoxColor || "#1F4d9c";

                    return (
                        <div
                            key={reel.id}
                            className="relative cursor-pointer flex-shrink-0"
                            onClick={() => handleReelClick(index)}
                        >
                            <img
                                src={reel.thumbnail}
                                alt={`Reel ${index + 1}`}
                                className="object-cover"
                                style={{
                                    width: `${reel.styling?.thumbnailWidth || "120"}px`,
                                    height: `${reel.styling?.thumbnailHeight || "180"}px`,
                                    borderRadius: `${cornerRadius}px`
                                }}
                            />
                        </div>
                    );
                })}
            </div>

            {isViewerOpen && reels[currentReelIndex] && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    {/* Overlay */}
                    <div
                        className="fixed inset-0 bg-black bg-opacity-90"
                        onClick={handleClose}
                    ></div>

                    {/* Reel viewer */}
                    <div className="relative z-10  bg-black w-full max-w-md h-full max-h-screen flex flex-col items-center justify-center">
                        {/* Close button */}
                        <button
                            className="absolute top-4 right-4 text-white z-20"
                            onClick={handleClose}
                        >
                            <RxCross2 className="h-6 w-6" />
                        </button>
                        <div className='absolute top-1/2 right-4 flex flex-col text-white z-20'>
                            {/* Navigation buttons */}
                            <button
                                className=" transform -translate-y-1/2"
                                onClick={handlePrevReel}
                            >
                                <FaChevronUp className="h-6 w-6" />
                            </button>

                            <button
                                className=" transform translate-y-1/2"
                                onClick={handleNextReel}
                            >
                                <FaChevronDown className="h-6 w-6" />
                            </button>
                        </div>

                        <button
                            className="flex items-center gap-1 absolute right-4 top-2/3 z-10 flex-col"
                            onClick={(e) => {
                                e.stopPropagation();
                                handleLike(currentReelIndex);
                            }}
                        >
                            <FaHeart
                                className="h-5 w-5"
                                style={{
                                    color: isLiked[currentReelIndex]
                                        ? reels[currentReelIndex]?.styling?.likeButtonColor
                                        : "white",
                                }}
                            />
                            <span className='text-white'>{isLiked[currentReelIndex] ? reels[currentReelIndex].likes + 1 : reels[currentReelIndex].likes}</span>
                        </button>

                        <div className="relative w-full h-full flex items-center justify-center flex-col">
                            <video
                                ref={videoRef}
                                className="h-full w-auto max-w-full object-contain"
                                src={reels[currentReelIndex].video}
                                controls={false}
                                loop
                                playsInline
                                onClick={handleLinkClick}
                            />

                            <div className="absolute left-1/2 bottom-12 -translate-x-1/2 text-white z-20">
                                <p className="text-sm mb-4">{reels[currentReelIndex].description_text}</p>

                            </div>

                            <div
                                className="absolute left-1/2 bottom-4 -translate-x-1/2 px-4 py-2 rounded-lg cursor-pointer z-20"
                                style={{
                                    backgroundColor: reels[currentReelIndex].styling?.ctaBoxColor || "#1F4d9c",
                                    color: reels[currentReelIndex].styling?.ctaTextColor || "#ffffff",
                                    borderRadius: `${reels[currentReelIndex].styling?.cornerRadius || "0"}px`
                                }}
                                onClick={handleLinkClick}
                            >
                                <span>{reels[currentReelIndex].button_text}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reels;