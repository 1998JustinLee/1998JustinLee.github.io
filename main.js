var slideIndex = 1;
slideshowButton(slideIndex);

// Initialize buttons
function slideshowButton(n) {
  showDivs(slideIndex += n);
}

// Slideshow left/right buttons
function showDivs(n) {
    var x = document.getElementsByClassName("slideImg");
    var b = document.getElementsByClassName("dot");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}

    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        b[i].style.color = "#CCC";
    }

    x[slideIndex-1].style.display = "block";
    b[slideIndex-1].style.color = "black";
}

// Slideshow dots buttons
function showDivsDots(n) {
    var x = document.getElementsByClassName("slideImg");
    var b = document.getElementsByClassName("dot");
    if (n > x.length) {slideIndex = 1}
    if (n < 1) {slideIndex = x.length}

    for (var i = 0; i < x.length; i++) {
        x[i].style.display = "none";
        b[i].style.color = "#CCC";
    }

    x[n-1].style.display = "block";
    b[n-1].style.color = "black";
}
