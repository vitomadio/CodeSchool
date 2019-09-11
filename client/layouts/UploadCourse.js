import React, { Component } from 'react';
import Router from 'next/router'
import { withRouter } from 'next/router';
import Page from '../components/page';
import { connect } from 'react-redux';
import Head from '../components/Head';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ButtonInput from '../components/ButtonInput';
import Button from '../components/Button';
import DraggableImage from '../components/DraggableImage';
import ImageCrop from '../components/ImageCrop';
import ListStripe from '../components/ListStripe';
import { 
	uploadVideo, 
	uploadCourse, 
	getSessionUser, 
	getCategories, 
	uploadVideos,
	saveCourseChanges,
	removeUploadedVideo } from '../store/actions';
import { 
	base64StringtoFile,
	downloadBase64File, 
	extractImageFileExtensionFromBase64, 
	image64toCanvasRef } from '../utils/ReusableUtils';


class page extends Component {

	constructor(props) {
		super(props)


		this.imagePreviewCanvasRef = React.createRef();
	}

	componentWillMount(){
		this.reset();
	}

	componentDidMount(){
		const {currentCourse} = this.props.course
		this.props.getCategories();
		if(localStorage.getItem('token') !== null){
			if(!this.props.currentUser){
				this.props.getCurrentUser();

			}
		}else{
			Router.push('/')
		}
		if(currentCourse){
			const {title, category, subCategory, description, videos} = currentCourse;
			this.setState({
				title:title,
				category: category,
				subCategory:subCategory,
				description:description,
				videos:videos
			})
		}
	}

	reset = () => {
		this.setState({
			crop:{
				aspect:3/2,
				width:50
			},
			selectVideoDisable: true,
			canvas:null,
			category:null,
			subCategory:null,
			title:null,
			description:null,
			files: [],
			selectedFile: null,
			tmpPath: null,
			croppedPath: null,
			prevUrl: null,
			fileName:"",
			videoFiles:[],
			selectedVideoFiles: null,
			tmpVideoPath: null,
			lessonsList:[],
			videos:null,
			btnSaveChanges:false,
			message:null
		});
	}

	//Sets the image crop area
	onChangeCropHandler = (crop) => {
		this.setState({crop});
	}
	

	onCropCompleteHandler = (crop, pixelCrop) => {
		if(pixelCrop.height && pixelCrop.width >= 1){
			const canvasRef = this.imagePreviewCanvasRef.current
			const imgSrc = this.state.tmpPath
			image64toCanvasRef(canvasRef, imgSrc, pixelCrop)
		}
	}

	onCropImageHandler = (e) => {
		e.preventDefault()
		const canvasRef = this.imagePreviewCanvasRef.current

		this.getBase64(this.state.selectedFile) //This returns same fiel but in Base64 format.
		.then(data => {
			const fileExtension = extractImageFileExtensionFromBase64(data)
			const imageData64 = canvasRef.toDataURL('image/' + fileExtension)
			const myFilename = "previewFile." + fileExtension
			// file to be uploaded
			const myNewCroppedFile = base64StringtoFile(imageData64, myFilename)
			const path = URL.createObjectURL(myNewCroppedFile)
			
			this.setState(prevState => {
				return {
					...prevState,
					selectedFile: myNewCroppedFile,
					croppedPath: path,
					tmpPath: null
				}
			})
		})
	}

