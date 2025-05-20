import React, { useEffect, useState } from 'react'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Background from '../Background.png'
import axios from 'axios'
import Floater from './components/Floater'
import Banner from './components/Banner'
import Stories from './components/Stories'
import Pip from './components/Pip'
import { VerifyAccount } from './Utilities/VerifyAccount'
import { TrackScreen } from './Utilities/TrackScreen'
import { VerifyUser } from './Utilities/VerifyUser'
import { TrackUser } from './Utilities/TrackUser'
import Modal from './components/Modal'
import Widget from './components/Widget'
import Survey from './components/Survey'
import CSAT from './components/Csat'
import Reels from './components/Reel'

// import { Stories, VerifyAccount, TrackScreen, VerifyUser, TrackUser, Floater, Banner, Pip } from '@appstorys/appstorys-reactwebsdk'

const appId = '9e1b21a2-350a-4592-918c-2a19a73f249a';
const accountId = '4350bf8e-0c9a-46bd-b953-abb65ab21d11';
const screenName = 'Home Screen';
const user_id = 'adc3354364jfjbswsbvdsx';
const attributes = {
  key: 'value',
};

const App = () => {
  const [access_token, setAccess_token] = useState();
  const [data, setData] = useState();

  useEffect(() => {
    async function init() {
      await VerifyAccount(accountId, appId);
      const campaigns = await TrackScreen(appId, screenName);
      const verifiedUser = await VerifyUser(user_id, campaigns);

      if (verifiedUser) {
        setData(verifiedUser);
      }

      await TrackUser(user_id, attributes);
      const access_token = localStorage.getItem('access_token');
      if (access_token) {
        setAccess_token(access_token);
      }
    }

    init();
  }, []);

  if (!data || !access_token) {
    return null;
  }

  return (
    <>
      <div className='max-w-[100vw] relative bg-[#fff]'>
        {console.log(data)}
        <Stories access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        <img src={Background} alt={`${Background}`} className='h-auto w-full' />
        <Banner access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        <Floater access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        <Pip access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        <Modal access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        <Reels access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        <Widget access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        <Survey access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
        <CSAT access_token={access_token} campaigns={data.campaigns} user_id={data.user_id} />
      </div>
    </>
  )
}

export default App
