import React from 'react';
import Loadable from 'react-loadable';
import './loadable.css'

//通用的过场组件
const loadingComponent =()=>{
    return (
        <div className="loading-wrapper">
            <div className="loadingio-spinner-wedges-sddaz9d51yq"><div className="ldio-i0euq82ryyp">
            <div><div><div></div></div><div><div></div></div><div><div></div></div><div><div></div></div></div>
            </div></div>
        </div>
    ) 
}

//过场组件默认采用通用的，若传入了loading，则采用传入的过场组件
export default (loader,loading = loadingComponent)=>{
    return Loadable({
        loader,
        loading
    });
}

