/* This comoponent wraps all pages and injects provider from react-redux */
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from '../store/storeConfig';

const store = configureStore()

const page = (Page) => {
    return (
    	class PageWrapper extends React.Component{

    		render(){
    			return(
		        <Provider store={store}>
                    <Page/>
		        </Provider>
		        )
    		}
    	}
    );
};


export default page;

