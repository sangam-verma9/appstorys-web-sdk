import React, { useEffect, useState } from 'react';
import { UserActionTrack } from '../Utilities/UserActionTrack.jsx';
import { GoStarFill } from "react-icons/go";

const CSAT = ({ access_token, campaigns, user_id }) => {
    const [csatData, setCsatData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedRating, setSelectedRating] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);

    useEffect(() => {
        const filteredData = campaigns.find(val => val.campaign_type === 'CSAT');

        if (filteredData && filteredData.details) {
            setCsatData(filteredData);

            const displayDelay = filteredData.details.styling?.displayDelay || "0";
            const delayMs = parseInt(displayDelay, 10) * 1000;

            const timer = setTimeout(() => {
                setIsVisible(true);

                const trackImpression = async () => {
                    try {
                        await UserActionTrack(user_id, filteredData.details.id, 'IMP');
                    } catch (error) {
                        console.error('Error in tracking impression:', error);
                    }
                };
                trackImpression();
            }, delayMs);

            return () => clearTimeout(timer);
        } else {
            console.log('No matching CSAT data found.');
        }
    }, [campaigns, user_id]);

    const closeCSAT = () => {
        setIsVisible(false);
    };

    const handleStarClick = (rating) => {
        setSelectedRating(rating);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
    };

    const submitCSAT = async () => {
        if (csatData && csatData.details.id && selectedRating > 0) {
            try {
                await UserActionTrack(user_id, csatData.details.id, 'SUBMIT', {
                    rating: selectedRating,
                    feedback: selectedOption
                });

                setShowThankYou(true);

                setTimeout(() => {
                    setIsVisible(false);
                    setShowThankYou(false);
                }, 3000);

                if (csatData.details.link && selectedRating == 5) {
                    window.open(csatData.details.link, '_blank');
                }
            } catch (error) {
                console.error('Error in tracking CSAT submission:', error);
            }
        } else if (selectedRating === 0) {
            alert('Please select a rating before submitting');
        }
    };

    if (!isVisible || !csatData) {
        return null;
    }

    const {
        styling = {},
        feedback_option = {},
        description_text = "Rate you service 1 to 5 star",
        title = "I am optimus prime",
        thankyouDescription = "I like your perception.",
        thankyouText = "Nice to help you",
        thankyouImage = ""
    } = csatData.details;

    const backgroundColor = styling.csatBackgroundColor || "#fffccc";
    const titleColor = styling.csatTitleColor || "#000000";
    const descriptionTextColor = styling.csatDescriptionTextColor || "#000000";
    const ctaBackgroundColor = styling.csatCtaBackgroundColor || "#4b9bf1";
    const ctaTextColor = styling.csatCtaTextColor || "#e3dede";
    const unselectedStarColor = styling.csatUnselectedStarColor || "#e2e9f9";
    const highStarColor = styling.csatHighStarColor || "#f6fa00";
    const optionStrokeColor = styling.csatOptionStrokeColor || "#ccf5d1";
    const optionTextColor = styling.csatOptionTextColour || "#000000";
    const selectedOptionBackgroundColor = styling.csatSelectedOptionBackgroundColor || "#339cff";
    const selectedOptionTextColor = styling.csatSelectedOptionTextColor || "#e8e3e3";
    const fontFamily = styling.csatFontFamily || "Roboto";
    const fontSize = styling.fontSize || 19;

    const options = [
        { id: 'option1', label: feedback_option.option1 || 'value 1' },
        { id: 'option2', label: feedback_option.option2 || 'value 2' },
        { id: 'option3', label: feedback_option.option3 || 'value 3' }
    ];

    // Component styles
    const containerStyle = {
        fontFamily,
        fontSize: `${fontSize}px`,
        backgroundColor,
        maxWidth: "280px"
    };

    const starStyle = (active) => ({
        color: active ? highStarColor : unselectedStarColor,
        cursor: 'pointer'
    });

    const optionStyle = (isSelected) => ({
        backgroundColor: isSelected ? selectedOptionBackgroundColor : backgroundColor,
        color: isSelected ? selectedOptionTextColor : optionTextColor,
        border: `1px solid ${optionStrokeColor}`
    });

    if (showThankYou) {
        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">

                <div className="fixed inset-0 bg-black bg-opacity-50"></div>

                <div
                    className="relative z-10 rounded-xl p-4 shadow-lg flex flex-col items-center text-center"
                    style={containerStyle}
                >
                    {thankyouImage && (
                        <img
                            src={thankyouImage}
                            alt="Thank you"
                            className="w-32 h-32 object-contain mb-3"
                        />
                    )}
                    <h2 className="text-xl font-medium mb-2" style={{ color: titleColor }}>
                        {thankyouText}
                    </h2>
                    <p className="text-sm" style={{ color: descriptionTextColor }}>
                        {thankyouDescription}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">

            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeCSAT}></div>

            <div
                className="relative z-10 rounded-xl p-5 shadow-lg flex flex-col w-[500px]"
                style={containerStyle}
            >
                <h2 className="text-xl font-medium mb-2" style={{ color: titleColor }}>
                    {title}
                </h2>

                <p className="mb-4" style={{ color: descriptionTextColor }}>
                    {description_text}
                </p>

                <div className="flex mb-4 justify-between">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => handleStarClick(star)}
                            className="text-3xl hover:scale-[1.2]"
                            style={starStyle(star <= selectedRating)}
                        >
                            <GoStarFill />
                        </span>
                    ))}
                </div>

                <div className="flex flex-col space-y-2 mb-4">
                    {options.map((option) => (
                        <div
                            key={option.id}
                            className="py-1 px-3 rounded-md cursor-pointer transition-colors"
                            style={optionStyle(selectedOption === option.id)}
                            onClick={() => selectOption(option.id)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>

                <button
                    className="w-full py-2 rounded-md font-medium transition-colors hover:opacity-90 uppercase"
                    style={{ backgroundColor: ctaBackgroundColor, color: ctaTextColor }}
                    onClick={submitCSAT}
                >
                    SUBMIT
                </button>
            </div>
        </div>
    );
};

export default CSAT;