    // Change feature image to Base64 file...
	getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
		    reader.readAsDataURL(file);
		    reader.onload = () => resolve(reader.result);
		    reader.onerror = error => reject(error);
		})
	}
	
	//Select Image action.
	onSelectImageHandler = (files) => {
		const file = files[0]
		const path = URL.createObjectURL(file)
		const filesAccepted = [];

		filesAccepted.unshift({url:path})
		console.log(files[0])
		this.setState({
			files: filesAccepted,
			selectedFile: file,
			tmpPath: path,

		});
	}

	//Set description of the course to state.
	onChangeHandler = (key, e) => {
		this.setState({
				[key]:e.target.value
		});
	}

	//Select video
	onSelectVideoHandler = (files) => {
		
		const lessons = [];
		const filesAccepted = [];
		if(files){
			for(let file of files){
				lessons.push({fileName:file.name,title:""});
				filesAccepted.push(file.srcObject);
			}
		}
		const file = files[0]
		this.setState(prevState => {
			return{
				...prevState,
				videoFiles: filesAccepted,
				selectedVideoFiles: files,
				lessonsList: lessons
			}
		});
	}

	//Upload Video
	onUploadVideoHandler = (lesson,idx,e) => {
		const file = this.state.selectedVideoFiles[idx];
		const formData = new FormData();
		const body = {title:lesson.title,courseId:this.props.course.currentCourse._id};
		for (let key in body){
			formData.set(key,body[key])
		}
		formData.append('file', file);
		this.props.onUploadVideo(formData)
		.then(res => {
			this.setState(prevState => {
				return{
					...prevState,
					lessonsList:prevState.lessonsList.filter(item => item !== lesson)
				}
			});
		})
		.catch(err => console.log(err));
	}

	//Upload multiples videos
	onUploadMultipleVideosHandler = () => {
		const files = this.state.selectedVideoFiles;
		const courseId = this.props.course.currentCourse._id
		const titles = [];
		this.state.lessonsList.map(lesson => {
			titles.push(lesson.title)
		});
		const formData = new FormData();
		for (let file of files){
			formData.append('file', file)
		}
		formData.set('titles', JSON.stringify(titles));
		formData.set('courseId', courseId);
		this.props.uploadVideos(formData)
		.then(res => {
			this.setState({
				lessonsList:[]
			})
		})
		.catch(err => console.log(err));
	}

	//Change video title
	onChangeTitleHandler = (value, i) => {
		this.setState(prevState => {
			return {
				...prevState.lessonsList[i].title = value
			}
		});
	}

	//Edit video title
	onEditVideoTitleHandler = (value, i) => {
		this.setState(prevState => {
			return {
				...prevState.videos[i].title = value 

			}
		})
	}

	//Remove video from lessonsList
	onRemoveFileHandler = (fileName, e) => {
		this.setState(prevState => {
			return{
				...prevState,
				lessonsList: prevState.lessonsList.filter(lesson => lesson.fileName !== fileName)
			}
		});
	}

	//===================== Remove Video from database ====================
	onRemoveUploadedVideoHandler = (video, idx, e) => {
		e.preventDefault();
		const courseId = this.props.course.currentCourse._id;
		this.props.removeUploadedVideo(video.videoUrl, idx, courseId);
	}

	//=====================  UPLOAD COURSE HANDLER  =======================
	onUploadCourseHandler = () => {
		const { category, subCategory, title, description } = this.state;
		const body = {
			category:category, 
			subCategory:subCategory, 
			title:title, 
			description:description,
		}
		const file = this.state.selectedFile;
		const formData = new FormData();
		formData.append('file', file);
		for( let key in body){
			formData.append(key, body[key]);
		}

		this.setState({
			selectVideoDisable: false
		})
		
		this.props.onUploadCourse(formData)
	}

	//====================  DRAGGABLE NIGHTMARE PART BEGINS HERE  =======================
	dragStart(e){
		e.dataTransfer.setData("src", e.target.id);
	};

	allowDrop(e){
		e.preventDefault();
	};

	//On drop function after dropping an element on its position.
	onDropSwap(e){
		var old_idx = e.dataTransfer.getData("src");
		var new_idx = e.currentTarget.id
		var newArray = this.array_move(this.state.lessonsList, old_idx, new_idx)

		this.setState({tmpUrls: newArray})
	};

	//Same of above but for uploaded videos
	onDropVideo(e){
		const {videos} = this.props.course.currentCourse
		var old_idx = e.dataTransfer.getData("src");
		var new_idx = e.currentTarget.id
		var newArray = this.array_move(videos, old_idx, new_idx)
		
		this.setState({
			btnSaveChanges:true
		})
	};

	//Swapping array position after drop.
	array_move = (arr, old_index, new_index) => {
		if (new_index >= arr.length) {
			var k = new_index - arr.length + 1;
			while (k--) {
				arr.push(undefined);
			}
		}
		arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	    return arr; // for testing
	};
	//=========== END ===========================

	onAdaptImage = () => {
		this.dragElement(document.getElementById('feature'));
	}

	//================ Save changes done on course ================================
	onSaveChangesHandler = () => {
		const {videos, title, description, category, subCategory, selectedVideoFiles} = this.state;
		const prevUrl = this.props.course.currentCourse.featureUrl;
		const file = this.state.selectedFile;
		const courseId = this.props.course.currentCourse._id;
		const formData = new FormData();

		const body = {
			title:title,
			category:category,
			subCategory:subCategory,
			description:description,
			courseId: courseId,
			videos: JSON.stringify(videos),
			prevUrl: prevUrl
		}

		formData.append('file', file);
		for(let key in body){
			formData.set(key, body[key])
		}
		this.props.onSaveChanges(formData);
	}

	// Disable essage from Create Course button.
	disabledMessage = () => {
		this.setState({message:"Please fill in all the fields before continue."});
		setTimeout(() => {
			this.setState({message:null});
		},2500)
	}

	//Render Function
	render(){
	const { categories, currentCourse } = this.props.course
	const { 
	 	title,
	 	description, 
	 	category,
	 	subCategory,
	 	selectedFile,
		tmpPath,
	 	selectedVideoFiles, 
	 	lessonsList, 
	 	croppedPath,
	 	selectVideoDisable,
	 	 } = this.state;
	const featureImg = <input type="file" className="custom-file-input" />
	let lessons = [];
	let uploadedVideos = null;
	
	if(selectedVideoFiles){
		/*List of videos to upload*/
		lessons = lessonsList.map((lesson, i) => {
			return (
				<li 
				key={i}
				id={i}
				className="list-group-item border-0 p-0 mb-2"
				onDrop={this.onDropSwap.bind(this)} 
				onDragOver={this.allowDrop.bind(this)} 
				draggable="false"
				>
				<ListStripe
				title={lesson.title}
				dragStart={(e) => this.dragStart(e)}
				id={i}
				bgColor="#eee"
				txtColor="#888"
				text={lesson.fileName}
				btnTxtColor="#fff"
				btnText="Upload"
				btnBgColor="#19B079"
				onChange={(e) => this.onChangeTitleHandler(e.target.value, i)}
				onClick={this.onRemoveFileHandler.bind(this, i)}
				onUpload={this.onUploadVideoHandler.bind(this, lesson, i)}
				loader={this.props.loader}
				/>
				</li>
				)
		})
	}
	/*List of videos already uploaded*/
	if(currentCourse && currentCourse.videos.length >= 1 ){
		uploadedVideos = currentCourse.videos.map((video, i) => {
			return (
				<li 
				style={{background:'transparent',border:0}}
				key={i}
				id={i}
				className="list-group-item border-0"
				onDrop={this.onDropVideo.bind(this)} 
				onDragOver={this.allowDrop.bind(this)} 
				draggable="false"
				>
				<div>{video.videoUrl.split('.')[0].split('/')[4]}</div>
				<ListStripe
				dragStart={(e) => this.dragStart(e)}
				id={i}
				bgColor="transparent"
				txtColor="#777"
				btnText=""
				title={video.title}
				btnBgColor="transparent"
				onChange={(e) => this.onEditVideoTitleHandler(e.target.value, i)}
				onClick={this.onRemoveUploadedVideoHandler.bind(this, video, i)}
				/>
				</li>
				)
		})
	}

	const categoryList = categories.map((categoryItem,i) => {
		return (
			<option key={i} value={categoryItem.name}>{categoryItem.name}</option>
			)
	});

	const selectedCategory = categories.find(element => {
		if(category !== ""){
			return element.name === category
		}
		return null
	})

	const subCategories = selectedCategory ? selectedCategory.subCategories.map((item,i) => {
		return (
			<option key={i} value={item} className="rounded-0">{item}</option>
			)
	}) : null

	return (
		<div className="container-fluid">
			<div className="row">
			<div className="col-md-12 col-lg-10 mt-4">
				<h2 className="text-center text-secondary">
				{!currentCourse ? 
					'Upload New Course.' : 'Edit Course'
				}
				</h2>
				<div className="row  justify-content-around mt-3">
				<div className="col-md-6 ">
					<div className="form-group">
						<label htmlFor="title" className="ml-1 text-secondary">Title</label>
						<input 
						type="text" 
						className="form-control mb-2" 
						onChange={this.onChangeHandler.bind(this, 'title')}
						placeholder="Insert a very descriptive title"
						value={title}
						/>
					</div>
					<div className="form-row">
						<div className="col from-group">
							<label htmlFor="category" className="ml-1 text-secondary">Category</label>
							<select 
							type="text" 
							className="custom-select mb-3"
							onChange={this.onChangeHandler.bind(this, 'category')}
							value={category}
							>
							<option className="rounded-0">Select Category...</option>
							{categoryList}
							</select>
						</div>
						<div className="col from-group">
							<label htmlFor="subCategory" className="ml-1 text-secondary">Sub Category</label>
							<select 
							type="text" 
							className="custom-select mb-3" 
							onChange={this.onChangeHandler.bind(this, 'subCategory')}
							value={subCategory}
							>
							<option>Select Sub-Category...</option>
							{subCategories}
							</select>
						</div>
					</div>
					<div className="form-group">
					<label htmlFor="description" className="ml-1 text-secondary">Course Description:</label>
					<textarea 
					placeholder="Add a description about the course."
					rows="8"
					style={{resize:'none'}}
					className="form-control"
					onChange={this.onChangeHandler.bind(this, 'description')}
					value={description}
					/>
					</div>
				</div>

				<div className="col-sm-6 col-md-6 d-flex flex-column justify-contetn-end pb-3">
					<div className="flex-shrink"><h4 className="text-secondary font-weight-light">Feature Image</h4></div>
					<ButtonInput
					bgColor="#4B5771"
					txtColor="#fff"
					text="Select Image"
					onChange={(e) => this.onSelectImageHandler(e.target.files)}
					/>
					{currentCourse && !tmpPath && !croppedPath ? 
		            <div className="flex-grow-1" style={styles.inputImg}><img src={currentCourse.featureUrl} alt="" style={{width:'100%'}}/></div> 
					: tmpPath ? 
		            <div className="flex-grow-1">
						<div>
							<ImageCrop 
							tmpPath={tmpPath} 
							crop={this.state.crop} 
							onComplete={this.onCropCompleteHandler}
							onLoadedImage={this.onLoadedImageHandler}
							onChangeCropHandler={this.onChangeCropHandler}
							canvasRef={this.imagePreviewCanvasRef}
							/>
						</div>
						<div className="text-center mt-2">
							<button 
				            className="btn btn-primary"
				            onClick={this.onCropImageHandler}
				            >
				            Crop Image
				            </button>
			            </div>
		            </div> 
		            : croppedPath ?
		            <div className="flex-grow-1" style={styles.inputImg}><img src={croppedPath} alt="" style={{width:'100%'}}/></div>
		            :
		            <div className="flex-grow-1" style={styles.inputImg}>
		            </div> }
				</div>
				</div>
				{!selectVideoDisable || currentCourse ? 
				<div>
					<hr/>
					<div className="row justify-content-around align-items-end">
						<div className="col-12 col-md-3">
						<ButtonInput
						bgColor="#4B5771"
						txtColor="#fff"
						text="Select Videos"
						onChange={(e) => this.onSelectVideoHandler(e.target.files)}
						/>
						{lessonsList.length >= 1 ? 
						<Button
						bgColor="#19B079"
						txtColor="#fff"
						text="Upload Videos"
						onClick={this.onUploadMultipleVideosHandler}
						/>
						: null}
						</div>
						{!lessons && 
							<div 
							className="col-12 col-md-8"
							style={{height:'4em', border:'3px dashed #bbb',borderRadius:3}}
							>
							</div>
						}
						{lessons &&
						<div className="col-12 col-md-8">
						<p className="text-secondary">Note: Drag and drop between videos to change the order.</p> 
						<ul className="list-group">
						{lessons}
					
						</ul>
						</div>}
					</div>
				</div>	
				: null }
				<div>
				<hr/>
				{ !currentCourse ? 
					<div className="row justify-content-center mt-3">
						<div className="col-3 text-center">
							{title && category && description && subCategory && selectedFile ?
							<Button
							bgColor="#19B079"
							txtColor="#fff"
							text="Create Course"
							onClick={this.onUploadCourseHandler}
							/>
							: 
							<Button
								bgColor="#5EC7A1"
								txtColor="#fff"
								text="Create Course" 
								onClick={this.disabledMessage}
								/>
							}
							<p className="text-secondary mt-3">{this.state.message}</p>
						</div>
					</div>
					: 
					<h3 className="text-secondary ml-5">Course videos</h3>
				}
				{currentCourse && currentCourse.videos &&
					<div className="row align-items-end">
						<div className="col-12 col-md-8">
						<ul className="list-group mt-3">
						{uploadedVideos}
						</ul>
						</div>
						<div className="col-12 col-md-4 mb-3">
						<p className="text-secondary">{this.props.message}</p>
						<Button
						bgColor="#19B079"
						txtColor="#fff"
						text="Save changes"
						onClick={this.onSaveChangesHandler}
						/>
						</div>
					</div>
				}
				</div>
			</div>
			</div>
		</div>	
		
		);
	}
}

