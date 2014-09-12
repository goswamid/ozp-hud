/** @jsx React.DOM */
var React = require('react');

var appsMallLogo  = './images/AppsMall_Icon.png';
var Folder = require('../folder');
var Sortable = require('../sortable/Sortable');

var dirtyLibrary = false;

var Library = React.createClass({
	
	clickImage: function(url){
		window.open(url);
	},

    getData: function(){
        var libraryData;

        if(dirtyLibrary){
            return;
        }
        $.ajax({
            type: "GET",
            dataType: "json",
            url: "http://localhost:8080/marketplace/api/profile/self/library",
            async: false,
            success: function(data) {
                libraryData = data;
            },
            failure: function(){
                console.log("MarketPlace REST call failed. Loading with no applications");
            }
        });
        this.setState({data: {items: libraryData}});

    },

    componentWillUnmount: function() {
        clearInterval(this.interval);
    },

	componentWillMount : function(){
        this.interval = setInterval(this.getData, 5000);
        this.getData();
	},
	sort: function(items, dragging) {
		var data = this.state.data;
		data.items = items;
		data.dragging = dragging;
		this.setState({data: data});
  	},
  	disconnect: function(app){
        var j;
        var i = this.state.data.items.indexOf(app);
		this.state.data.items.splice(i, 1);
		this.setState({data: {items: this.state.data.items}});
       
        $.ajax({
            type: "DELETE",
            dataType: "json",
            url: "http://localhost:8080/marketplace/api/profile/self/library/" + app.serviceItem.id,
            async: true,
            success: function(data) {
                console.log("MarketPlace REST successful. Application was deleted");
            },
            failure: function(){
                console.log("MarketPlace REST call failed. Application was not deleted");
            }
        });
	},
    folderRename: function(targetFolder, newName){
        dirtyLibrary = true;
        var data = this.state.data;
        data.items.forEach(function(app){

            if(app.folder === targetFolder){
                app.folder = newName;
            }
        });
    
        this.setState({data: data});

    },
    folderRenameOnBlur: function(){
        $.ajax({
            type: "PUT",
            contentType: "application/json",
            url: "http://localhost:8080/marketplace/api/profile/self/library/",
            data: JSON.stringify(this.state.data.items),
            async: true,
            success: function(data) {
                console.log("MarketPlace REST successful. Folder name was updated");
                dirtyLibrary = false;
            },
            failure: function(){
                console.log("MarketPlace REST call failed. Folder name was not updated");
            }
        });
    },
    render: function () {
        var foldersAndApps = [];
        this.state.data.items.map(function(app, i) {
            if(app.folder === null)
            {
                foldersAndApps.push(app);
            }
            else
            {
                var index = foldersAndApps.map(function(e){ return e.folder;}).indexOf(app.folder);
                if(index === -1)
                {
                    var tempFolder = {};
                    tempFolder.folder = app.folder;
                    tempFolder.items = [];
                    tempFolder.items.push(app);
                    foldersAndApps.push(tempFolder);
                }
                else
                {
                    foldersAndApps[index].items.push(app);
                }
            }
        }, this);

        if(this.state.data.items.length >= 1) {
            var data = this.state.data;
            var disconnect = this.disconnect;
            var sort = this.sort;
            var rename = {renameFolder: this.folderRename, renameOnBlur: this.folderRenameOnBlur};
            var applicationList = foldersAndApps.map(function(app, i){
                    return (
                        <AppBlock sort={sort} data={data} key={i} data-id={i} item={app} disconnect={disconnect} rename={rename}/>
                    );
            });
            return (
	            <div className="applib-main">
	            	<h3 className="applib"><b>Application Library</b></h3>
	            	<ul className="nav navbar-nav applib">
			            {applicationList}

					</ul>
	            </div>
	        );
    	}
    	else {
    		return (
    	            <div className="applib-main">
    	            	<h3 className="applib"><b>Application Library</b></h3>
    	            	<h1 className="empty-app-text">You currently have no <br />
    	            	Apps to display</h1>
    	            	<h2 className="visit-appsmall">Visit the AppsMall to discover <br />
    	            	Apps you can start using</h2>
    	            	<form method="get" action="./images/sampleSites/AppsMall.png">
    	            		<p className="visit-button-text"><button type="submit" className="empty-text-button"><img src={appsMallLogo} /> AppsMall</button></p>
    	            	</form>
    	            </div>
    	        );
    	}
    }

});

var AppBlock = React.createClass({
	mixins: [Sortable],
	clickImage: function(url){
		window.open(url);
	},
	render: function(){
    	var click = this.clickImage;
    	var app = this.props.item;
    	var disconnect = this.props.disconnect.bind(null,this.props.item);
    	var boxContent;
    	if(app.folder === null){
    		boxContent = (
    				<div>
	    				<i className="fa fa-ellipsis-h fa-2x tileIcon" data-toggle="dropdown"></i>
						<ul className="dropdown-menu tileIcon-dropdown" role="menu">
		                	<li onClick={disconnect}>Disconnect</li>
		                </ul>
						<img className="applib-tiles" src={app.serviceItem.imageLargeUrl} onClick={click.bind(null, app.serviceItem.launchUrl)}/>
						<h5 className="ozp-lib-name">{app.serviceItem.title}</h5>
					</div>
					);
    	}else{
    		boxContent = (
    				<Folder folder={app} disconnect={this.props.disconnect} rename={this.props.rename}/>
    			);
    	}

		return this.transferPropsTo(
				<li key={app.name} className={this.isDragging() ? "dragging" : ""} onDragStart={this.sortStart}
												onDragOver={this.dragOver}  onMouseUp={this.sortEnd} onDrop={this.sortEnd}>
					{boxContent}
    			</li>
			);
	}
});

module.exports = Library;