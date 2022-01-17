var attr;
var cards = document.getElementsByClassName("card");
var ids = getCardIDs();
var tempcols = [];

displayCards("hidden");

// array helper, moving by index
function moveTo(array, old_index, new_index) {
    if (new_index >= array.length) {
        var k = new_index - array.length;
        while ((k--) + 1) {
            array.push(undefined);
        }
    }
    array.splice(new_index, 0, array.splice(old_index, 1)[0]);
    return array;
}

// array helper, sorting by subarray
function sortArray(index, arr) {
	arr.sort(function(a,b){return a[index] > b[index]});
}

// move cards with fixed position
function moveCards(fixes, ids) {
    for (var j = 0; j < fixes.length; j++) {
        if (fixes[j][1] <= ids.length) {
            ids = moveTo(ids, ids.indexOf(fixes[j][0]), fixes[j][1]-1);
	    }
    } return;
}

// get card id, position and sortorder
function getCardIDs() {
	var ids = [];
	var fixes = getFixedPositions();
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].id !== "") {
            ids.push(cards[i].id);
        } 
    }
    //sortArray(1, fixes);
    moveCards(fixes, ids);
    return ids;
}

// get fixed positions
function getFixedPositions() {
	var fixes = [];
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].getAttribute("fixedposition") !== "0" && cards[i].getAttribute("fixedposition") !== null) {
            fixes.push([cards[i].id, cards[i].getAttribute("fixedposition")]);
        } 
    }
    return fixes;
}

// switch visibility
function displayCards(attr) {
    for (var i = 0; i < cards.length; i++) {
        if (cards[i].id !== "") {
            document.getElementById(cards[i].id).style.visibility = attr;
        }
    }
    return;
}

// preparing array for tempcols
function setTempcols(cols) {
    for (i = 0; i < cols; i += 1) {
        tempcols.push([]);
    }
    return;
}

// push new order to tempcols
function pushOrder(cols, tempcols, i) {
    for (j = 0; j < cols; j += 1) {
        tempcols[j].push(ids[i+j]);
    }
    return;
}

// get the ids and doing new sorting
function getColumns(cols) {
    setTempcols(cols);
    for (i = 0; i < ids.length; i += 1) {
        if (i % cols === 0) {
            pushOrder(cols, tempcols, i);
        }
    }
    return tempcols;
}

// append cards with new sorting to columns
function appendCards(i, tempcols) {
    var chicken, egg;
    for (j = 0; j < tempcols[0].length; j+=1) {
        chicken = document.getElementById(''+tempcols[i][j]);
        egg = document.getElementById(''+tempcols[i][j+1]);
        if (egg !== null) {
            chicken.appendChild(egg);
        }
    } return;
}

// main function for building the new and sorted layout
function sortLayout(cols) {
    var tempcols = getColumns(cols);
    for (i = 0; i < tempcols.length; i+=1) {
        var parent = document.getElementById('column-'+i);
        var child = document.getElementById(''+tempcols[i][0]);
        if (child !== null) {
            parent.insertBefore(child, parent.firstChild);
        }
        appendCards(i, tempcols);
    }
}

// on (re)load
window.onload = function(e) { 
    breakpointChange();
    displayCards("visible");
    // hide spinner
    //var spinner = document.getElementById('spinner').style.display = "none";
}

// reload page after resizing, doing sorting again
window.addEventListener('resize', function () {
    var width = window.innerWidth;
    if (width > 768) {
        setTimeout(function(){
            window.location.reload(true);
            breakpointChange();
        });
    }
});

// check size and give sorting
function breakpointChange() {
    var width = window.innerWidth;
    if (width < 768) {
        sortLayout(1);
    }
    else if (width >= 768 && width < 992) {
        sortLayout(2);
    }
    else if (width >= 992 && width < 1200) {
        sortLayout(2);
    }
    else if (width >= 1200) {
        sortLayout(2);
    }
}

window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.getElementById("scrollup")) {
        if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
            document.getElementById("scrollup").style.display = "block";
            setTimeout(function () {
                document.getElementById("scrollup").style.display = ("none");
            }, 8000);
        } else {
            document.getElementById("scrollup").style.display = "none";
        }
    }
}

function topFunction() {
    var body = document.body,
    html = document.documentElement;

    var height = Math.max( body.scrollHeight, body.offsetHeight, 
                   html.clientHeight, html.scrollHeight, html.offsetHeight );

    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}