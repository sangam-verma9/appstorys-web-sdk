import axios from "axios";

export const TrackScreen = async (app_id, screen_name) => {
    // await e.preventDefault();

    const access_token = localStorage.getItem('access_token');
    if (!access_token) {
        console.log('Access token not found');
    }

    try {
        const response = await axios.post(
            'https://backend.appstorys.com/api/v1/users/track-screen/',
            { app_id, screen_name },
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