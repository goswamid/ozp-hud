/**
 * @jsx React.DOM
 */
'use strict';

var React = require('react');
var Immutable = require('immutable');
var Link = require('react-router').Link;
var Constants = require('../../Constants');
var DragAndDropUtils = require('../../util/DragAndDrop');

var LibraryActions = require('../../actions/Library');

var FolderTitle = require('../folder/FolderTitle.jsx');

var FolderTile = React.createClass({

    getInitialState: function() {
        return {
            dropHighlight: false,
            editingTitle: false
        };
    },

    onDragStart: function(evt) {
        var folder = this.props.folder;

        DragAndDropUtils.startDrag(folder, folder.name, Constants.folderDataType,
                this.refs.folderView.getDOMNode(), evt);
    },

    onDragOver: function(evt) {
        var allowDrop =
            DragAndDropUtils.dragOver(Immutable.List.of(Constants.libraryEntryDataType), evt);

        if (allowDrop) {
            this.setState({dropHighlight: true});
        }
    },

    onDragLeave: function() {
        this.setState({dropHighlight: false});
    },

    onDrop: function(evt) {
        var dropInfo = DragAndDropUtils.getDropInfo(evt),
            data = dropInfo.data,
            droppedEntry = this.props.store.getModelByData(data);
            
        LibraryActions.addToFolder(this.props.folder, droppedEntry);
        this.onDragLeave();

        evt.preventDefault();
    },

    render: function() {
        var folder = this.props.folder,
            classes = React.addons.classSet({
                FolderTile: true,
                'drag-hover': this.state.dropHighlight
            }),
            entryIcons = folder.entries.map(function(entry) {
                var src = entry.listing.imageMediumUrl;

                return <img key={entry.listing.id} src={src} draggable="false" />;
            }),

            //react-router doesn't handle special characters correctly so we must escape them ourselves
            nameParam = encodeURIComponent(folder.name);

        return (
            <div className={classes} data-folder-name={folder.name}
                    onDragOver={this.onDragOver} onDragEnter={this.onDragOver}
                    onDragLeave={this.onDragLeave} onDrop={this.onDrop}
                    draggable="true" onDragStart={this.onDragStart}>
                <Link ref="folderView" className="FolderTile__folderView" to="folder"
                        params={{name: nameParam}} draggable="false">
                    {entryIcons.toArray()}
                </Link>
                <FolderTitle name={folder.name} element={React.DOM.h5}/>
            </div>
        );
    }
});

module.exports = FolderTile;
