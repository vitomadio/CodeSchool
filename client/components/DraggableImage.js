import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';

class App extends React.Component {

  constructor(props){
    super(props)
  }

  eventLogger = (e, data) => {
    console.log('Event: ', e);
    console.log('Data: ', data);
  };



  render() {
    const {tmpPath} = this.props
    return (
      <Draggable
        axis="both"
        
        handle=".handle"
        defaultPosition={{x: 0, y: 0}}
        position={null}
        grid={[5, 5]}
        scale={1}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}>
        <div
          id="feature"
          style={{...styles.container,background:'url("https://via.placeholder.com/300x225")no-repeat center'}}
          >
          <img className="handle" src={tmpPath ? tmpPath : null} alt="" style={styles.img}/>
        </div>
      </Draggable>
    );
  }
}

const styles = {
  container:{
    position:'absolute',
    minWidth:300,
    minHeight:225,
    objectFit:'cover',
    top:1,
    left:1,
    zIndex:-1
  },
  img: {
    maxWidth:400,
  }
}

export default App;
