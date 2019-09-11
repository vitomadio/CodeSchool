/*This component wraps cropped image*/

import React, { Component } from 'react';
import dynamic from 'next/dynamic'
const ReactCrop = dynamic(import('react-image-crop'));


class ImageCrop extends Component {

    constructor(props) {
        super(props);
    }

    render() {
		const {crop, tmpPath, onChangeCropHandler} = this.props;

        return (
        	<div style={styles.container} className="flex-grow-1">
            <ReactCrop 
            className="text-center"
            src={tmpPath} 
            crop={crop}
            onChange={onChangeCropHandler}
            onComplete={this.props.onComplete}
            />
            <canvas ref={this.props.canvasRef} style={{width:'100%', display:'none'}} ></canvas>
            
        	</div>
        );
    }
}

const styles = {
	container:{
		background:'transparent',
        border:'3px dashed #bbb',
        borderRadius:4,
        padding:5,
        maxWidth: '100%'
	}
}

export default ImageCrop;
