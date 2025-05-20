import React, { useEffect, useState } from 'react';
import { UserActionTrack } from '../Utilities/UserActionTrack.jsx';

const Floater = ({ access_token, campaigns, user_id, data }) => {
    const [floaterData, setFloaterData] = useState(null);
    // console.log(campaigns)
    // console.log("Data : ", data)

    useEffect(() => {
        const filteredData = campaigns.find(val => val.campaign_type === 'FLT');

        if (filteredData) {
            setFloaterData(filteredData);

            const trackImpression = async () => {
                try {
                    await UserActionTrack(user_id, filteredData.id, 'IMP');
                } catch (error) {
                    console.error('Error in tracking impression:', error);
                }
            };
            trackImpression();
            // console.log(floaterData)
        } else {
            console.log('No matching data found.');
        }
    }, [campaigns, user_id]);

    if (!floaterData || !floaterData.details || floaterData.details.image === '') {
        return null;
    }

    return (
        <div 
        // className='flex justify-end items-end w-full h-full p-[25px] fixed bottom-5 right-5 max-[1024px]:right-3 max-[1024px]:bottom-3 max-[490px]:right-[5px] max-[490px]:bottom-[5px]'
        className='fixed bottom-5 right-5 max-[1024px]:right-3 max-[1024px]:bottom-3 max-[490px]:right-[5px] max-[490px]:bottom-[5px]'
        >
            <a
                href={floaterData.details.link}
                target='_blank'
                rel='noopener noreferrer'
                onClick={async () => {
                    try {
                        await UserActionTrack(user_id, floaterData.id, 'CLK');
                    } catch (error) {
                        console.error('Error in tracking click:', error);
                    }
                }}
            >
                <img
                    src={floaterData.details.image}
                    alt='Floater Icon'
                    className='h-[60px] w-[60px] rounded-full hover:cursor-pointer max-[768px]:w-[55px] max-[768px]:h-[55px]'
                />
            </a>
        </div>
    );
};

export default Floater;
