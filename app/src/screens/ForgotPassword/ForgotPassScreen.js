import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {
  View,
  Image,
  Text,
  Alert,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import styles from './styles';

import Input from '../../components/Input';
import {TouchableOpacity} from 'react-native-gesture-handler';
import logoImg from '../assets/logo.png';
import inputReducer, {FORM_INPUT_UPDATE} from '../../components/InputReducer';
import {useDispatch} from 'react-redux';
import {Colors} from 'react-native-paper';
import * as authActions from '../../store/actions/auth';

const ForgotPassScreen = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [formState, dispatchFormState] = useReducer(inputReducer, {
    inputValues: {
      email: '',
    },
    inputValidities: {
      email: false,
    },
    formIsValid: false,
  });

  const dispatch = useDispatch();

  const inputChangeHandler = useCallback(
      (inputIdentifier, inputValue, inputValidity) => {
        dispatchFormState({
          type: FORM_INPUT_UPDATE,
          value: inputValue,
          isValid: inputValidity,
          input: inputIdentifier,
        });
      },
      [dispatchFormState],
  );

  useEffect(() => {
    if (error) {
      Alert.alert('Pempp!', error, [{text: 'Foi mau'}]);
    }
  }, [error]);

  const forgotHandler = async () => {
    if (isLoading) return;

    const action = authActions.forgotPass(
        formState.inputValues.email,
    );

    setError(null);
    setIsLoading(true);

    try {
      await dispatch(action);

      setIsLoading(false);
      props.navigation.navigate('CodeConfirm', {
        email: formState.inputValues.email,
      });
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.contentCenter}>
        <ActivityIndicator size="large" color={Colors.blue200} />
      </View>);
  }

  return (
    <TouchableWithoutFeedback style={styles.screen} onPress={() => Keyboard.dismiss()}>
      <View style={styles.container}>
        <Image style={styles.imagem} source={logoImg}/>

        <View style={styles.inputContainer}>
          <Input
            id="email"
            style={styles.input}
            blurOnSubmit
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="Email"
            email
            onInputChange={inputChangeHandler}
            required
            errorText="Coloque um email válido"
          />
        </View>

        <View style={styles.actions}>
          <View style={{opacity:
            (formState.formIsValid && !isLoading) ? 1.0 : 0.5}}>
            <TouchableOpacity
              style={styles.button}
              disabled={!formState.formIsValid && !isLoading}
              onPress={forgotHandler}>
              <Text style={styles.buttonText}>Continuar</Text>
            </TouchableOpacity>
          </View>

        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default ForgotPassScreen;
