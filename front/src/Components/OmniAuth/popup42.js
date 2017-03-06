import React from 'react'
// import './style/header.sass'

export default class Header extends React.Component {

	render(){
		return(
    <div>
      <div className="Header">
        {/* <p className="logo">HYPERTUBE</p> */}
        <img className="logo" src="logo.gif" height="60px" width="300px"/>
        {/*  Quand le fichier est dans le public on a pas besoin de mettre le path*/}
        <input type="text" className="Search" placeholder="Search..."></input>
			</div>
      <div className="SubMenu"/>
    </div>
		);
	}
}
