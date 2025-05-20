import React, { useEffect, useMemo, useState } from "react";
// import black_cross from "../assets/black_cross.png";
import { UserActionTrack } from "../Utilities/UserActionTrack.jsx";
import { MdClose } from 'react-icons/md';

const Banner = ({ access_token, campaigns, user_id }) => {
  const [bannerVisible, setBannerVisisble] = useState(true);
  const data = useMemo(
    () => campaigns.find((val) => val.campaign_type === "BAN"),
    [campaigns]
  );

  // console.log(data)

  useEffect(() => {
    trackImpression();
    // if (data && data.id) {
    //   UserActionTrack(user_id, data.id, "IMP");
    // }
  }, [data, user_id, access_token]);

  const trackImpression = async () => {
    try {
      await UserActionTrack(user_id, data.id, "IMP");
    } catch (error) {
      console.error("Error in tracking click:", error);
    }
  
  }

  return (
    <>
      {data && data.details && data.details.image !== "" && bannerVisible && (
        <div
        // className="flex flex-col w-full h-full justify-end items-center fixed bottom-3"
        className="w-[100%] left-[10%] fixed bottom-3"
        >
          <div className="h-[100px] w-[80%] max-[904px]:w-[85%] max-[768px]:w-[95%] max-[768px]:h-[80px] relative mb-[10px]">
            {/* <img
              src={black_cross}
              alt={black_cross}
              className="absolute h-[20px] bg-white rounded-full -top-1 -right-1 shadow-lg shadow-slate-400"
              onClick={() => {
                setBannerVisisble(false);
              }}
            /> */}
            <MdClose
            size={20}
            className="absolute h-[20px] bg-white rounded-full -top-1 -right-1 shadow-lg shadow-slate-400"
            onClick={() => {
              setBannerVisisble(false);
            }}
          />
            <a
              href={`${data.details.link}`}
              target="blank"
              onClick={async () => {
                try {
                  await UserActionTrack(user_id, data.id, "CLK");
                } catch (error) {
                  console.error("Error in tracking click:", error);
                }
              }}
            >
              <img
                src={data.details.image}
                alt={`${data.details.image}`}
                className="h-full w-full object-cover"
              />
            </a>
          </div>
        </div>
      )}
    </>
  );
};

export default Banner;
