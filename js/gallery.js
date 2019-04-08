// requestAnim shim layer by Paul Irish
    window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       ||
              window.webkitRequestAnimationFrame ||
              window.mozRequestAnimationFrame    ||
              window.oRequestAnimationFrame      ||
              window.msRequestAnimationFrame     ||
              function(/* function */ callback, /* DOMElement */ element){
                window.setTimeout(callback, 1000 / 60);
              };
    })();


// example code from mr doob : http://mrdoob.com/lab/javascript/requestanimationframe/

animate();

var mLastFrameTime = 0;
var mWaitTime = 5000; //time in ms
function animate() {
    requestAnimFrame( animate );
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
var lastImg = false;
// Counter for the mImages array
var mCurrentIndex = 0;

//Calls photoDisplayed to swap the image displayed
//mCurrentIndex iterates through the images and sets the index
function swapPhoto() {
	//Add code here to access the #slideShow element.
	//Access the img element and replace its source
	//with a new image from your images array which is loaded
	//from the JSON string
  if (lastImg) {
    if (mCurrentIndex > 0) {
      mCurrentIndex--;
    } else {
      mCurrentIndex = mImages.length - 1;
    };
  } else {
    if (mCurrentIndex < mImages.length - 1) {
      mCurrentIndex++;
    } else {
      mCurrentIndex = 0;
    };
  };
  photoDisplayed();
};
//Changes the photo that is displayed
function photoDisplayed() {
  $('#photo').attr("src", mImages[mCurrentIndex].location);
  $('.location').text('Location: ' + mImages[mCurrentIndex].image);
  $('.description').text('Description: ' + mImages[mCurrentIndex].description);
  $('.date').text('Date: ' + mImages[mCurrentIndex].date);
}

function imgDetails(){
    $('.moreIndicator').click(function(){
        console.log(mCurrentIndex);
        if( $('.moreIndicator').hasClass('rot90')){
            $('.details').slideDown();
            $('.moreIndicator').removeClass('rot90');
            $('.moreIndicator').addClass('rot270');
        } else{
            $('.details').slideUp();
            $('.moreIndicator').removeClass('rot270');
            $('.moreIndicator').addClass('rot90');
        }
    });
};

//Moves forward through images when button is clicked
function forward(){
        $('#nextPhoto').click(function(){
                prevClicked=false;
        if(mCurrentIndex === mImages.length - 1){
            mCurrentIndex = 0;
            photoDisplayed();
            mLastFrameTime = 0;

        } else{
            mCurrentIndex++;
            photoDisplayed();
            mLastFrameTime = 0;
        }
    });
};
//Moves backward through images when button is clicked
var clicked = false;
function backward(){
        $('#prevPhoto').click(function(){
            clicked = true;
        if(mCurrentIndex === 0){
            mCurrentIndex = mImages.length - 1;
            photoDisplayed();
            mLastFrameTime = 0;

        } else{
            mCurrentIndex--;
            photoDisplayed();
            mLastFrameTime = 0;
        }
    });
};


// XMLHttpRequest
var mURL = "images.json";
var mRequest = new XMLHttpRequest();
mRequest.onreadystatechange = function() {
  // Do something interesting if file is opened successfully
  if (mRequest.readyState == 4 && mRequest.status == 200) {
    try {
    // Let’s try and see if we can parse JSON
    mJson = JSON.parse(mRequest.responseText);
    //JS Object to retrieve JSON photo URLs and metadata
    //Pushes the metadata and URLs into mImages
    for (var i = 0; i < mJson.images.length; i++) {
      var path = mJson.images[i].imgPath;
      var location = mJson.images[i].imgLocation;
      var description = mJson.images[i].description;
      var date = mJson.images[i].date;
      mImages.push(new GalleryImage(path, location, description, date));
    }
    // Let’s print out the JSON; It will likely show as "obj"
    console.log(mJson);
    } catch(err) {
    console.log(err.message)
    }
  }
};
mRequest.open("GET",mURL, true);
mRequest.send();

// Array holding GalleryImage objects (see below).
var mImages = [];

// Holds the retrived JSON information
var mJson;

//You can optionally use the following function as your event callback for loading the source of Images from your json data (for HTMLImageObject).
//@param A GalleryImage object. Use this method for an event handler for loading a gallery Image object (optional).
function makeGalleryImageOnloadCallback(galleryImage) {
	return function(e) {
		galleryImage.img = e.target;
		mImages.push(galleryImage);
	}
}

$(document).ready( function() {
	// This initially hides the photos' metadata information
  //When the buttons are clicked, they will go backwards and forwards
	$('.details').eq(0).hide();
  imgDetails();
  forward();
  backward();
});

window.addEventListener('load', function() {

	console.log('window loaded');

}, false);

// Object to hold image's data (location, description, date, and photo)
function GalleryImage(loc, desc, da, pho) {
  this.location = loc;
  this.description = desc;
  this.date = da;
  this.image = pho;
	//implement me as an object to hold the following data about an image:
	//1. location where photo was taken
	//2. description of photo
	//3. the date when the photo was taken
	//4. either a String (src URL) or an an HTMLImageObject (bitmap of the photo. https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement)
}
