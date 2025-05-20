import React, { useEffect, useState } from 'react';
import { UserActionTrack } from '../Utilities/UserActionTrack.jsx';
import { GrPrevious, GrNext } from "react-icons/gr";

const Widget = ({ access_token, campaigns, user_id }) => {
    const [widgetData, setWidgetData] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [autoplay, setAutoplay] = useState(true);

    useEffect(() => {
        const widgetCampaigns = campaigns.filter(val => val.campaign_type === 'WID');

        if (widgetCampaigns) {
            setWidgetData(widgetCampaigns);
            const trackImpressions = async () => {
                for (const widget of widgetCampaigns) {
                    try {
                        await UserActionTrack(user_id, widget.id, 'IMP');
                    } catch (error) {
                        console.error(`Error tracking impression for widget ${widget.id}:`, error);
                    }
                }
            };

            trackImpressions();
        } else {
            console.log('No widget data found.');
        }
    }, [campaigns, user_id]);

    useEffect(() => {
        if (!autoplay) return;

        if (widgetData && widgetData.length > 0) {
            const widgetWithImages = widgetData.map(widget => {
                if (widget.details && widget.details.widget_images && widget.details.widget_images.length > 0) {
                    return widget.details.widget_images.filter(img => img.isActive);
                }
                return [];
            }).flat();

            if (widgetWithImages.length > 1) {
                const timer = setInterval(() => {
                    setCurrentImageIndex(prevIndex => {
                        const activeImages = widgetData.flatMap(widget =>
                            widget.details?.widget_images?.filter(img => img.isActive) || []
                        );
                        return (prevIndex + 1) % activeImages.length;
                    });
                }, 5000);

                return () => clearInterval(timer);
            }
        }
    }, [widgetData, autoplay]);

    const handleClick = async (widget, image) => {
        try {
            await UserActionTrack(user_id, widget.id, 'CLK');

            if (image.link) {
                window.open(image.link, '_blank');
            }
        } catch (error) {
            console.error('Error tracking click:', error);
        }
    };

    const handlePrevious = (e) => {
        e.stopPropagation();
        setAutoplay(false);
        setCurrentImageIndex(prevIndex => {
            const activeImages = widgetData.flatMap(widget =>
                widget.details?.widget_images?.filter(img => img.isActive) || []
            );
            return (prevIndex - 1 + activeImages.length) % activeImages.length;
        });
    };

    const handleNext = (e) => {
        e.stopPropagation();
        setAutoplay(false);
        setCurrentImageIndex(prevIndex => {
            const activeImages = widgetData.flatMap(widget =>
                widget.details?.widget_images?.filter(img => img.isActive) || []
            );
            return (prevIndex + 1) % activeImages.length;
        });
    };

    const handlehalfPrevious = (e) => {
        e.stopPropagation();
        setAutoplay(false);
        setCurrentImageIndex(prevIndex => {
            const activeImages = widgetData.flatMap(widget =>
                widget.details?.widget_images?.filter(img => img.isActive) || []
            );
            return (prevIndex - 2 + activeImages.length) % activeImages.length;
        });
    };

    const handlehalfNext = (e) => {
        e.stopPropagation();
        setAutoplay(false);
        setCurrentImageIndex(prevIndex => {
            const activeImages = widgetData.flatMap(widget =>
                widget.details?.widget_images?.filter(img => img.isActive) || []
            );
            return (prevIndex + 2) % activeImages.length;
        });
    };

    const goToSlide = (index, e) => {
        e.stopPropagation();
        setAutoplay(false);
        setCurrentImageIndex(index);
    };

    const resumeAutoplay = () => {
        setAutoplay(true);
    };

    if (!widgetData || widgetData.length === 0) {
        return null;
    }

    return (
        <div className={`widget-container`}>
            {widgetData.map((widget, widgetIndex) => {
                const type = widget.details?.type || "full";
                const images = widget.details?.widget_images?.filter(img => img.isActive) || [];
                const sortedImages = [...images].sort((a, b) => a.order - b.order);

                if (type === "full") {
                    const currentImage = sortedImages[currentImageIndex % sortedImages.length];

                    return currentImage ? (
                        <div
                            key={widget.id}

                            className="w-full relative my-5 px-1"
                            onMouseEnter={() => setAutoplay(false)}
                            onMouseLeave={resumeAutoplay}
                        >
                            <div
                                className={`cursor-pointer`}
                                style={{
                                    borderTopLeftRadius: `${widget.details.styling.topLeftRadius}px`,
                                    borderTopRightRadius: `${widget.details.styling.topRightRadius}px`,
                                    borderBottomRightRadius: `${widget.details.styling.bottomRightRadius}px`,
                                    borderBottomLeftRadius: `${widget.details.styling.bottomLeftRadius}px`,
                                    marginTop: `${widget.details.styling.topMargin}px`,
                                    marginLeft: `${widget.details.styling.leftMargin}px`,
                                    marginRight: `${widget.details.styling.rightMargin}px`,
                                    marginBottom: `${widget.details.styling.bottomMargin}px`,
                                }}
                                onClick={() => handleClick(widget, currentImage)}
                            >
                                <img
                                    src={currentImage.image}
                                    alt="Widget"
                                    style={{ height: `${widget.details.height}px` }}
                                    className={`w-full object-cover `}
                                />
                            </div>

                            {sortedImages.length > 1 && (
                                <>
                                    <button
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                        onClick={handlePrevious}
                                    >
                                        <GrPrevious className='h-5 w-5' />
                                    </button>

                                    <button
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                        onClick={handleNext}
                                    >
                                        <GrNext className='h-5 w-5' />
                                    </button>

                                    <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                                        {sortedImages.map((image, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => goToSlide(index, e)}
                                                className={`h-3 w-3 rounded-full ${index === currentImageIndex % sortedImages.length ? 'bg-gray-400 border border-gray-500 w-4 h-2' : 'bg-white border border-white w-4 h-2'}`}
                                                aria-label={`Go to slide ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    ) : null;
                } else if (type === "half") {
                    const totalPairs = Math.ceil(sortedImages.length / 2);
                    const currentPairIndex = Math.floor(currentImageIndex / 2) % totalPairs;
                    const startIdx = currentPairIndex * 2;
                    const currentPairImages = sortedImages.slice(startIdx, startIdx + 2);
                    return (
                        <div
                            key={widget.id}
                            className="w-full relative my-5"
                            onMouseEnter={() => setAutoplay(false)}
                            onMouseLeave={resumeAutoplay}
                        >
                            <div className="w-full flex flex-wrap">
                                {currentPairImages && (
                                    <div className='flex gap-3 justify-content-center w-full px-1'
                                        style={{
                                            borderTopLeftRadius: `${widget.details.styling.topLeftRadius}px`,
                                            borderTopRightRadius: `${widget.details.styling.topRightRadius}px`,
                                            borderBottomRightRadius: `${widget.details.styling.bottomRightRadius}px`,
                                            borderBottomLeftRadius: `${widget.details.styling.bottomLeftRadius}px`,
                                            marginTop: `${widget.details.styling.topMargin}px`,
                                            marginLeft: `${widget.details.styling.leftMargin}px`,
                                            marginRight: `${widget.details.styling.rightMargin}px`,
                                            marginBottom: `${widget.details.styling.bottomMargin}px`,
                                        }}
                                    >
                                        <div
                                            key={currentPairImages[0].id}
                                            className="w-1/2 cursor-pointer "
                                            onClick={() => handleClick(widget, currentPairImages[0])}
                                        >
                                            <img
                                                src={currentPairImages[0].image}
                                                alt={`Widget 0`}
                                                style={{ height: `${widget.details.height}px` }}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                        <div
                                            key={currentPairImages[1].id}
                                            className="w-1/2 cursor-pointer"
                                            onClick={() => handleClick(widget, currentPairImages[1])}
                                        >
                                            <img
                                                src={currentPairImages[1].image}
                                                alt={`Widget 1`}
                                                style={{ height: `${widget.details.height}px` }}
                                                className="w-full h-auto"
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {totalPairs > 1 && (
                                <>
                                    <button
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                        onClick={handlehalfPrevious}
                                    >
                                        <GrPrevious className='h-5 w-5' />
                                    </button>

                                    <button
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70"
                                        onClick={handlehalfNext}
                                    >
                                        <GrNext className='h-5 w-5' />
                                    </button>

                                    <div className="absolute bottom-4 w-full flex justify-center space-x-2">
                                        {Array.from({ length: totalPairs }).map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={(e) => goToSlide(index * 2, e)}
                                                className={`h-3 w-3 rounded-full ${index === currentPairIndex ? 'bg-gray-400 border border-gray-500 w-4 h-2' : 'bg-white border border-white w-4 h-2'}`}
                                                aria-label={`Go to pair ${index + 1}`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
};

export default Widget;