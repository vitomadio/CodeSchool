import React, { Component } from 'react';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import Head from '../components/Head';
import NavbarCourse from '../components/NavbarCourse';
import Page from '../components/page';
import ButtonSelectLesson from '../components/ButtonSelectLesson';
import { IoIosArrowDropleft, IoIosArrowDropright } from 'react-icons/io';
import { getCourse, playVideo } from '../store/actions';
import config from '../env_config';

class page extends Component {

  constructor(props) {
    super(props);

    this.state = {
      width: "22%",
      workArea: "78%",
      videos: [],
      title: "",
      selectedVideo: "",
      currentVideo: "",
      btnsOut: false,
      videoTop: "0%",
      videoWidth: "100%",
      videoLeft: "0%",
      chunk: config.api === "http://localhost:3231" ? 21 : 37
    }
  }

  componentDidMount() {
    const { chunk } = this.state;
    const courseId = this.props.router.query.id;
    if (!this.props.currentCourse) {
      return this.props.getCourse(courseId)
        .then(() => {
          this.setState({
            title: this.props.currentCourse.title,
            videos: this.props.currentCourse.videos,
            selectedVideo: config.api + "course/video?path=public/" + this.props.currentCourse.videos[0].videoUrl.slice(chunk),
            currentVideo: this.props.currentCourse.videos[0].title
          });
        })
        .catch(err => console.log(err))
    }
    this.setState({
      title: this.props.currentCourse.title,
      videos: this.props.currentCourse.videos,
      selectedVideo: config.api + "course/video?path=public/" + this.props.currentCourse.videos[0].videoUrl.slice(chunk),
      currentVideo: this.props.currentCourse.videos[0].title
    });
  }
  //FETCH SELECTED VIDEO.
  onSelectLessonHandler = (lesson) => {
    const { chunk } = this.state;
    this.setState({
      selectedVideo: config.api + "course/video?path=public/" + lesson.videoUrl.slice(chunk),
      currentVideo: lesson.title
    })
  }
  //OPEN AND CLOSE SIDEBAR.
  onToggleSidebarHandler = (key, e) => {
    if (key === "3%") {
      this.setState({
        width: key,
        workArea: '97%',
        videoTop: 0,
        videoWidth: '100%',
        videoLeft: '0%',
      })
      setTimeout(() => {
        this.setState({ btnsOut: true });
      }, 700)
    } else {
      this.setState({
        width: key,
        workArea: '78%',
        videoTop: '0%',
        videoWidth: '100%',
        videoLeft: '0%',
      })
      setTimeout(() => {
        this.setState({ btnsOut: false });
      }, 500)
    }

  }

  render() {

    const {
      title,
      videos,
      width,
      selectedVideo,
      btnsOut,
      workArea,
      videoTop,
      currentVideo,
      videoWidth,
      videoLeft } = this.state;
    const lessons = this.state.videos.map((lesson, i) => {
      return (
        <li key={i} className="list-group-item bg-transparent border-0">
          <ButtonSelectLesson
            bgColor="#eee"
            text={lesson.title.length > 25 ? lesson.title.substr(0, 25) + '...' : lesson.title}
            icon={[<p className="mx-2 mt-1 d-inline" style={{ color: '#19B079' }} key={i}>{i++}.</p>]}
            txtColor="#666"
            textStyle={{ fontSize: 20 }}
            overlay={true}
            onClick={this.onSelectLessonHandler.bind(this, lesson)}
          />
        </li>
      )
    });

    return (
      <div className="container-fluid p-0 course-wrapper">
        <Head />
        <style>
          {
            `
                    .course-wrapper{
                        overflow:hidden;
                        height:100%;
                        background:#ddd;
                    }
                    .close-sidebar{
                        width:22% !important;
                        height:100vh;
                        background: #eee;
                        border-right:2px solid #ccc;
                        position:relative;
                        -webkit-transition: width 2s;
                        transition: width 2s;
                    }
                    .close-sidebar{
                        width:${width} !important;
                    }
                    #icon-close{
                        position:absolute;
                        bottom:4.25em;
                        right:4px;
                        z-index: 1000;
                    }
                    .open-work-area{
                        background:#ddd;
                        width:78% !important;
                        max-height: 94vh;
                        position:relative;
                        -webkit-transition: width 2s;
                        transition: width 2s;
                    }
                    .open-work-area{
                        width:${workArea} !important;
                    }
                    #videoPlayer{
                        position:absolute;
                        left:${videoLeft};
                        top:5%;
                        width:${videoWidth};
                        -webkit-transition: top 2s, width: 2s, left: 2s;
                        transition: top 2s, width 2s, left 2s;
                    }
                    #videoPlayer{
                        top:${videoTop};
                        width:${videoWidth};
                        left:${videoLeft};
                    }
                    
                    @media (min-width:768px) {
                        .current-video{
                            display:none;
                        }
                        .buttons-list{
                            border-bottom:0px !important;
                            max-height: 85%;
                        }
                    }
                    @media (max-width:767px) {
                        .course-wrapper{
                            overflow:auto;
                        }
                        .open-work-area{
                            width:100% !important;
                        }
                        .close-sidebar{
                            width:100% !important;
                            border-bottom:0px solid #ccc;
                            position:relative;
                            height:auto;
                        }
                        #icon-close{
                            display:none;
                        }
                        #videoPlayer{
                            position:absolute;
                            left:0px;
                            top:0;
                            width:100%;
                        }
                    }

                    `
          }
        </style>
        <div className="row no-gutters">
          <div className="col-md-12">
            <NavbarCourse
              courseTitle={title}
              currentVideo={currentVideo}
            />
            <div className="row no-gutters">
              <div className="close-sidebar" >
                {!btnsOut &&
                  <IoIosArrowDropleft
                    id="icon-close"
                    color="#19B079"
                    size={30}
                    onClick={this.onToggleSidebarHandler.bind(this, "3%")}
                  />
                  ||
                  <IoIosArrowDropright
                    id="icon-close"
                    color="#19B079"
                    size={30}
                    onClick={this.onToggleSidebarHandler.bind(this, "22%")}
                  />
                }
                {!btnsOut &&
                  <ul
                    className="list-group bg-transparent py-3 px-1 buttons-list"
                    style={styles.ul}
                  >
                    {lessons}
                  </ul>
                }
              </div>

              <div className="open-work-area">
                <h4 className="text-center mt-2 text-secondary current-video d-md-none">{currentVideo}</h4>
                {selectedVideo &&
                  <video
                    id="videoPlayer"
                    controls
              
                    src={selectedVideo} type="video/mp4"
                  >

                  </video>
                }
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }
}

const styles = {
  navbar: {
    position: 'absolute',
    width: '100%',
  },
  ul: {
    overflowY: 'auto',
    borderBottom: '1px solid #ccc'
  }
}

const mapStateToProps = state => {
  return {
    currentCourse: state.course.currentCourse
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCourse: (courseId) => dispatch(getCourse(courseId)),
    playVideo: (videoPath) => dispatch(playVideo(videoPath))
  }
}

export default Page(connect(mapStateToProps, mapDispatchToProps)(withRouter(page)));
