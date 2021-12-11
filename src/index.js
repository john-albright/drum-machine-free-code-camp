import React from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import { createStore } from 'redux';
import './index.css';

// REDUX CODE -----------------------------------------

const ON = 'ON';
const OFF = 'OFF';

// Actions 
const powerOn = () => {
    return {
        type: ON
    };
}

const powerOff = () => {
    return {
        type: OFF
    };
}

// Initial state to be used as a default argument in the reducer
const initialState = {
    power: true
};

//Reducer
const powerReducer = (state = initialState, action) => {
    switch(action.type) {
        case ON:
            return {
                power: true
            };
        case OFF:
            return {
                power: false
            }
        default:
            return state; 
    }
}

// Create store 
const store = createStore(powerReducer);

store.subscribe(() => console.log(store.getState())); // log the changes in the Redux state to the console 

// REACT CODE -----------------------------------------

// Information for all 9 drum pads 
const drumBank = [
    {
        keyCode: 81,
        keyTrigger: 'Q',
        id: 'Clap',
        url: 'sounds/808_6_Clap.wav'
    },
    {
        keyCode: 87,
        keyTrigger: 'W',
        id: 'High Pitch',
        url: 'sounds/808_5_High_Pitch.wav'
    },
    {
        keyCode: 69,
        keyTrigger: 'E',
        id: 'Kick 1',
        url: 'sounds/808_K_kick.wav'
    },
    {
        keyCode: 65,
        keyTrigger: 'A',
        id: 'Snare 1',
        url: 'sounds/909CX_40_SN2_6.wav'
    },
    {
        keyCode: 83,
        keyTrigger: 'S',
        id: 'Ride Cymbal',
        url: 'sounds/909CX_59_RD2_8.wav'
    },
    {
        keyCode: 68,
        keyTrigger: 'D',
        id: 'Snare 2',
        url: 'sounds/Alchemist_Snare_9.wav'
    },
    {
        keyCode: 90,
        keyTrigger: 'Z',
        id: 'Shaker',
        url: 'sounds/Alchemist_Shaker_1.wav'
    },
    {
        keyCode: 88,
        keyTrigger: 'X',
        id: 'Cymbal Crash',
        url: 'sounds/808_4_Cymbal_Crash.wav'
    },
    {
        keyCode: 67,
        keyTrigger: 'C',
        id: 'Hi Hat',
        url: 'sounds/Alchemist_HiHat_8.wav'
    }
];

// Styles for drum (when played versus when not played)
const activeStyle = {
    backgroundColor: 'blue',
    borderColor: 'black',
    transform: 'scale(1.1)'
};

const inactiveStyle = {
    backgroundColor: 'transparent'
};

// Individual drum component
class Drum extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            drumStyle: inactiveStyle
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.emitSound = this.emitSound.bind(this);
        this.activatePad = this.activatePad.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress(e) {
        if (this.props.powerOnOff && e.keyCode === this.props.keyCode) {
            this.emitSound();
        }
    }

    activatePad() {
        if (this.props.powerOnOff) {
            if (this.state.drumStyle.backgroundColor !== 'blue') {
                this.setState({
                    drumStyle: activeStyle
                });
            } else {
                this.setState({
                    drumStyle: inactiveStyle
                });
            }
        }
    }

    emitSound() {
        if (this.props.powerOnOff) {
            const sound = document.getElementById(this.props.keyTrigger);
            //const url = sound.src;
            console.log(sound);
    
            //sound.load(); 
            sound.currentTime = 0; // allows audio to be interrupted
            var playPromise = sound.play();
    
            this.props.updateDisplay(this.props.id);
            setTimeout(() => this.activatePad(), 100);
            setTimeout(() => this.activatePad(), 300);
    
            if (playPromise !== undefined) {
                playPromise.then(function() {
                    console.log(`Playing ${sound}`);
                }).catch(function(error) {
                    console.error(error);
                });
            }
        }
    }

    render() {
        return(
            <div
                className = "drum-pad"
                id = {this.props.id}
                onClick = {this.emitSound}
                style = {this.state.drumStyle}
                >
                <audio
                    className = "clip"
                    id = {this.props.keyTrigger}
                    src = {this.props.audioLink}
                />
                {this.props.keyTrigger}
            </div>
        );
    }
}

// Wrap the power button in a container??
/* class PowerButton extends React.Component {
    constructor(props) {
        super(props);

        this.pressPower = this.pressPower.bind(this);
    }

    pressPower() {
        if (!this.props.powerOnOff) {
            this.props.powerOn();
        } else {
            this.props.powerOff();
        }
    }

    render() {
        return(
            <div id="power" onClick={this.pressPower}>
                POWER
            </div>
        );
    }
}*/

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        displayText: ''
        //power: false
      };

      this.displayClipName = this.displayClipName.bind(this);
      this.turnOnOff = this.turnOnOff.bind(this);
    }

    displayClipName(name) {
        this.setState({
            displayText: name
        });
    }

    
    turnOnOff() {
        console.log(this.props.powerStatus);
        if (!this.props.powerStatus) {
            this.props.powerOn();
            this.setState({
                displayText: 'On'
                //power: true
            });
        } else {
            this.props.powerOff();
            this.setState({
                displayText: 'Off'
                //power: false
            });
        }
    }

    render() {
      const drumPads = drumBank.map((currentDict, i, array) => {
        return <Drum 
            key = {array[i]['keyCode']}
            className = "drum-pad"
            id = {array[i]['id']}
            audioLink = {array[i]['url']}
            keyTrigger = {array[i]['keyTrigger']}
            keyCode = {array[i]['keyCode']}
            updateDisplay = {this.displayClipName}
            powerOnOff = {this.props.powerStatus}
        />;
      });
      
      return(
        <div id="drum-machine">
            <div id="main">
                <div id="display">{this.state.displayText}</div>
                { drumPads }
            </div>
            <div id="menu">
                <div id="power" onClick={this.turnOnOff}>
                    POWER
                </div>
                {/*<PowerButton powerOnOff = {this.props.powerStatus} />*/}
            </div>
        </div>
      );
    }
    
}

// Connect Redux and React

const mapStateToProps = (state) => {
    return {
        powerStatus: state.power
    };
}

const mapDispatchToProps = (dispatch) => {
    return {
        powerOn: () => dispatch(powerOn()),
        powerOff: () => dispatch(powerOff())
    };
}

//store.dispatch(powerOn());
//store.dispatch(powerOff());

const Container = connect(mapStateToProps, mapDispatchToProps)(App);
//const PowerButton2 = connect(mapStateToProps, mapDispatchToProps)(PowerButton);

// Render application
ReactDOM.render(
    <Provider store={store}>
        <Container />
    </Provider>, 
    document.getElementById('root')
);