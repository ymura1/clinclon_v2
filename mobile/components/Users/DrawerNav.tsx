import React from 'react';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import WorkingHistory from './WorkingHistory';
import HireServiceProvider from './HireServiceProvider';
import ManageServiceProviders from './ManageServiceProviders';
import Home from './Home';
import {useDispatch} from 'react-redux';
import {signOutUser} from '../../redux/actions/signInAction';

const CustomDrawerContent = (props: any) => {
  const dispatch = useDispatch();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Sign Out"
        onPress={() => {
          props.navigation.navigate('SignIn');
          dispatch(signOutUser());
        }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNav = () => {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="My Working Records" component={WorkingHistory} />
      <Drawer.Screen name="Hire Service Provider" component={HireServiceProvider} />
      <Drawer.Screen name="Manage Service Provider" component={ManageServiceProviders} />
    </Drawer.Navigator>
  );
};

export default DrawerNav;
