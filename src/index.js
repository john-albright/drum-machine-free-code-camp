import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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

const activeStyle = {
    backgroundColor: 'blue'
};

const inactiveStyle = {
    backgroundColor: 'transparent'
};

class Drum extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentStyle: inactiveStyle
        }

        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.emitSound = this.emitSound.bind(this);
        this.activatePad = this.activatePad.bind(this);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress);
    }

    handleKeyPress(e) {
        if (e.keyCode === this.props.keyCode) {
            this.emitSound();
        }
    }

    activatePad() {
        if (this.state.currentStyle.backgroundColor !== 'blue') {
            this.setState({
                currentStyle: activeStyle
            });
        } else {
            this.setState({
                currentStyle: inactiveStyle
            });
        }
    }

    emitSound() {
        const sound = document.getElementById(this.props.keyTrigger);
        const url = sound.src;
        console.log(sound, url);

        sound.load(); 
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

    render() {
        return(
            <div
                className = "drum-pad"
                id = {this.props.id}
                onClick = {this.emitSound}
                style = {this.state.currentStyle}
                >
                <audio
                    className = "clip"
                    id = {this.props.keyTrigger}
                    src = {window.location.pathname + this.props.audioLink}
                />
                {this.props.keyTrigger}
            </div>
        );
    }
}

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        displayText: ''
      };

      this.displayClipName = this.displayClipName.bind(this);
    }

    displayClipName(name) {
        this.setState({
            displayText: name
        })
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
        />;
      });
      
      return(
        <div id="drum-machine">
          <div id="display">{this.state.displayText}</div>
          {drumPads}
        </div>
      );
    }
    
  }
  
  ReactDOM.render(<App />, document.getElementById('root'));