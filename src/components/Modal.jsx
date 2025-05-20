import React, { useEffect, useState } from 'react';
import { UserActionTrack } from '../Utilities/UserActionTrack.jsx';
import { RxCross2 } from "react-icons/rx";

const Modal = ({ access_token, campaigns, user_id }) => {
    const [modalData, setModalData] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        const filteredData = campaigns.find(val => val.campaign_type === 'MOD');

        if (filteredData && filteredData.details) {
            setModalData(filteredData);
            setIsOpen(true);

            const trackImpression = async () => {
                try {
                    await UserActionTrack(user_id, filteredData.id, 'IMP');
                } catch (error) {
                    console.error('Error in tracking impression:', error);
                }
            };
            trackImpression();
        } else {
            console.log('No matching modal data found.');
        }
    }, [campaigns, user_id]);

    const handleClose = () => {
        setIsOpen(false);
    };

    const handleClick = async () => {
        if (modalData && modalData.id) {
            try {
                await UserActionTrack(user_id, modalData.id, 'CLK');
                window.location.href = link;

                setIsOpen(false);

                if (modalData.details && modalData.details.link) {
                    window.open(modalData.details.link, '_blank');
                }
            } catch (error) {
                console.error('Error in tracking click:', error);
            }
        }
    };

    if (!isOpen || !modalData || !modalData.details) {
        return null;
    }

    const backgroundOpacity = modalData.details.modals && modalData.details.modals[0]?.backgroundOpacity
        ? modalData.details.modals[0].backgroundOpacity
        : 1;

    const borderRadius = modalData.details.modals && modalData.details.modals[0]?.borderRadius
        ? modalData.details.modals[0].borderRadius
        : "0";

    const imageUrl = modalData.details.modals && modalData.details.modals[0]?.url
        ? modalData.details.modals[0].url
        : "";

    const link = modalData.details.modals && modalData.details.modals[0]?.link
        ? modalData.details.modals[0].link
        : "#";

    const width = modalData.details.modals && modalData.details.modals[0]?.size
        ? modalData.details.modals[0].size
        : "300";

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50" >
            <div
                className="fixed inset-0 bg-black"
                style={{ opacity: backgroundOpacity }}
                onClick={handleClose}
            ></div>

            <div className="relative z-10 bg-white rounded-lg max-w-md w-full mx-4" style={{ width: `${width}px` }}>
                <button
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                    onClick={handleClose}
                >
                    <RxCross2 className='h-6 w-6' />
                </button>

                <div
                    className={`cursor-pointer`}
                    onClick={handleClick}
                    style={{ borderRadius: `${borderRadius}px ` }}
                >
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt="Modal Content"
                            className={` object-cover`}
                            style={{ borderRadius: `${borderRadius}px` }}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default Modal;