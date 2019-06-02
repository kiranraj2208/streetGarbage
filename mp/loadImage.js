var fs = require('fs');
var filePath = '/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/outputImages/'
var files = fs.readdirSync(filePath);
var path = require('path');
const gallery = document.getElementById('gallery')

var data = fs.readFileSync('/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/garbage.json', 'utf8');
var dataFromJson = JSON.parse(data);

console.log(files);
for(let i of files)
	previewFile(i);
var modal = document.getElementById("myModal");

// Get the image and insert it inside the modal - use its "alt" text as a caption

var modalImg = document.getElementById("img01");


// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}


function previewFile(file) {

	 fs.readFile(filePath+file, (err, data)=>{
                
        //get image file extension name
        let extensionName = path.extname(`${filePath}${file}`);
        
        //convert image file to base64-encoded string
        let base64Image = new Buffer(data, 'binary').toString('base64');
        
        //combine all strings
        let imgSrcString = `data:image/${extensionName.split('.').pop()};base64,${base64Image}`;
        console.log(imgSrcString.slice(0, 20));
        
        let div = document.createElement('div');
        let img = document.createElement('img')
			img.setAttribute('id', file)
			img.src = imgSrcString;
	img.setAttribute('style', 'margin: 20px;max-width: 300px; max-height: 300px;');
	let p = document.createElement('h3');
	var node = document.createTextNode("Prediction:" + dataFromJson[file]);
	p.appendChild(node);
	p.style.position = 'relative';
	p.style.top = '300px';
	p.style.marginLeft = '5%';
	
	
	div.appendChild(p);
	div.appendChild(img)
	div.style.float = 'left';
	div.style.height = '305px';
	div.style.width = '305px';
	div.style.margin = '10px';
	gallery.appendChild(div)
	
	var captionText = document.getElementById("caption");
	img.onclick = function(){
  	modal.style.display = "block";
  	modalImg.src = this.src;
  	captionText.innerHTML = dataFromJson[file];
}
        
    })
}

