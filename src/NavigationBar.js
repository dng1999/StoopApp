import React from 'react'

const NUM_NAVBAR_ITEMS = 3

// One menu item to go on the navigation bar
class NavBarItem extends React.Component {
    render() {
        return (
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "black",

                    width: String(100 / NUM_NAVBAR_ITEMS) + "%",

                    left: String(100 / NUM_NAVBAR_ITEMS * this.props.num) + "%",
                    height: this.props.height || "8vh",
                }}
            >
                <label>{this.props.children}</label>
            </div>
        )
    }
}

// Navigation bar at the bottom of the screen
class NavBar extends React.Component {
    render() {
        return (
            <div
                style={{
                    position: "absolute",
                    backgroundColor: "black",
                    width: "100%",
                    bottom: "0%",
                    height: this.props.height || "8vh",
                }}
            >
                {/* First navbar option; instead of the placeholder text put in buttons that are useful */}
                <NavBarItem
                    num={0}
                >
                    option1
                </NavBarItem>

                {/* Second navbar option */}
                <NavBarItem
                    num={1}
                >
                    option1
                </NavBarItem>

                {/* Third navbar option */}
                <NavBarItem
                    num={2}
                >
                    option1
                </NavBarItem>
            </div>
        )
    }
}

export default NavBar;