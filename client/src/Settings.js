import React from 'react';
import './Settings.css';
import axios from 'axios';

class UserProfile extends React.Component {
  render() {
    return (
      <div class="userProfile">
        Username<br/>
        Email<br/>
        Phone Number
      </div>
    );
  }
}

/*function SettingRow(props) {
  return (
    <label>
      <div class="settingName">{props.name}</div>
      <div class="settingValue">{props.value}</div>
    </label>
  );
}*/

class SettingToggle extends React.Component {
  render() {
    return (
      <div class="settingRow">
        <label>
          <div class="settingName">{this.props.name}</div>
          <div class="settingValue">{this.props.value}</div>
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
    axios.get('https://stoopapp-sd.herokuapp.com/settings')
      .then((response) => {
        console.log("GET response");
        console.log(response.data);
        this.setState({value: response.data.values});
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
      <div class="container">
        <UserProfile />
        {this.renderSettingsToggle()}
      </div>
    );
  }
}

export default SettingScreen;