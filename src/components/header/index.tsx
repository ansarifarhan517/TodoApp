import React, { useState } from 'react';
import { Button, Icon, DropDown } from '@base';
import './style.scss';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const dispatch = useDispatch();
  let location = useLocation()

  const [isFavActive, setIsFavActive] = useState<boolean>(false);


  const logOutHandler = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('sessionStarted');

    dispatch({
      type: '@@app/SET_SESSION',
      payload: {
        userId: null,
        sessionStarted: null,
      },
    });
    window.location.replace('/login');
  };

  const showFavTodosHandler = () => {
    const newState = !isFavActive;
    setIsFavActive(newState);
    dispatch({
      type: '@@todo/SET_TOGGLE_FAV_TODO_BUTTON',
      payload: {
        isFavTodosButton: newState,
      },
    });
  };

  const menuOptions = [
    { label: localStorage.getItem('userName') ?? '', value: localStorage.getItem('userName') ?? '' },
    { label: 'Profile', value: 'profile' },
    { label: 'Logout', value: 'logout' },
  ];

  const handleMenuChange = (e: Record<string, string>) => {
    const selected = e.menu;
    if (selected === 'logout') {
      logOutHandler();
    }
  };

  return (
    <div className="header">
      {!location.pathname.includes('/category') && <Button
        category="secondary"
        withIcon
        clickHandler={showFavTodosHandler}
      >
        <Icon name={isFavActive ? 'bookmark' : 'bookmark-o'} color="black" size="small" />
      </Button>}
      <h1>TODOER</h1>
      <DropDown
        className='w-100px'
        options={menuOptions}
        name="menu"
        value={localStorage.getItem('userName') ?? ''}
        changeHandler={handleMenuChange}
      />
    </div>
  );
};

export default Header;
