import React from 'react';
import './Settings.css';
import axios from 'axios';

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
      <div className="settingRow">
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
    this.state = {
      values: {}
    };
  }

  componentDidMount(){
    axios.get('https://stoopapp-sd.herokuapp.com/api/settings')
      .then((response) => {
        console.log("GET response");
        console.log(response.data);
        this.setState({values: response.data.values});
      })
      .catch(function (error) {
        console.error(error);
      })
  }

  renderSettingsToggle() {
    return Object.entries(this.state.values).map(([key, value]) => {
      return <SettingToggle name={key} value={value}/>
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