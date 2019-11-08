import React from 'react';
import './Home.scss';
import Logo from '../../assets/LOGO.png';

const firstName = localStorage.getItem('firstname');

function Home() {
	return (
		<div id="home-container">
			<div id="home-header">
				<img id="header-logo" src={Logo} alt="Logo" />
				<h1 id="header-title">BitZone Dashboard</h1>
			</div>
			<div>
				<h2 id="home-greeting">Hello {firstName}!</h2>
			</div>
		</div>
	);
}


export default Home;
