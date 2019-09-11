import React, { PropTypes } from 'react';

const Footer = (props) => {
    return (
        <div className="container-fluid" style={styles.container}>
            <style>
                {
                    `
                    .footer-logo{
                        max-width:120px;
                    }
                    @media (max-width:767px) {
                        p#copyrights{
                            font-size:11px !important;
                        }
                        .footer-logo{
                            max-width:90px;
                        }
                    }
                    `
                }
            </style>
        	<div className="row py-2 align-items-end justify-content-end justify-content-md-center">
        		<div className="col-4 col-md-5 text-right pr-0">
        		<img 

                src="/static/images/logo-footer.png" 
                alt="Code School" 
                className="float-md-right footer-logo" 
                style={styles.img}/>
        		</div>
        		<div className="col-8 col-md-7 mb-1" id="copyrights">
        		<p className="mb-0 text-secondary text-md-left" id="copyrights">© All Rights Reserved, Code School 2019.</p>
        		</div>
        	</div>
        </div>
    );
};

const styles = {
	container:{
		borderTop:'1px solid #bbb',
        zIndex: 999,
        background:'#eee',
        position:'absolute',
        bottom:0
	}
}

export default Footer;
