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

function SettingRow(props) {
  return (
    <label>
      <div class="settingName">{props.name}</div>
      <div class="settingValue">{props.value}</div>
    </label>
  );
}

class SettingToggle extends React.Component {
  render() {
    return (
      <div class="settingRow">
        <SettingRow
          name={this.props.name}
          value={"Off"}
        />
      </div>
    );
  }
}

class SettingScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      names: []
    };
  }

  componentDidMount(){
    axios.get('https://stoopapp-sd.herokuapp.com/settings')
      .then(res => {
        this.setState({names: res.names});
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  renderSettingsToggle() {
    return this.state.names.map((data) => {
      return <SettingToggle name={data} />;
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