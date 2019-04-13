/**
 * WebService Handler
 * @author Vaibhav Padalia
 * @flow
 */

import { customAlert } from "./CommonFunctions";

export async function callRemoteMethod(obj, endpoint, data, returnMethod, type = "GET", loader) {
  if (loader == true) {
    obj.setState({ isLoading: true });
  }
  var request = {
    method: type,
    headers: {
      "Content-Type": "application/json",
    }
  };

  if (type != "GET") {
    request.body = JSON.stringify(data);
  }
  await fetch(endpoint, request)
    .then(resp => {
      if (loader == true) {
        obj.setState({ isLoading: false, refreshing: false });
      }
      if (resp.ok) {
        return resp;
      } else {
        throw { message: "Sorry for inconvenience!" };
      }
    })
    .then(response => response.json())
    .then(responseJson => {
      if (responseJson.responseCode == 200) {
        console.warn("responseJson", responseJson);
        eval("obj." + returnMethod + "(responseJson)");
      } else {
        setTimeout(() => {
          customAlert(responseJson.responseMessage);
        }, 500);
      }
    })
    .catch(error => {
      console.warn("error", error);
      obj.setState({ isLoading: false });
      setTimeout(() => {
        customAlert(error.message);
      }, 500);
    });
}
