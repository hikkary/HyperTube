import React from 'react'
import './style/header.sass'

export default class Header extends React.Component {

	render(){
		return(
    <div>
      <div className="Header">
        <input type="text" className="Search" placeholder="Search..."></input>
			</div>
      <div className="SubMenu"/>
    </div>
		);
	}
}
