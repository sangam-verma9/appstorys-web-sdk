import axios from "axios";

export const UserActionTrack = async (user_id, campaign_id, event_type, story_slide) => {
    // await e.preventDefault();

    const access_token = localStorage.getItem('access_token');

    if (!access_token) {
        console.log('Access token not found');
    }

    const body = {
        campaign_id,
        user_id,
        event_type
    };

    if (story_slide) {
        body.story_slide = story_slide;
    }

    console.log("Inside user action track function")

    try {
        const response = await axios.post(
            'https://backend.appstorys.com/api/v1/users/track-action/',
            body,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )

        // console.log("Response in track-screen : ", response)

        if (response.statusText === "OK") {
            const data = await response.data.campaigns
            return data || [];
        }
    }

    catch (error) {
        console.log(error)
    }
};