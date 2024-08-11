var routeURL = null;
var x = document.getElementById("destination");
var y = document.getElementById("temporaryNext");
var changeButtonDiv = document.getElementById("change-image-div");
var changeButtonBtn = document.getElementById("change-image-btn");
var dir = document.getElementById("direct");
var directionsImage = document.getElementById("imageDiv");
var directionsError = document.getElementById("error");
var directionsTextClass = document.querySelector('.path');
var lineText1 = document.querySelector('.line4');
var image = "images/RedTree.jpg";
var image1 = "images/Synthwave.webp";
var image2 = "images/DarkDisco.gif";
var image3 = "images/CyberpunkCity.webp";
var imageArray = new Array(40);
var counter = 0;
var max = 0;
var notInErrorScreen = true;
var selectElement = document.querySelector("#choose-location1");
var selectElement1 = document.querySelector("#choose-location2");
var inStartingScreen = true;
var selectedADA = false;
var selectedWalkable = true;
var imageLarge = true;
var width = 100;
var height = 1000;

optionWalkable();
openFullScreenHandler("imageDiv", "fullscreen-div");

function optionADA(){
    selectedADA = true;
    selectedWalkable = false;
    document.querySelector('.walking-btn').classList.remove('show');
    document.querySelector('.handicap-btn').classList.add('show');
}

function optionWalkable(){
    selectedADA = false;
    selectedWalkable = true;
    document.querySelector('.handicap-btn').classList.remove('show');
    document.querySelector('.walking-btn').classList.add('show');
}

function useDirectionButton(){
    counter = 0;
    for(var i = 1; i <= max; i++){
        document.getElementById("textline" + (i)).innerHTML = null;
    }
    dir.innerHTML = "ROUTE:";
    const startingPoint = selectElement.options[selectElement.selectedIndex].value;
    const destination = selectElement1.options[selectElement1.selectedIndex].value;
    /*
    * Starting image initialized here
    */
    //directionsImage.innerHTML = "<br>" + '<img width="800" height="533" overflow="hidden" src=' + source +' />';
    let start = startingPoint.split("-");
    fetch("resources/google_map_routes/" + start[0].toLowerCase() + ".json")
        .then(response => response.json())
        .then(data => {
        for(var j = 0; j < data.length; j++){
            console.log(determineRoute(startingPoint, destination) + " " + data[j].routeID);
            if(determineRoute(startingPoint, destination) === (data[j].routeID)){
                if(selectedADA){
                    routeURL = data[j].urlADA;
                } else {
                    routeURL = data[j].urlWalking;
                }
                break;
            } else {
                routeURL = null;
            }
        }
        if(routeURL != null){
            directionsImage.innerHTML = '<iframe id="google-maps-iframe" class="google-maps-iframe" width="' + width + '%" height="' + height + 'px" src=' + routeURL +'></iframe>';
        } else {
            directionsImage.innerHTML = '<span style="font-size:60px">TO BE ADDED...</span>';
            directionsImage.innerHTML += "<br>" + '<img width="800" height="533" overflow="hidden" src="images/CyberpunkCity.gif" />';
        }
    });

    directionsTextClass.classList.add('show');
    inStartingScreen = true;
    if(!notInErrorScreen){
        directionsError.classList.remove('show');
        notInErrorScreen = true;
        document.getElementById("error").innerHTML = null;
        changeButtonDiv.innerHTML = '<button id="change-image-btn" class="change-image-btn" onclick="changeImageSize()"><img id="change-image" class="change-image" src="images/shrink.png"></button>';
    }
    if(startingPoint.match(destination)){
        directionsError.innerHTML = '<span style="color:rgb(255,99,71); font-size:5vh;">Error:</span><br>The starting point and destination cannot be the same';
        directionsError.classList.add('show');
        directionsTextClass.classList.add('show');
        for(var i = 1; i <= max; i++){
            document.getElementById("textline" + (i)).innerHTML = null;
        }
        notInErrorScreen = false;
        max = 0;
        setTimeout(()=>{
            directionsImage.innerHTML = null;
            changeButtonDiv.innerHTML = null;
        }, 100);
    }
}
function useNextButton(startingPoint, destination){
    if(startingPoint != destination){
        dir.innerHTML = "DIRECTIONS: ";
        var routeIndex = -1;
        fetch("resources/direction_routes/" + startingPoint.split("-")[0].toLowerCase() + ".json")
        .then(response => response.json())
        .then(data => {
        for(var j = 0; j < data.Routes.length; j++){
            if(determineRoute(startingPoint, destination).match(data.Routes[j].RouteID)){
                routeIndex = j;
            }
        }
        const route = data.Routes[routeIndex].Route;
        const routeID = data.Routes[routeIndex].RouteID;
        
        /*
        * Image only displays if directions exists in the json file
        */

        for(var i = 0; i < route.length; i++){
            var textline = document.getElementById("textline" + (i+1));
            
            /*
            * Checks whether the client selected ADA or AbleBodied
            * If the path is fine for ADA and is the shortest path
            * That is what the "FOR ALL" key is
            */

            if(route[i].ForAll != null){
            textline.innerHTML = route[i].ForAll + "<br>";
            if(route[i].ImageForAll != null){
                imageArray[i] = "images/" + route[i].ImageForAll;
            }
            } else {
                if(selectedADA && route[i].ADA != null){
                    textline.innerHTML = route[i].ADA + "<br>";
                    if(route[i].ImageADA != null){
                    imageArray[i] = "images/" + route[i].ImageADA;
                    }
                } else if(selectedWalkable && route[i].AbleBodied != null){
                    textline.innerHTML = route[i].AbleBodied + "<br>";
                    if(route[i].ImageAbleBodied != null){
                    imageArray[i] = "images/" + route[i].ImageAbleBodied;
                    } 
                } else {
                    textline.innerHTML = null;
                    imageArray[i] = "images/" + "CyberpunkCity.gif";
                }
            }
            console.log(i + ") ran");
            if(route[i].isEnd == true){
            textline.innerHTML += "<br>" + route[i].EntranceType;
            }
        }

        /*
        * Initializes the first image of the array
        */

        directionsImage.innerHTML = "<br>" + '<img width="' + width + '%" height="' + height + 'px" overflow="hidden" src=' + imageArray[0] +' />';
        max = route.length;
        });
        document.getElementById("error").innerHTML = null;
        directionsTextClass.classList.add('show');
        directionsError.classList.remove('show');
        counter = 1;
        for(var i = 1; i <= max; i++){
            document.querySelector(".line" + i).classList.remove('bold');
        }
        document.querySelector(".line" + 1).classList.add('bold');
        notInErrorScreen = true;
    } else {
        directionsError.innerHTML = '<span id="error-msg" style="color:rgb(255,99,71); font-size:5vh;">Error:</span><br>The starting point and destination cannot be the same';
        directionsError.classList.add('show');
        directionsTextClass.classList.add('show');
        for(var i = 1; i <= max; i++){
            document.getElementById("textline" + (i)).innerHTML = null;
        }
        counter = 0;
        notInErrorScreen = false;
        max = 0;
        if(directionsImage != null){
            directionsImage.innerHTML = null;
        }
    }
}

