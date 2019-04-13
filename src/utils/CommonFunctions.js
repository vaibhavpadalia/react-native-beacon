import { Alert } from "react-native";
/**
 * @author Vaibhav Padalia
 * @description Display alert with text whenever called.
 * @param customString Message That you want to display.
 */
export function customAlert(message) {
  setTimeout(() => {
    Alert.alert(
      'Beacon',
      message,
      [
        { text: 'OK', onPress: () => { } },
      ],
      { cancelable: false }
    )
  }, 100);
}

/**
 * @author Vaibhav Padalia
 * @description Display alert with text whenever called.
 * @param fieldName Message That you want to display.
 * @param regexType Regexp for the data that is given as input.
 * @param data The  input value that is entered by user.
 */

export function validation(fieldName, regexType, data) {
  if (regexType.test(data) === false) {
    customAlert("Enter a valid " + fieldName + ".");
    return false;
  } else {
    return true;
  }
}

/**
 * @author Vaibhav Padalia
 * @param condition The condition that has to be checked.
 * @param content The content that is to be shown when condition is true.
 * @description Function for conditional rendering.
 */

export function renderIf(condition, content) {
  if (condition) {
    return content;
  } else {
    return null;
  }
}