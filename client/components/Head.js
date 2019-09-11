import Head from 'next/head'
import 'react-image-crop/dist/ReactCrop.css';


export default () => (
    <div>
    <Head>
      <title>Code School</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <link rel="shorcut icon" href="/static/images/logo.png" type="image/icon" />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" 
      integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossOrigin="anonymous"/>
      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" 
      integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossOrigin="anonymous" />
      <link rel="stylesheet" href="/static/ReactCrop.css"/>
    </Head>
    <style jsx global>{`
      html, body, div#__next{
        height: 100%;
      }
      body{
        font-family:'Open Sans','Helvetica Neue',Helvetica,Arial,sans-serif !important;
      }
  		.form-control:focus{
  		    border-color: #cccccc !important;
  		    -webkit-box-shadow: none !important;
  		    box-shadow: none !important;
  		    background:#fff
  		}
  		a, .btn-link  {
  			color: #008489 !important;
        text-decoration: none !important;
  		}
      .btn-info{
        background:blue !important;
      }
      .btn-primary{
        background: #19B079 !important;
        border-color: #19B079 !important;
      }
      .btn-primary:hover{
        background: #148C60 !important;
        border-color: #148C60 !important;
      }
      .btn, .custom-file-inpu, input, label, select, textarea, select-items{
        border-radius: 0px !important;
      }
      .btn-danger{
        background:#148C60 !important;
        border:#148C60 !important;
      }
     
      a.btn-outline-light:hover{
        background:rgba(255,255,255,0.3)
      }
    `}</style>
  
    </div>
);

