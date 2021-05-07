import React from 'react';
import './Settings.css';
import axios from 'axios';
import { toast } from "react-toastify";

class UserProfile extends React.Component {
  render() {
    return (
      <div className="userProfile">
        Username<br/>
        Email<br/>
        Phone Number
      </div>
    );
  }
}

class SettingToggle extends React.Component {
  render() {
    return (
      <div className="settingRow" onClick={this.props.action}>
        <label>
          <div className="settingName">{this.props.name}</div>
          <div className="settingValue">{this.props.value}</div>
        </label>
      </div>
    );
  }
}

class SettingScreen extends React.Component {
  constructor(props){
    super(props);
    this.updateSetting = this.updateSetting.bind(this);
    this.state = {
      values: {}
    };
  }

  componentDidMount(){
    axios.get('/api/settings')
      .then((response) => {
        console.log("GET response");
        console.log(response.data);
        this.setState({values: response.data.values});
      })
      .catch(function (error) {
        toast.error(
          error.response
            ? error.response.data
            : "Some error has been occured. Please try again."
        )
      })
  }

  updateSetting(name){
    let valueCopy = {...this.state.values};
    if (valueCopy[name] === 'Off'){
      valueCopy[name] = 'On';
    }
    else {
      valueCopy[name] = 'Off';
    }
    const settingObj = {
      settingName: name,
      settingValue: valueCopy[name]
    };
    axios.post('/api/settings', settingObj)
      .then((response) => {
        this.setState({values: valueCopy});
      })
      .catch(function (error) {
        toast.error(
          error.response
            ? error.response.data
            : "Unable to update settings."
        )
      })
  }

  renderSettingsToggle() {
    return Object.entries(this.state.values).map(([key, value]) => {
      return <SettingToggle name={key} value={value} action={this.updateSetting}/>
    });
  }

  render() {
    return (
      <div className="container">
        <div className="form-box">
          <div className="setting-container">
            <UserProfile />
            <SettingToggle name="test" value="test"/>
            {this.renderSettingsToggle()}
          </div>
        </div>
      </div>
    );
  }
}

export default SettingScreen;