import axios from "axios";

export const TrackUser = async (user_id, attributes) => {
    // await e.preventDefault();

    const access_token = localStorage.getItem('access_token');
    const app_id = localStorage.getItem('app_id');

    if (!access_token) {
        console.log('Access token not found');
    }

    try {
        const response = await axios.post(
            'https://backend.appstorys.com/api/v1/users/update-user/',
            { user_id, app_id, attributes },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${access_token}`
                }
            }
        )

        // Nothing 
    }

    catch (error) {
        console.error('Error in trackUser', error);
    }
};