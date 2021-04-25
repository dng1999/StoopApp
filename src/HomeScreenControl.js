import React from 'react'



class HSControl extends React.Component {
    render() {
        return (
            <button onClick={this.props.onClick}>Hello</button>
        );
    }
}

export default HSControl;