function determineRoute(startingPoint, destination){
    let s1 = startingPoint.split("-");
    let s2 = destination.split("-");
    return s1[0] + "to" + s2[0];
}

function buttonNext(){
    const startingPoint = selectElement.options[selectElement.selectedIndex].value;
    const destination = selectElement1.options[selectElement1.selectedIndex].value;
    if(counter != max && notInErrorScreen && !inStartingScreen){
        counter = counter + 1;
        document.querySelector(".line" + (counter - 1)).classList.remove('bold');
        document.querySelector(".line" + counter).classList.add('bold');
        directionsImage.innerHTML = "<br>" + '<img width="' + width + '%" height="' + height + 'px" overflow="hidden" src=' + imageArray[counter-1] +' />';
        inStartingScreen = false;
    } else if(inStartingScreen){
        useNextButton(startingPoint, destination);
        inStartingScreen = false;
    }
}

function buttonPrevious(){
    if(counter != 1 && notInErrorScreen){
        counter = counter - 1;
        document.querySelector(".line" + (counter + 1)).classList.remove('bold');
        document.querySelector(".line" + counter).classList.add('bold');
        directionsImage.innerHTML = "<br>" + '<img width="' + width + '%" height="' + height + 'px" overflow="hidden" src=' + imageArray[counter-1] +' />';
    } else if(counter == 1){
        inStartingScreen = true;
        dir.innerHTML = "Starting Point: ";
        for(var i = 1; i <= max; i++){
            document.getElementById("textline" + (i)).innerHTML = null;
        }
        useDirectionButton();
    }
}

function openFullScreenHandler(eventID, id){
    var element = document.getElementById(eventID);
    var element1 = document.getElementById(id);
    element.addEventListener("touchstart", ()=> {
        if(document.fullscreenElement){
            document.exitFullscreen();
        } else {
        /*
        *  max-width: 100%;
        *  height: auto;
        *  width: auto\9; /* ie8 *\
        */
            if(!/iPhone|iPad|iPod/i.test(navigator.userAgent)){
                fullscreenUIHandler(true, 0, true, false);
                if(element1.requestFullscreen){
                    console.log("Ran Default");
                    element1.requestFullscreen().catch(e => {
                        console.log(e);
                    });
                } else if(element1.webkitRequestFullscreen){
                    console.log("Ran Webkit");
                    element1.webkitRequestFullscreen().catch(e => {
                        console.log(e);
                    });
                }
            }
        }
    });
}

