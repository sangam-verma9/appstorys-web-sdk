import axios from "axios";

export const VerifyAccount = async (account_id, app_id) => {
    // await e.preventDefault();

    try {
        localStorage.setItem('app_id', app_id);
        const response = await axios.post(
            'https://backend.appstorys.com/api/v1/admins/validate-account/',
            { account_id, app_id },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            }
        )

        if (response.statusText === "OK") {
            // const data = await response.json()
            const { access_token, refresh_token } = response.data

            if (access_token && refresh_token) {
                localStorage.setItem('access_token', access_token)
                localStorage.setItem('refresh_token', refresh_token)
            }
        }
    }

    catch (error) {
        console.log(error)
    }
};