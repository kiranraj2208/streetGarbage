const fs = require('fs');
var { PythonShell } = require('python-shell');
var path = '/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/object1.py';
var isGarbagePath = '/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/garbageYesNo/isGarbage.py'


const dropArea		= document.getElementById("drop-area")
const gallery		= document.getElementById('gallery')

const uploadButton	= document.getElementById('fileElem')
const detectButton	= document.getElementById('detectBtn')

let imgCount = 0;

const tooltip = document.createElement('span');

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
	dropArea.addEventListener(eventName, preventDefaults, false)
	document.body.addEventListener(eventName, preventDefaults, false)
});

// Highlight drop area when item is dragged over it

dropArea.addEventListener('dragenter'	, function (e) {dropArea.setAttribute('style', '--borderWidth: 10px;')}, false);
dropArea.addEventListener('dragover'	, function (e) {dropArea.setAttribute('style', '--borderWidth: 10px;')}, false);

dropArea.addEventListener('dragleave'	, function (e) {dropArea.removeAttribute('style')}, false);
dropArea.addEventListener('drop'		, function (e) {dropArea.removeAttribute('style')}, false);

// Handle dropped files
dropArea.addEventListener('drop'		, function (e) { handleFiles(e.dataTransfer.files); }, false)

function preventDefaults (e) {
	e.preventDefault()
	e.stopPropagation()
}



let uploadProgress = []
let progressBar = document.getElementById('progress-bar')

function initializeProgress(numFiles) {
	progressBar.value = 0
	uploadProgress = []

	for(let i = numFiles; i > 0; i--) {
		uploadProgress.push(0)
	}
}

function updateProgress(fileNumber, percent) {
	uploadProgress[fileNumber] = percent
	let total = uploadProgress.reduce((tot, curr) => tot + curr, 0) / uploadProgress.length
	//  console.debug('update', fileNumber, percent, total)
	progressBar.value = total
}

function handleFiles(files) {

	// document.getElementById('test').innerHTML = '<b>START<//b>'
	// handles (n-1) files
	if (gallery.childElementCount + files.length > 20)
		console.log('this is too much!')
	else {
		files = [...files]
		initializeProgress(files.length)
		// console.log(files)
		

		/**/
		files.forEach(function (el, index) {
			setTimeout( function() {
				previewFile(el);
			}, index * 50);
		});

	}
}

// const isImage = (file) => file['type'].includes('image')

/*change imageAsset PATH*/

const toolTipTag = '<span id="tooltip" class="tooltiptext tooltip-right">Upload at least one image</span>';

function previewFile(file) {

	const fname = file.name

	if(document.getElementById(fname) == null) {
		// console.log(isImage(file));

		let reader = new FileReader()

		reader.readAsDataURL(file)

		if(imgCount == 0 ) {
			detectButton.classList.remove("disabled")
			document.getElementById("tooltip").outerHTML = "";
		}
		imgCount++;

		reader.onloadend = function() {
			// console.log(file.type);

			let deleteButton = document.createElement('img')
			deleteButton.setAttribute('src', 'img/del.png')
			deleteButton.setAttribute('class', 'after')

			let div = document.createElement('div')
			div.appendChild(deleteButton)

			let img = document.createElement('img')
			img.setAttribute('id', fname)
			img.src = reader.result

			div.appendChild(img)
			img.setAttribute('class', 'gallery before')

			div.addEventListener('click', function() {
					if(--imgCount == 0) {
						detectButton.classList.add("disabled");
						tooltip.innerHTML = toolTipTag;
						detectButton.appendChild(tooltip);
					}

			var divContainer = this.parentElement;
			divContainer.removeChild(this);

			});

			gallery.appendChild(div);

			// print base64 encoding of image
			// console.log(img.src, img.src.split(',')[1]);
		}

	} else {
		// not adding files toast ... TODO
		console.log(fname + ' already there')
	}
}

function test() {

	if (imgCount != 0) {

		// delete existing files
		fs.readdirSync('/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/test_images1/').forEach(file => {
			fs.unlinkSync(`/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/test_images1/${file}`); 
		});
		
		fs.readdirSync('/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/outputImages/').forEach(file => {
			fs.unlinkSync(`/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/outputImages/${file}`); 
		});

		const imgs = document.getElementsByClassName('gallery before')
		for (var i = 0, n = imgs.length; i < n; ++i ) {
			saveFile( imgs[i].src.split(',')[1], imgs[i].id );
		}
		
		document.getElementById('drop-area').setAttribute('style', 'opacity: 0.1;');
		document.getElementById('loading').setAttribute('style', 'opacity:1');
		document.getElementById('loading').setAttribute('class', 'loader');

		/* process call */
		var isGarbage = new PythonShell(isGarbagePath);
		
		isGarbage.on('message', function(message){
			console.log(message);
		})
		
		isGarbage.end(function(err) {
			if(err) throw err;
			console.log('is Garbage finished');
		})
		
		var pythonShell = new PythonShell(path);
		pythonShell.on('message', function(message){
			console.log(message);
		})
		
		pythonShell.end(function(err) {
			if(err) throw err;
			console.log('finished');
			window.location.href = 'loadImage.html';
		})
	}
	

}

function saveFile(base64Data, name) {

	fs.writeFile(`/home/kiran/kiranRaj/tensorflowNew/myObjectDetection/test_images1/${name}`, base64Data, 'base64', function(err) {
		if(err) console.log(err);
	});
	
}