function exitFullscreenMode(){
    if(document.fullscreenElement){
        document.exitFullscreen();
        document.getElementById("fullscreen-div").innerHTML = null;
    }
}

function preInFullscreenMode(){
    if(document.fullscreenElement){
        if(counter > 1){
            document.getElementById("fullscreen-text").innerHTML = document.getElementById("textline" + (counter - 1)).innerHTML;
            document.getElementById("fullscreen-image").src = imageArray[counter-2];
            buttonPrevious();
        } else if(counter == 1){
            const startingPoint = selectElement.options[selectElement.selectedIndex].value;
            const destination = selectElement1.options[selectElement1.selectedIndex].value;
            fullscreenUIHandler(false, 100, false, true);
            buttonPrevious();
        } else {
            counter = 0;
        }
    }
}

function nextInFullscreenMode(){
    if(document.fullscreenElement){
        if(counter < max && counter != 0){
            buttonNext();
            document.getElementById("fullscreen-text").innerHTML = document.getElementById("textline" + (counter)).innerHTML;
            document.getElementById("fullscreen-image").src = imageArray[counter - 1];
        } else if(counter == 0){
            buttonNext();
            fullscreenUIHandler(true, 100, true, false);
        }
    }
}

function fullscreenUIHandler(needText, timer, needImage, needGoogleMapsIframe){
    const element1 = document.getElementById("fullscreen-div");
    if(needText && timer <= 0){
        element1.innerHTML = '<div id="fullscreen-text" class="fullscreen-text">' + document.getElementById("textline" + counter).innerHTML + '</div>';
    } else if(timer > 0 && needText){
        setTimeout(()=>{
            element1.innerHTML = '<div id="fullscreen-text" class="fullscreen-text">' + document.getElementById("textline" + counter).innerHTML + '</div>';
        },timer);
    } else {
        element1.innerHTML = null;
    }
    if(timer > 0){
        setTimeout(()=>{
        element1.innerHTML += '<button id="exit-btn" class = "exit-btn" onclick="exitFullscreenMode()">X</button>';
        element1.innerHTML += '<button id="inv-pre-btn" class = "inv-pre-btn" onclick="preInFullscreenMode()">PREV</button>';
        element1.innerHTML += '<button id="inv-next-btn" class = "inv-next-btn" onclick="nextInFullscreenMode()">NEXT</button>';
        if(needImage){
            element1.innerHTML += '<img id="fullscreen-image" class="fullscreen-image" src=' + imageArray[counter-1] +' />';
        }
        if(needGoogleMapsIframe){
            if(routeURL != null){
                element1.innerHTML += '<iframe id="fullscreen-iframe" class="fullscreen-iframe" src=' + routeURL + '></iframe>';
            } else {
                element1.innerHTML += '<img id="fullscreen-image" class="fullscreen-image" src="images/CyberpunkCity.gif" />';
            }
        }
        },timer);
    } else {
        element1.innerHTML += '<button id="exit-btn" class = "exit-btn" onclick="exitFullscreenMode()">X</button>';
        element1.innerHTML += '<button id="inv-pre-btn" class = "inv-pre-btn" onclick="preInFullscreenMode()">PREV</button>';
        element1.innerHTML += '<button id="inv-next-btn" class = "inv-next-btn" onclick="nextInFullscreenMode()">NEXT</button>';
        if(needImage){
            element1.innerHTML += '<img id="fullscreen-image" class="fullscreen-image" src=' + imageArray[counter-1] +' />';
        }
        if(needGoogleMapsIframe){
            if(routeURL != null){
                element1.innerHTML += '<iframe id="fullscreen-iframe" class="fullscreen-iframe" src=' + routeURL + '></iframe>';
            } else {
                element1.innerHTML += '<img id="fullscreen-image" class="fullscreen-image" overflow="hidden" src="images/CyberpunkCity.gif" />';
            }
        }
    }
}

function changeImageSize(){
    if(imageLarge){
        width = 60;
        height = 600;
        imageLarge = false;
        document.getElementById("change-image").setAttribute("src", "images/enlarge.png");
    } else {
        width = 100;
        height = 1000;
        imageLarge = true;
        document.getElementById("change-image").setAttribute("src", "images/shrink.png");
    }
    if(inStartingScreen){
        //directionsImage.innerHTML = '<iframe width="' + width + '%" height="' + height + 'px" src=' + routeURL +'></iframe>';
        document.getElementById("google-maps-iframe").setAttribute("width", width + "%");
        document.getElementById("google-maps-iframe").setAttribute("height", height + "px");
    } else if(notInErrorScreen){
        if(directionsImage.innerHTML != null){
            directionsImage.innerHTML = "<br>" + '<img width="' + width + '%" height="' + height + 'px" overflow="hidden" src="images/CyberpunkCity.gif" />';
        }
    }
    
}
