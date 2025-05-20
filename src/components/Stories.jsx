import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import SlideScreenNew from './SlideScreenNew.jsx';
import { UserActionTrack } from '../Utilities/UserActionTrack.jsx';
import './stories.css'

const Stories = ({ campaigns, user_id }) => {
    const [slideScreenVisible, setSlideScreenVisible] = useState(false);
    const [slidesData, setSlidesData] = useState(null);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(null);

    const data = campaigns.find((val) => val.campaign_type === 'STR');

    useEffect(() => {

        
    
    }, [])
    
    
    

    useEffect(() => {
        if (data && data.id) {
            UserActionTrack(user_id, data.id, 'IMP');
        }
    }, [data, user_id]);

    const handleOpenSlideScreen = (storyGroupIndex) => {
        setSlideScreenVisible(true);
        setSlidesData(data);
        setCurrentGroupIndex(storyGroupIndex);
        UserActionTrack(user_id, data.id, 'CLK');
    };

    return (
    
    <div className="flex justify-start items-center w-full relative px-[5px]">
      {/* Scrollable container */}
      <div className="flex overflow-x-auto scrollbar-hide whitespace-nowrap gap-x-[15px] max-[1024px]:gap-x-[10px] max-[768px]:gap-x-[6px] max-[442px]:gap-x-[8px] max-[400px]:gap-x-[8px]">
        {data?.details &&
          data.details.map((storyGroup, index) => (
            <div
              key={index}
              className="flex-shrink-0 h-[135px] w-[100px] max-[1024px]:w-[90px] max-[768px]:w-[75px] max-[442px]:w-[60px] max-[400px]:w-[50px] bg-transparent flex justify-center items-center hover:cursor-pointer"
            >
              <div className="mt-1.5 flex flex-col items-center">
                <div
                  className={`h-[82px] w-[82px] max-[1024px]:h-[70px] max-[1024px]:w-[70px] max-[768px]:h-[65px] max-[768px]:w-[65px] max-[442px]:h-[60px] max-[442px]:w-[60px] max-[400px]:h-[50px] max-[400px]:w-[50px] rounded-full p-[5px] border-2 max-[549px]:p-[2px] flex justify-center items-center`}
                  style={{ borderColor: storyGroup.ringColor }}
                  onClick={() => handleOpenSlideScreen(index)}
                >
                  <img
                    src={storyGroup.thumbnail}
                    alt="thumbnail"
                    className="w-full h-full rounded-full"
                  />
                </div>
                <p
                  className="mt-[2px] text-sm text-center max-[442px]:text-[10px]"
                  style={{ color: storyGroup.nameColor }}
                >
                  {storyGroup.name}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Slide Screen */}
      {slideScreenVisible && slidesData && (
        <div className="h-[100vh] w-[100vw] fixed top-0 left-0">
          <SlideScreenNew
            setSlideScreenVisible={setSlideScreenVisible}
            data={slidesData}
            index={currentGroupIndex}
            storyCampaignId={data.id}
            userId={user_id}
          />
        </div>
      )}
    </div>
 


      
    );
};

export default Stories;