const styles = {
	inputImg:{
		background:'transparent',
		border:'3px dashed #bbb',
		borderRadius:4,
		padding:5,
		maxWidth: '100%'
	},
	input:{
		width:'50%',
		position:'absolute',
		zIndex: 999,
		left:0
	},
	buttonUpload:{
		width:'50%',
		fontSize:'1.3em',
		padding:'.2em'
	},
	imgParagraph: {
		fontSize: 11
	}
}

const mapStateToProps = state => {
	return {
		course:state.course,
		currentUser: state.user.currentUser,
		loader: state.ui.loaderSpinner,
		message: state.ui.alertMessage
	};
};

const mapDispatchToProps = dispatch => {
	return {
		getCurrentUser: () => dispatch(getSessionUser()),
		getCategories: () => dispatch(getCategories()),
		onUploadVideo: (formData) => dispatch(uploadVideo(formData)),
		onUploadCourse: (formData) => dispatch(uploadCourse(formData)),
		onSaveChanges: (formData) => dispatch(saveCourseChanges(formData)),
		removeUploadedVideo: (videoUrl, idx, courseId) => dispatch(removeUploadedVideo(videoUrl, idx, courseId)),
		uploadVideos: (formData) => dispatch(uploadVideos(formData)) 

	};
};

export default Page(connect(mapStateToProps, mapDispatchToProps)(page));
