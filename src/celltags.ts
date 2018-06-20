import {
    ICellModel
  } from '@jupyterlab/cells';
}
function write_tag(cell: ICellModel, name:string, add:boolean) {
    /* If add = true, check if tags are undefined; if so, initialize the array.
       Otherwise, check if the tag already exists; if so, return false.
       Then add the tag to metadata.tags. */
    if (add) {
        // Add to metadata
        if (cell.metadata.tags === undefined) {
            var arr : string[] = [];
            cell.metadata.tags = arr;
        } else if (cell.metadata.tags.indexOf(name) !== -1) {
            // Tag already exists
            return false;
        }
        cell.metadata.tags.push(name);
    /* If add = false, try to remove from metadata. First check if metadata and 
       metadata.tags exist; if not, return false. Then remove the tag and remove
       metadata.tags if it is empty.*/
    } else {
        // Remove from metadata
        if (!cell.metadata || !cell.metadata.tags) {
            // No tags to remove
            return false;
        }
        // Remove tag from tags list
        var index = cell.metadata.tags.indexOf(name);
        if (index !== -1) {
            cell.metadata.tags.splice(index, 1);
        }
        // If tags list is empty, remove it
        if (cell.metadata.tags.length === 0) {
            delete cell.metadata.tags;
        }
    }
    cell.events.trigger('set_dirty.Notebook', {value: true});
    return true;
};

function preprocess_input(input:string) {
    // Split on whitespace + commas:
    return input.split(/[,\s]+/)
};

function add_tag(cell:ICellModel, tag_container:string, on_remove:Function) {
    /* Returns a function that writes tags to metadata if non-empty */
    return function(name:string) {
        if (name === '') {
            // Skip empty strings
            return;
        }
        // Write tag to metadata
        var changed = write_tag(cell, name, true);

        //Unused: tag UI
        /*if (changed) {
            // Make tag UI
            var tag = make_tag(name, on_remove);
            tag_container.append(tag);
            var tag_map = jQuery.data(tag_container, "tag_map") || {};
            tag_map[name] = tag;
            jQuery.data(tag_container, 'tag_map', tag_map);
        }*/
    };
};

function remove_tag(cell:ICellModel, tag_container:string) {
    return function(name:string) {
        var changed = write_tag(cell, name, false);
        /*if (changed) {
            // Unused: Remove tag UI
            var tag_map = jQuery.data(tag_container, "tag_map") || {};
            var tag_UI = tag_map[name];
            delete tag_map[name];
            tag_UI.remove();
    }*/
    };
};

function init_tag_container (cell:ICellModel, on_remove:Function) {
    var tag_list = cell.metadata.tags || [];
    if (!Array.isArray(tag_list)) {
        // We cannot make tags UI for this cell!
        // Maybe someone else used "tags" for something?
        return false;  // Fail gracefully
    }
    var tag_map = {};
    for (var i=0; i < tag_list.length; ++i) {
        var tag_name = tag_list[i];
        if (typeof tag_name !== 'string') {
            // Unexpected type, disable toolbar for safety
            return false;
        }
        /*var tag = make_tag(tag_name, on_remove);
        tag_map[tag_name] = tag;*/
    }
    //Unused: jQuery.data(tag_container, 'tag_map', tag_map);
    return true;
};

