var images1 = []
var images2 = []

function previewImage(event) {
    var input = event.target;
    var preview = document.getElementById('preview');

    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            preview.setAttribute('src', e.target.result);
            preview.style.display = 'block';
        }

        reader.readAsDataURL(input.files[0]);
    }
}

function processImage() {
    var imageTitle = document.getElementById('imageTitle').value;
    var preview = document.getElementById('preview').getAttribute('src');
    
    if (imageTitle && preview) {
        var newImage = {
            src: preview,
            title: imageTitle
        };
        
        images1.push(newImage);
        images2.push(newImage);
        
        displayImages();

        document.getElementById('imageForm').reset();
    }
}

function displayImages() {
    var imageContainer1 = document.getElementById('imageContainer1');
    imageContainer1.innerHTML = '';

    var imageContainer2 = document.getElementById('imageContainer2');
    imageContainer2.innerHTML = '';

    for (var i = 0; i < images1.length; i++) {
        var image1 = images1[i];

        var imageElement1 = document.createElement('img');
        imageElement1.src = image1.src;
        imageContainer1.appendChild(imageElement1);

        var titleElement1 = document.createElement('h3');
        titleElement1.textContent = image1.title;
        titleElement1.classList.add('image-title');
        imageContainer1.appendChild(titleElement1);
    
        var image2 = images2[i];

        var imageElement2 = document.createElement('img');
        imageElement2.src = image2.src;
        imageContainer2.appendChild(imageElement2);

        var titleElement2 = document.createElement('h3');
        titleElement2.textContent = image2.title;
        titleElement2.classList.add('image-title');
        imageContainer2.appendChild(titleElement2);
    }
    preview.setAttribute('src', '');
    preview.style.display = 'none';
}
