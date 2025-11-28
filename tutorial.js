let slideIndex = 1;
showSlides(slideIndex);

// Next/previous controls
function plusSlides(n) {
  showSlides(slideIndex += n);
}

// Close tutorial
function closeTutorial() {
  document.getElementById("tutorialSlides").style.display = "none";
  document.getElementById("tutorialOverlay").style.display = "none";
}

// Thumbnail image controls
function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  console.log("Slides found:", document.getElementsByClassName("slides").length);
  
  let i;
  let slides = document.getElementsByClassName("slides");

  for (let i = 0; i < slides.length; i++) {
      console.log(i, slides[i]);
  }
  
  let dots = document.getElementsByClassName("dot");
  if (slides.length === 0) return;
  if (n > slides.length) {slideIndex = 1}
  if (n < 1) {slideIndex = slides.length}
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}
