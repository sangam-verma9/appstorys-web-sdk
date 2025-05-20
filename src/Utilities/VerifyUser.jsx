import axios from "axios";

export const VerifyUser = async (user_id, campaigns, attributes) => {
    // await e.preventDefault();

    try {
        if (!campaigns || campaigns.length == 0) {
            console.log('No campaigns found');
            // return;
        }

        const app_id = localStorage.getItem('app_id');
        const access_token = localStorage.getItem('access_token');

        const bodyData = {
            user_id: user_id,
            app_id: app_id,
            campaign_list: campaigns,
        };

        if (attributes) {
            bodyData.attributes = attributes;
        }

        const response = await axios.post(
            'https://backend.appstorys.com/api/v1/users/track-user/',
            bodyData,
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )

        // console.log("Response in Verify-User : ", response)

        if (response.statusText === "OK") {
            // const data = await response.json();
            user_id = response.data.user_id;
            campaigns = response.data.campaigns;

            // console.log('Campaigns in verifyuser : ', campaigns)

            return { user_id, campaigns }
        }
    }

    catch (error) {
        console.error('Error in Verify User : ', error);
    }
};