import React, { useEffect, useState } from 'react';
import { UserActionTrack } from '../Utilities/UserActionTrack.jsx';
import { RxCross2 } from "react-icons/rx";
const Survey = ({ access_token, campaigns, user_id }) => {
    const [surveyData, setSurveyData] = useState(null);
    const [isVisible, setIsVisible] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        const filteredData = campaigns.find(val => val.campaign_type === 'SUR');

        if (filteredData && filteredData.details) {
            setSurveyData(filteredData);

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
            console.log('No matching survey data found.');
        }
    }, [campaigns, user_id]);

    const closeSurvey = () => {
        setIsVisible(false);
    };

    const selectOption = (option) => {
        setSelectedOption(option);
    };

    const submitSurvey = async () => {
        if (surveyData && surveyData.details.id && selectedOption) {
            try {
                await UserActionTrack(user_id, surveyData.details.id, 'SUBMIT', { option: selectedOption });
                setIsVisible(false);
            } catch (error) {
                console.error('Error in tracking survey submission:', error);
            }
        } else {
            alert('Please select an option before submitting');
        }
    };

    if (!isVisible || !surveyData) {
        return null;
    }

    const {
        styling = {},
        surveyOptions = {},
        surveyQuestion = "Survey Question?"
    } = surveyData.details;

    const backgroundColor = styling.backgroundColor || "#ffffff";
    const ctaBackgroundColor = styling.ctaBackgroundColor || "#9ec3ff";
    const ctaTextIconColor = styling.ctaTextIconColor || "#000000";
    const optionColor = styling.optionColor || "#d6ffd7";
    const optionTextColor = styling.optionTextColor || "#000000";
    const selectedOptionColor = styling.selectedOptionColor || "#52ff66";
    const selectedOptionTextColor = styling.selectedOptionTextColor || "#000000";
    const surveyQuestionColor = styling.surveyQuestionColor || "#684b4b";
    const surveyTextColor = styling.surveyTextColor || "#000000";
    const othersBackgroundColor = styling.othersBackgroundColor || "#ffffff";
    const othersTextColor = styling.othersTextColor || "#000000";

    const options = [
        { id: 'option1', label: surveyOptions.option1 || 'Value1' },
        { id: 'option2', label: surveyOptions.option2 || 'Value2' },
        { id: 'option3', label: surveyOptions.option3 || 'Value3' },
        { id: 'option4', label: surveyOptions.option4 || 'Value4' }
    ];

    if (surveyData.details.hasOthers) {
        options.push({ id: 'others', label: 'Others' });
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50"
            style={{
                opacity: isVisible ? 1 : 0,
                visibility: isVisible ? 'visible' : 'hidden',
                transition: 'opacity 0.3s, visibility 0.3s'
            }}>

            <div className="fixed inset-0 bg-black bg-opacity-50" onClick={closeSurvey}></div>

            <div className="relative z-10 rounded-2xl w-11/12 max-w-md shadow-lg overflow-hidden flex flex-col"
                style={{ backgroundColor }}>

                <div className="flex justify-between items-center px-5 py-4">
                    <p></p>
                    <h2 className="text-2xl font-medium text-center pl-3"
                        style={{ color: surveyTextColor }}>
                        {surveyData.details.name || 'Survey'}
                    </h2>
                    <button
                        className="flex items-center justify-center w-8 h-8 rounded-full text-white text-2xl leading-none focus:outline-none"
                        style={{ backgroundColor: ctaBackgroundColor, color: ctaTextIconColor }}
                        onClick={closeSurvey}
                    >
                        <RxCross2 />
                    </button>
                </div>

                <div className="px-5 py-4 -mt-2 flex flex-col space-y-5">

                    <div>
                        <p className="text-xl font-medium" style={{ color: surveyQuestionColor }}>
                            {surveyQuestion}
                        </p>
                    </div>

                    <div className="flex flex-col space-y-2">
                        {options.map((option, index) => {
                            const optionLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
                            const letter = index < optionLetters.length ? optionLetters[index] : index + 1;

                            const isOthersOption = option.id === 'others';
                            const isSelected = selectedOption === option.id;

                            let bgColor = optionColor;
                            let textColor = optionTextColor;

                            if (isOthersOption) {
                                bgColor = othersBackgroundColor;
                                textColor = othersTextColor;
                            }

                            if (isSelected) {
                                bgColor = selectedOptionColor;
                                textColor = selectedOptionTextColor;
                            }

                            return (
                                <div
                                    key={option.id}
                                    className="flex items-center p-3 rounded-lg cursor-pointer border transition-colors"
                                    style={{
                                        backgroundColor: bgColor,
                                        color: textColor,
                                        borderColor: isSelected ? selectedOptionColor : 'transparent'
                                    }}
                                    onClick={() => selectOption(option.id)}
                                >
                                    <div className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-400 text-sm font-medium bg-white mr-3"
                                        style={{ color: 'black' }}>
                                        {letter}
                                    </div>
                                    <div className="text-base" style={{ color: textColor }}>
                                        {option.label}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        className="w-full py-3.5 rounded-lg font-medium mt-2.5 transition-colors hover:opacity-90"
                        style={{ backgroundColor: ctaBackgroundColor, color: ctaTextIconColor }}
                        onClick={submitSurvey}
                    >
                        SUBMIT
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Survey;