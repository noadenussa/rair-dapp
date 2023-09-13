//@ts-nocheck
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Popup } from 'reactjs-popup';
import { utils } from 'ethers';

import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../ducks/users/users.types';
// React Redux types
import useConnectUser from '../../hooks/useConnectUser';
import chainData from '../../utils/blockchainData';

import AikonWidget from './AikonWidget/AikonWidget';
import EditMode from './EditMode/EditMode';
import defaultPictures from './images/defaultUserPictures.png';
import {
  SvgFactoryIcon,
  SvgUpload,
  SvgUserIcon
} from './SettingsIcons/SettingsIcons';

const PopUpSettings = ({
  showAlert,
  selectedChain,
  setTabIndexItems,
  isSplashPage
}) => {
  const settingBlockRef = useRef();
  const navigate = useNavigate();
  const [next, setNext] = useState(false);
  const [, /*openModal*/ setOpenModal] = useState(false);
  const [userName, setUserName] = useState();
  const [userEmail, setUserEmail] = useState();
  const [triggerState, setTriggerState] = useState();
  const [editMode, setEditMode] = useState(false);
  const [userBalance, setUserBalance] = useState<string>('');

  const hotdropsVar = process.env.REACT_APP_HOTDROPS;

  const { primaryColor } = useSelector((store) => store.colorStore);

  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const { adminRights, loggedIn } = useSelector<RootState, any>(
    (store) => store.userStore
  );

  const { logoutUser } = useConnectUser();

  const { userData } = useSelector((store) => store.userStore);
  const { erc777Instance, currentUserAddress, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);

  const { loginType } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const onChangeEditMode = useCallback(() => {
    setEditMode((prev) => !prev);
  }, [setEditMode]);

  useEffect(() => {
    if (userData) {
      setUserName(userData.nickName);
      setUserEmail(userData.email);
      if (userData.avatar) {
        setImagePreviewUrl(userData.avatar);
      }
    }
  }, [userData]);

  const getBalance = useCallback(async () => {
    if (currentUserAddress && erc777Instance?.provider) {
      const balance = await erc777Instance.provider.getBalance(
        currentUserAddress
      );

      const result = utils.formatEther(balance);
      const final = Number(result.toString())?.toFixed(3)?.toString();

      setUserBalance(final);
    }
  }, [currentUserAddress, erc777Instance]);

  useEffect(() => {
    getBalance();
  }, [getBalance]);

  const cutUserAddress = () => {
    if (userName) {
      const length = userName.length;
      return length > 13
        ? userName.slice(0, 5) + '....' + userName.slice(length - 4)
        : userName;
    }
    if (currentUserAddress) {
      return (
        currentUserAddress.slice(0, 4) + '....' + currentUserAddress.slice(38)
      );
    }
  };

  useEffect(() => {
    setOpenModal();
  }, [setOpenModal]);

  const pushToUploadVideo = (tab: number) => {
    setTabIndexItems(tab);
    navigate('/demo/upload');
  };

  const pushToFactory = () => {
    navigate('/creator/deploy');
  };

  const pushToProfile = () => {
    navigate(`/${currentUserAddress}`);
    setTriggerState(false);
  };

  const handlePopUp = () => {
    setNext((prev) => !prev);
    setOpenModal((prev) => !prev);
  };

  const onCloseNext = useCallback(() => {
    if (!triggerState) {
      setNext(false);
    }
  }, [triggerState]);

  useEffect(() => {
    onCloseNext();
  }, [onCloseNext]);

  useEffect(() => {
    return () => setEditMode(false);
  }, []);

  return (
    <>
      <button
        onClick={() => setTriggerState((prev) => !prev)}
        className={`button profile-btn ${
          primaryColor === 'rhyno' ? 'rhyno' : ''
        }`}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start'
        }}>
        <div
          className={`profile-buy-button ${
            primaryColor === 'rhyno' ? 'rhyno' : ''
          }`}>
          {loginType === 'oreid' ? <AikonWidget /> : '|'}
        </div>
        <div
          className={`profile-user-balance ${
            primaryColor === 'rhyno' ? 'rhyno' : ''
          }`}>
          <div>{userBalance}</div>
          {chainData[currentChain] && (
            <img src={chainData[currentChain]?.image} alt="logo" />
          )}
        </div>
        <div
          className="profile-btn-img"
          style={{
            height: '100%',
            width: '37px',
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            overflow: 'hidden',
            background: `${imagePreviewUrl === null ? 'var(--royal-ice)' : ''}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
          {imagePreviewUrl ? (
            <img
              onClick={(event) =>
                event.altKey && event.shiftKey
                  ? alert('Front v0.06.12.22 iFrame+qualityVideo')
                  : null
              }
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              src={imagePreviewUrl === null ? defaultPictures : imagePreviewUrl}
              alt="User Avatar"
            />
          ) : (
            <SvgUserIcon />
          )}
        </div>
        <div
          style={{
            display: 'flex',
            width: '140px',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 5px'
          }}>
          <span
            style={{
              padding: '0 0px 0 2px',
              color: primaryColor === 'charcoal' ? '#fff' : '#383637',
              fontSize: '14px'
            }}>
            {cutUserAddress()}
          </span>
          <i
            className={`icon-menu fas fa-bars ${
              hotdropsVar === 'true' ? 'hotdrops-btn' : ''
            }`}></i>
        </div>
      </button>
      <Popup
        className="popup-settings-block"
        open={triggerState}
        position="bottom center"
        closeOnDocumentClick
        onClose={() => {
          setTriggerState(false);
          setEditMode(false);
        }}>
        <div
          ref={settingBlockRef}
          className={`user-popup ${primaryColor === 'rhyno' ? 'rhyno' : ''}`}
          style={{
            background: primaryColor === 'rhyno' ? '#F2F2F2' : '#383637',
            borderRadius: 16,
            filter: 'drop-shadow(0.4px 0.5px 1px black)',
            boder: `${primaryColor === 'rhyno' ? '1px solid #DEDEDE' : 'none'}`,
            marginTop: `${selectedChain && showAlert ? '65px' : '12px'}`
          }}>
          {!next ? (
            <div>
              <ul className="list-popup">
                <li
                  // onClick={handlePopUp}
                  onClick={pushToProfile}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <SvgUserIcon primaryColor={primaryColor} /> Profile settings
                </li>
                {/* {hotdropsVar !== 'true' && ( */}
                {hotdropsVar === 'true'
                  ? loggedIn &&
                    adminRights && (
                      <li
                        onClick={() => pushToUploadVideo(2)}
                        style={{
                          color:
                            primaryColor === 'rhyno'
                              ? 'rgb(41, 41, 41)'
                              : 'white'
                        }}>
                        <SvgUpload primaryColor={primaryColor} /> Upload video
                      </li>
                    )
                  : loggedIn && (
                      <li
                        onClick={() => pushToUploadVideo(2)}
                        style={{
                          color:
                            primaryColor === 'rhyno'
                              ? 'rgb(41, 41, 41)'
                              : 'white'
                        }}>
                        <SvgUpload primaryColor={primaryColor} /> Upload video
                      </li>
                    )}
                {/* )} */}
                {/* <li
                  onClick={() => pushToMyItems(2)}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <SvgMyFavorites primaryColor={primaryColor} /> My favorites
                </li> */}
                {/* <li
                  onClick={() => pushToMyItems(0)}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <SvgItemsIcon primaryColor={primaryColor} /> My Items
                </li> */}
                {process.env.REACT_APP_DISABLE_CREATOR_VIEWS !== 'true' &&
                  adminRights && (
                    <li
                      onClick={pushToFactory}
                      style={{
                        color:
                          primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                      }}>
                      <SvgFactoryIcon primaryColor={primaryColor} /> Factory
                    </li>
                  )}
                {/* {loginType === 'oreid' && <AikonWidget />} */}
                <li
                  onClick={logoutUser}
                  style={{
                    color:
                      primaryColor === 'rhyno' ? 'rgb(41, 41, 41)' : 'white'
                  }}>
                  <i className="fas fa-sign-out-alt"></i>Logout
                </li>
              </ul>
            </div>
          ) : (
            <EditMode
              handlePopUp={handlePopUp}
              imagePreviewUrl={imagePreviewUrl}
              defaultPictures={defaultPictures}
              cutUserAddress={cutUserAddress}
              editMode={editMode}
              onChangeEditMode={onChangeEditMode}
              userEmail={userEmail}
              mainName={userName ? userName : cutUserAddress()}
              setMainName={setUserName}
              setMainEmail={setUserEmail}
              setImagePreviewUrl={setImagePreviewUrl}
            />
          )}
        </div>
      </Popup>
    </>
  );
};

export default PopUpSettings;
