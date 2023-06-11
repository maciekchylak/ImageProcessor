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
    var preview = document.getElementById('preview');

    if (imageTitle && preview) {
        var newImage = {
            src: preview.src,
            title: imageTitle
        };

        images1.push(newImage);

        fetch('https://rkhdf9msel.execute-api.us-east-1.amazonaws.com/default/ImageToS3'
        , {
            method: 'POST',
            body: JSON.stringify({
                fileName: imageTitle + ".png",
                image: preview.src
            }),
            mode: 'cors',
        })
        .then(function (response) {
        if (response.ok) {
            return response.json();
        }
            console.log(response.json())
            throw new Error('Network response was not ok.');
        })
        .then(function (data) {
            console.log(data);
        })
        .catch(function (error) {
        });

        images2.push('resized-' + imageTitle)

        displayImages(imageTitle)

        document.getElementById('imageForm').reset();
    }
}

async function checkImageExists(url) {
    return new Promise((resolve, reject) => {
      const image = new Image();
  
      image.onload = function() {
        if (image.width > 0 && image.height > 0) {
          resolve(); 
        } else {
          setTimeout(() => {
            checkImageExists(url).then(resolve).catch(reject);
          }, 500);
        }
      };
  
      image.onerror = function() {
        setTimeout(() => {
          checkImageExists(url).then(resolve).catch(reject);
        }, 500);
      };
  
      image.src = url;
    });
  }

async function displayImages() {
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

        var image2_title = images2[i];
        console.log(image2_title)
        var image2_path = 'https://tn50io3r7f.execute-api.us-east-1.amazonaws.com/v2/sourcebacket6-resized/' + image2_title + '.png'
        await checkImageExists(image2_path)

        var imageElement2 = document.createElement('img');
        imageElement2.src = image2_path;
        imageContainer2.appendChild(imageElement2);  

        var titleElement2 = document.createElement('h3');
        titleElement2.textContent = image2_title;
        titleElement2.classList.add('image-title');
        imageContainer2.appendChild(titleElement2);

        preview.setAttribute('src', '');
        preview.style.display = 'none';
    }
}

function processLatestImage() {
    // var imageTitle = document.getElementById('imageTitle').value;
    // var preview = document.getElementById('preview');

    // if (imageTitle && preview) {
    //     var newImage = {
    //         src: preview.src,
    //         title: imageTitle
    //     };

    //     images1.push(newImage);
    //     images2.push(newImage);


    fetch('https://tn50io3r7f.execute-api.us-east-1.amazonaws.com/v2/sourcebacket6'
    , {
        method: 'GET',
    })
    .then(function (response) {
    if (response.ok) {
        return response.json();
    }
    throw new Error('Network response was not ok.');
    })
    .then(function (data) {
    console.log(data);
    displayLatestImages(data);
    })
}


function displayLatestImages(data) {
    var lastest_images = document.getElementById('lastest_images');
    lastest_images.innerHTML = '';

    for (var i = 0; i < data.length; i++) {
        var image1 = data[i];

        src='https://tn50io3r7f.execute-api.us-east-1.amazonaws.com/v2/sourcebacket6'+'/'+image1
        
        var titleElement1 = document.createElement('h3');
        titleElement1.textContent = image1;
        titleElement1.classList.add('image-title');
        lastest_images.appendChild(titleElement1);

        var new_img = document.createElement('img');
        new_img.src = src
        lastest_images.appendChild(new_img);

    }
    preview.setAttribute('src', '');
    preview.style.display = 'none';
}
