/** @jsx React.DOM */

var React = require('react/addons');
require('bootstrap');
var logo  = './images/Swirl_LtBG_50x50.png';

var Header = React.createClass({
	toggle: function(){
		alert("test test test");
	},
	
	toggle2: function(){
		alert("toggle 2");
	},
	
	toggle3: function(){
		alert("toggle 3");
	},
	
    render: function () {
    	var user = "J Smith";
    	var time = "13:15 EST";
    	return (
    		<nav className="navbar navbar-default navbar-inverse app-toolbar no-rounded-corners navbar-fixed-top" role="navigation">
    			<div className="container-fluid">    			    
    			    <div className="navbar-header">
	    			    <ul className="nav navbar-nav">
				        	<li>
						        <a className="nav-bar-button" data-toggle="dropdown" href="#">
				        			<i className="fa fa-navicon fa-2x" />
				        		</a>
				                <ul className="dropdown-menu" role="menu">
				                    <li><a href="#"><i className="fa fa-th"></i> App Library</a></li>
				                    <li><a href="#"><i className="fa fa-wrench"></i> App Builder</a></li>
				                </ul>
				        	</li>
				        	<li>
						        <a className="nav-bar-button" href="#" onClick={this.toggle2}>
				    				<i className="fa fa-shopping-cart fa-2x" />
				    			</a>
				        	</li>
				        	<li className="active">
						        <a id="ozp-logo" href="#" onClick={this.toggle3}>
					    			<img src={logo} />
					    		</a>
				        	</li>
				        	<li>
						        <a className="nav-bar-button" href="#" onClick={this.toggle2}>
		    		    			<i className="fa fa-star fa-2x" />
		    		    		</a>
				        	</li>
				        </ul>
    			    </div>
    			    
    			    <div id="user-menu" className="dropdown navbar-right">
	    			    <ul className="nav navbar-nav">
				        	<li>
						        <a className="nav-bar-button" data-toggle="dropdown" href="#">
				        			<i className="fa fa-wrench fa-2x" />
				        		</a>
				        	</li>
				        	<li>
						        <a className="nav-bar-button" href="#">
				    				<i className="fa fa-bell fa-2x" />
				    			</a>
				        	</li>
				        	<li>
						        <a className="nav-bar-button" href="#">
				    				<b>{time}</b>
				    			</a>
				        	</li>
				        	<li>
						        <a className="nav-bar-button" data-toggle="dropdown" href="#">
						        	<i className="fa fa-user fa-2x" /><b>{" " + user}</b>
				    			</a>
				    			<ul className="dropdown-menu" role="menu">
				                    <li><a href="#"><i className="fa fa-cogs"></i> Preferences and Settings</a></li>
				                    <li><a href="#"><i className="fa fa-sign-out"></i> Log Out</a></li>
				                </ul>
				        	</li>
				        	<li>
						        <a className="nav-bar-button" href="#" onClick={this.toggle2}>
		    		    			<i className="fa fa-question fa-2x" />
		    		    		</a>
				        	</li>
				        </ul>
	                </div>
    			  </div>
    			</nav>
        );
    }

});

//<a className="navbar-brand" href="#"><i className="fa fa-list"></i></a>

module.exports = Header;