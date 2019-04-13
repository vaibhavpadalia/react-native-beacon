import React, { Component } from "react";
import { View, Text, DeviceEventEmitter, PermissionsAndroid, Platform, Image, Dimensions, ScrollView } from "react-native";
import Beacons from "react-native-beacons-manager";
import Config from "../../utils/Config";
import Constants from "../../utils/Constants";
import { callRemoteMethod } from "../../utils/WebServiceHandler";
import { renderIf } from "../../utils/CommonFunctions";
var uuid = "";

class Home extends Component {
  static navigationOptions = {
    header: null
  };

  state = {
    isBeaconPresent: false,
    city: "",
    nodes: []
  };

  componentWillMount() {
    this.requestFineLocationPermission();
  }

  componentDidMount = async () => {
    if (Platform.OS == "android") {
      Beacons.detectIBeacons();
      try {
        await Beacons.startRangingBeaconsInRegion("REGION1");
        console.warn(`Beacons ranging started succesfully!`);
      } catch (err) {
        console.warn(`Beacons ranging not started, error: ${err}`);
      }
      DeviceEventEmitter.addListener("beaconsDidRange", data => {
        // console.warn("Found beacons!", data);
        if (data.beacons.length == 0) {
          uuid = "";
          this.setState({ isBeaconPresent: false });
        } else {
          data = data.beacons.sort(function(i, b) {
            return i.distance - b.distance;
          });
          if (data[0].distance > 4) {
            uuid = "";
            this.setState({ isBeaconPresent: false });
          } else if (data[0]) {
            this.setState({ isBeaconPresent: true });
            if (uuid != data[0].uuid) {
              uuid = data[0].uuid;
              this.fetchNode(data[0].uuid);
            }
          }
        }
      });
    }
  };

  componentWillUnmount = () => {
    DeviceEventEmitter.removeAllListeners();
  };

  requestFineLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
        title: "Beacon",
        message: "The Application needs Access to your Bluetooth " + "to Track Beacons."
      });
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("You can use the system");
      } else {
        console.log("Beacon Tracking Denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };

  fetchNode = uuid => {
    callRemoteMethod(this, Config.URL.FETCH_NODE, { beacon_uuid: uuid }, "fetchNodeCallback", "POST", false);
  };

  fetchNodeCallback = response => {
    if (response) {
      this.setState({ city: response.data.current_node, nodes: response.data.adjacent_nodes });
    }
  };

  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "white" }}>
        {renderIf(
          !this.state.isBeaconPresent,
          <View style={{ alignItems: "center", marginTop: Dimensions.get("window").height / 3.5 }}>
            <Image source={Constants.IMAGE.FOOT} style={{ height: 200, width: 200 }} />
            <Text style={{ marginTop: 30, fontFamily: "Aileron-LightItalic", fontSize: 20 }}>{"Please move around."}</Text>
          </View>
        )}
        {renderIf(
          this.state.isBeaconPresent,
          <View>
            <View style={{ alignItems: "center", marginTop: 10 }}>
              <Text style={{ marginTop: 20, fontFamily: "Aileron-Regular", fontSize: 20 }}>
                {"Now you are at : " + this.state.city}
              </Text>
            </View>
            {this.state.nodes.map(function(obj, index) {
              return (
                <View key={index} style={{ margin: 10, marginTop: 20, borderRadius: 5, backgroundColor: "#F5F7FA" }}>
                  <View style={{ flexDirection: "row", margin: 5 }}>
                    <Text style={{ fontFamily: "Aileron-Light", fontSize: 20 }}>
                      {"Move " + obj.distance + " m to your " + obj.direction_name + " to find " + obj.desc}
                    </Text>
                  </View>
                  <View style={{ flexDirection: "row", margin: 5 }}>
                    <Text style={{ fontFamily: "Aileron-Bold", fontSize: 20 }}>{"Direction : "}</Text>
                    <Text style={{ fontFamily: "Aileron-Thin", fontSize: 20 }}>{obj.direction_name}</Text>
                  </View>
                  <View style={{ flexDirection: "row", margin: 5 }}>
                    <Text style={{ fontFamily: "Aileron-Bold", fontSize: 20 }}>{"Distance : "}</Text>
                    <Text style={{ fontFamily: "Aileron-Thin", fontSize: 20 }}>{obj.distance + " m"}</Text>
                  </View>
                </View>
              );
            }, this)}
          </View>
        )}
      </ScrollView>
    );
  }
}

export default Home;
