/*This is the lesson list item wrappr in upload courses*/
import React, { Component } from 'react';
import {MdReorder } from 'react-icons/md';
import {IoIosTrash, IoIosSync} from 'react-icons/io';

class ListStripe extends Component {

    constructor(props) {
        super(props);

        this.state = {
            color:'#aaa'
        }
    }

    hoverTrash = (value, e) => {
        this.setState(prevState => {
            return {
                ...prevState,
                color: value
            }
        })
    }

    render() {

        return (
            <div 
            style={styles.listWrapper}
            className="py-1 pr-2"
            >
           
            <div 
            id={this.props.id}
            className="row align-items-center ml-1"
            style={{...styles.container,backgroundColor:this.props.bgColor}}
            draggable="true"
            onDragStart={this.props.dragStart}
            >
            	<div className="col-md-1">
            	<MdReorder size={30} color={this.props.txtColor} style={{cursor:'grab'}}/>
            	</div>            	
            	<div className="col-md-7">
                	<p 
                	className="mb-0 ml-1"
                	style={{color:this.props.txtColor}}
                	>
                	{this.props.text}
                	</p>
                	<input 
        				className="form-control"
        				placeholder="Add a title for the video"
        				type="text"
        				onChange={this.props.onChange}
                        value={this.props.title}
        			/>
            	</div>
            	<div className="col-md-4">
	            	<div className="row justify-content-end no-gutters align-items-center">
	            		<div className="col-md-6 mr-2">
                        {this.props.loader ? 
                            <div className="d-flex flex-row">
                            <style>
                                {
                                    `
                                        #loader{
                                            -webkit-animation:spin 4s linear infinite;
                                            -moz-animation:spin 4s linear infinite;
                                            animation:spin 4s linear infinite;
                                        }

                                        @-moz-keyframes spin { 100% { -moz-transform: rotate(360deg); } }
                                        @-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }
                                        @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }
                                    `
                                }
                            </style>
                            <p className="text-secondary flex-1 mb-0 mr-2 d-inline">
                            Saving...
                            </p>
                            <IoIosSync color="#666" size={25} className="felx-1 d-inline" id="loader"/>
                            </div>
                            :
    						<button 
                            style={{background:this.props.btnBgColor,color:this.props.btnTxtColor}}
    						className="btn"
    						onClick={this.props.onUpload}
    						>
    						{this.props.btnText}
    						</button>
                        }
	            		</div>
                        <div className="col-md-auto">
                        <IoIosTrash 
                        className="trash"
                        onMouseOver={this.hoverTrash.bind(this, '#ccc')}
                        onMouseLeave={this.hoverTrash.bind(this, '#aaa')}
                        style={{cursor:'pointer'}}
                        color={this.state.color}
                        size={30}
                        onClick={this.props.onClick}
                        />
                        </div>
	            	</div>
            	</div>
            </div>
        	</div>
        );
    }
}

const styles = {
	container:{
		width:'100%',
		height: 'auto',
		padding:5,
		boxShadow:'0px 2px 12px #888'
	},
	listWrapper:{
		border: '3px dashed #888'
	}
}

export default ListStripe;
