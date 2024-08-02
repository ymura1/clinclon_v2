import React, {useEffect, useState} from 'react';
import {LOCAL_HOST_URL} from '../../config.js';
import axios from 'axios';
import {Text, View, SafeAreaView, Alert} from 'react-native';
import {styles} from '../../styles/hireServiceProviderStyles.js';
import validator from 'validator';
import InputField from '../InputField';
import InputError from '../InputError';
import Button from './Button';
import Popup from '../Popup';

const HireServiceProvider = (props: any) => {
  const {firstName, lastName, email} = props.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [inputError, setInputError] = useState({
    type: '',
    msg: '',
  });

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const validateEmail = (type: string): boolean => {
    if (searchInput.length === 0) {
      setInputError({
        type: `${type}_EMPTY_EMAIL`,
        msg: 'Email is required',
      });
      return false;
    }
    if (!validator.isEmail(searchInput)) {
      setInputError({
        type: `${type}_INVALID_FORMAT`,
        msg: 'Email is not valid',
      });
      return false;
    }
    return true;
  };

  const searchEmail = () => {
    if (!validateEmail('SEARCH')) return;
    axios
      .get(`${LOCAL_HOST_URL}/user/exists/${searchInput}`)
      .then(res => {
        const msg = `Select ${res.data[0].first_name} ${res.data[0].last_name}?`;
        showAlert(msg, null, function () {
          navigateToNext(res.data[0]);
        });
      })
      .catch(error => {
        const msg = `Add ${searchInput} as a service provider`;
        showAlert(msg, null, emailToNotFoundUser);
        return error;
      });
  };

  const emailToNotFoundUser = () => {
    axios
      .post(`${LOCAL_HOST_URL}/not/user/send`, {
        params: {
          serviceProviderEmail: searchInput,
          userInfo: {
            firstName,
            lastName,
            userEmail: email,
          },
        },
      })
      .then(() => {
        const msg = `An email has been sent to ${searchInput}. You will see the user on your home page once the request is approved. `;
        showAlert(msg, null, navigateToHome);
      })
      .catch(() => {});
  };

  const showAlert = (msg: string, cancelCb: any, confirmCb: any) => {
    Alert.alert(msg, '', [
      {
        text: 'No',
        onPress: cancelCb ? cancelCb : () => console.log('cancel pressed'),
        style: 'cancel',
      },
      {
        text: 'Yes',
        onPress: confirmCb,
      },
    ]);
  };

  const navigateToNext = (data: any) => {
    props.navigation.navigate('PersonalInfo', {
      firstName: data.first_name,
      lastName: data.last_name,
      email: data.email_address,
    });
  };

  const navigateToHome = () => {
    props.navigation.navigate('Home', {
      firstName,
      lastName,
      email,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {modalVisible && <Popup modalVisible={modalVisible} setModalVisible={setModalVisible} />}
      <View>
        <Text>Enter the email of a service provider you would like to hire</Text>
      </View>
      <View style={styles.subContainer}>
        <Text>Email</Text>
        <InputField.Outlined
          onChangeText={(val: any) => setSearchInput(val)}
          isEditable={true}
        />
        {(inputError.type === 'SEARCH_EMPTY_EMAIL' ||
          inputError.type === 'SEARCH_INVALID_FORMAT' ||
          inputError.type === 'EMAIL_NOT_FOUND') && (
          <InputError error={inputError} />
        )}
        <Button.Outlined title="Continue" onPress={searchEmail} />
      </View>
    </SafeAreaView>
  );
};

export default HireServiceProvider;
