// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function () {
	return window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame ||
		function (/* function */ callback, /* DOMElement */ element) {
			window.setTimeout(callback, 1000 / 60);
		};
})();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
	requestAnimFrame(animate);
	var currentTime = new Date().getTime();
	if (mLastFrameTime === 0) {
		mLastFrameTime = currentTime;
	}

	if ((currentTime - mLastFrameTime) > mWaitTime) {
		swapPhoto();
		mLastFrameTime = currentTime;
	}
}

/************* DO NOT TOUCH CODE ABOVE THIS LINE ***************/

function swapPhoto() {

	if (mCurrentIndex >= mImages.length) {
		let mCurrentIndex = 0;
	} else {
		let mCurrentIndex = mImages.length - 1;
	}

	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded 
	//from the JSON string
	document.getElementById("photo").src = mImages[mCurrentIndex].img
	console.log('swap photo');
	let description = document.getElementsByClassName("description")[0]
	let location = document.getElementsByClassName("location")[0]
	let date = document.getElementsByClassName("date")[0]
	description.innerHTML = "Description: " + mImages[mCurrentIndex].description
	location.innerHTML = "Location: " + mImages[mCurrentIndex].location
	date.innerHTML = "Date: " + mImages[mCurrentIndex].date
	let mLastFrameTime = 0;
	mCurrentIndex += 1
}



// Counter for the mImages array
var mCurrentIndex = 0;

// XMLHttpRequest variable
let mRequest = new XMLHttpRequest();
// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

// URL for the JSON to load by default
// Some options for you are: images.json, images.short.json; you will need to create your own extra.json later
var mUrl = "images.json";


//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function (e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready(function () {

	// This initially hides the photos' metadata information
	//$('.details').eq(0).hide();
	fetchJSON();
	$('img.moreIndicator').on("click", function () {
		if ($(this).hasClass('rot90')) {
			$(this).removeClass('rot90').addClass('rot270');
		} else {
			$(this).removeClass('rot270').addClass('rot90');
		}
		$('div.details').slideToggle('slow', animate());

	});

	$("#nextPhoto").on("click", function () {
		mCurrentIndex++;
		if (mCurrentIndex >= mImages.length) {
			mCurrentIndex = 0; // Loop back to the first photo
		}
		swapPhoto();
	});
	$('#nextPhoto').position({
		my:'right',
		at: 'right',
		of: '#nav'
	})

	$("#prevPhoto").on("click", function () {
		mCurrentIndex = mCurrentIndex - 2;
		if (mCurrentIndex < 0) {
			mCurrentIndex = mImages.length - 1; // Loop back to the last photo
		}
		swapPhoto();
		console.log(mCurrentIndex);

	});

});

window.addEventListener('load', function () {

	console.log('window loaded');


}, false);

function GalleryImage() {
	//implement me as an object to hold the following data about an image:
	let location = ""
	let description = ""
	let date = ""
	let img = ""
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
}

//Get the information from the JSON file, create a variable containing the response text and parse it
function fetchJSON() {
	mRequest.onreadystatechange = function () {
		if (mRequest.readyState == 4 && mRequest.status == 200) {
			let mJson = JSON.parse(mRequest.responseText);
			console.log("WORKING")
			console.log(mJson.images[3].imgPath)
			iterateJSON(mJson)

		}
		else {
			console.log("We connected to the server, but it returned an error")
		}
	}
	mRequest.open("GET", mUrl, true)
	mRequest.send()
}


function iterateJSON(mJson) {
	for (let x = 0; x < mJson.images.length; x++) {
		mImages[x] = new GalleryImage()
		mImages[x].location = mJson.images[x].imgLocation
		mImages[x].description = mJson.images[x].description
		mImages[x].date = mJson.images[x].date
		mImages[x].img = mJson.images[x].imgPath
	}
}


