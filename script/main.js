myCanvas = document.getElementById("myCanvas");
ctx = myCanvas.getContext('2d');

myCanvas2 = document.getElementById("myCanvas2");
ctx2 = myCanvas2.getContext('2d');

/*	Setting the height of the two canvases	*/


var canvasHeight = 350;
var canvasWidth = document.getElementById("firstCanvas").offsetWidth - 12;

var canvasHeight2 = 350;
var canvasWidth2 = document.getElementById("secondCanvas").offsetWidth;


// variable values to canvas values


myCanvas.height = canvasHeight;
myCanvas.width = canvasWidth;

myCanvas2.height = canvasHeight2;
myCanvas2.width = canvasWidth2;

// canvas values to variable values

/*
canvasHeight = myCanvas.height;
canvasWidth = myCanvas.width;

canvasHeight2 = myCanvas2.height;
canvasWidth2 = myCanvas2.width;
/*/

/**********************************************/


/*	Which Algo stores which sorting algorithm is being used

		1 --> Bubble Sort
		2 --> Insertion Sort
		3 --> Selection Sort
		4 --> Merge Sort
		5 --> Quick Sort

*/
var whichAlgo = document.getElementById("select_sort").selectedIndex + 1;

var horizMargin = 25;
var bottomMargin = 20;

var numOfBars = document.getElementById("myRange").value;
var barMinLength = 1;
var barMaxLenght = 99;
var startBarX = horizMargin;
var startBarY = canvasHeight - bottomMargin;

var barGap = (canvasWidth - ( 2 * horizMargin )) / (2 * numOfBars - 1);
var barWidth = barGap;

//var barWidth = (canvasWidth - ((numOfBars + 1) * barGap)) / numOfBars;

var bars;
var sort;
var done;
var onlyOnce;
var upArrowImg = null;
var index;
var finishSpeed = 2;
var finish;
var finishInc; 

var animating = false;
var changingValue = document.getElementById("changeNumber").checked;
var isFrameByFrame = true;

var num1 = document.getElementById("num1");
num1.value = numOfBars;


var num2 = document.getElementById("num2");

fillIndexSelection();

createArray(1);

/*
	Setting the event listener for the button that moves the animation forward frame by frame.
*/
document.getElementById('next').addEventListener("click", myFunction); 

function myFunction()
{
	if (changingValue)
	{
		alert("Cannot sort while in edit mode!!");
		return;
	}

	if (isFrameByFrame)
		sort.nextFrame();
}

requestAnimationFrame(animationLoop);

function animationLoop(timeStamp)
{
	if (!changingValue)
	{

		if (animating || isFrameByFrame)
		{
			if (!done)
			{
				done = sort.update(timeStamp);
				sort.draw(ctx, ctx2);
			}
			else if (onlyOnce)
			{
				finish++;

				if (finish >= finishSpeed)
				{
					if (finishInc == 1)
					{
						bars[index].finishColor = true;
						bars[index].finishColor2 = false;
					}
					else
					{
						console.log(index);
						bars[index].finishColor = false;
						bars[index].finishColor2 = true;
					}
					
					sort.onlyDraw(ctx, ctx2);
					index += finishInc;

					if (index == bars.length)
					{
						finishInc = -1;
						index = bars.length - 1;
					}

					if (index == -1)
					{
						onlyOnce = false;
						finishInc = 1;
						index = 0;
					}

					finish = 0;
				}
			}
		}
	}
	else
	{
		/*
		if (upArrowImg != null)
		{
			var index = document.getElementById("index").selectedIndex;
			var x = bars[index].numberXPos - (sort.lineOffset / 4);
			ctx2.drawImage(upArrowImg, x - 10, canvasHeight2 - 70, sort.lineOffset - 5, 70);
			console.log(x);
		}
		*/
	}

	requestAnimationFrame(animationLoop);
}


/* Finction to create the new Array with random values

		The mode parameter tells weather to generate random values ( for mode = 1 )
		or only to create the new sorting object and keeping the previous values as they are. (for mode = 0)
	
*/

function createArray(mode)
{
	var oldBars;

	if (mode == 0)
		oldBars = bars;

	bars = new Array(numOfBars);

	var x = startBarX;
	var y = startBarY;


	for (var i = 0; i < numOfBars; i++)
	{
		var length;

		if (mode == 1)
		{
			length = Math.floor(Math.random() * (barMaxLenght - barMinLength + 1)) + barMinLength;
		}
		else
			length = oldBars[i].len;

		bars[i] = new Bar(bars, x, y, barWidth, length, whichAlgo, "#e65c00", '#f00', '#b3b300', '#0f0', "#352", "#ff9900");
		
		bars[i].index = i;

		x += barWidth + barGap;
	}

	if (whichAlgo ==1)
		sort = new BubbleSort(bars, canvasWidth, canvasHeight, canvasWidth2, canvasHeight2, whichAlgo);
	else if (whichAlgo == 2)
		sort = new InsertionSort(bars, canvasWidth, canvasHeight, canvasWidth2, canvasHeight2, whichAlgo);
	else if (whichAlgo == 3)
		sort = new SelectionSort(bars, canvasWidth, canvasHeight, canvasWidth2, canvasHeight2, whichAlgo);
	else if (whichAlgo == 4)
		sort = new MergeSort(bars, canvasWidth, canvasHeight, canvasWidth2, canvasHeight2, whichAlgo);
	else
		sort = new QuickSort(bars, canvasWidth, canvasHeight, canvasWidth2, canvasHeight2, whichAlgo);

	done = false;		// variable for checking if the sorting is completed or not
	onlyOnce = true;
	index = 0;
	finish = finishSpeed;
	finishInc = 1;

	setPosInBox();

	sort.onlyDraw(ctx, ctx2);

	animating = false;
	sort.isFrameByFrame = isFrameByFrame;
	changingValue = document.getElementById("changeNumber").checked;

	var ind = document.getElementById("index").selectedIndex;
	document.getElementById("numbers").value = bars[ind].len;
	num2.value = document.getElementById("numbers").value;

}

/* Function to set the array element positions in the array bar (In the second canvas) */ 
function setPosInBox()
{
	//Settirg the values for the positions of array element in the box (container)
	var startX = (sort.lineOffset / 2) + sort.horizMargin;
	for (var i = 0; i < bars.length; i++)
	{
		bars[i].numberYPos = sort.boxStartY + (sort.boxWidth / 2);
		bars[i].numberXPos = startX;
		bars[i].boxWidth = sort.boxWidth;
		bars[i].boxStartY = sort.boxStartY;
		bars[i].lineOffset = sort.lineOffset;
		startX += sort.lineOffset;

		if (whichAlgo == 4)
		{
			bars[i].numberYPos += sort.boxAdjustment;
		}
	}
}

/* Function setting the values for the array element selectors .*/

function fillIndexSelection()
{
	var select = document.getElementById("index");
		    
	for(var i=0; i < numOfBars; i++){

	    	var option = document.createElement("OPTION");
		    select.options.add(option);
		    option.text = i;
		    option.value = i;
	}
}

function emptySelections()
{
	$('#index').empty();
}

function indexChanged()
{
	var index = document.getElementById("index").selectedIndex;

	var len = bars[index].len;

	document.getElementById("numbers").value = len;
	num2.value = len;
}

/* Function to change the number of bars that are being sorted.

	  It does 3 things:
	  	
	  	1. Stops the animation.
	  	2. Creates the new array with the updated value of numberOfBars.
*/

function recreateBars(changedValue)
{

	isFrameByFrame = true;

	// 1.
	animating = false;		

	//2.
	numOfBars = changedValue;
	num1.value = changedValue;
	barGap = (canvasWidth - ( 2 * horizMargin )) / (2 * numOfBars - 1);
	barWidth = barGap;
	createArray(1);

	emptySelections();
	fillIndexSelection();

}

function recreateBars2()
{
	recreateBars(document.getElementById("myRange").value);
}

/*Starts the animating*/
function startAnimation()
{
	animating = true;
	isFrameByFrame = false;
	sort.isFrameByFrame =false;
}

/*Pauses the animation*/
function pauseAnimation()
{
	animating = false;
	isFrameByFrame = true;
	sort.isFrameByFrame = true;
}


function changeArrayElement()
{
	if (changingValue)
	{
		var index = document.getElementById("index");
		var selection = document.getElementById("numbers");

		bars[index.selectedIndex].len = eval(selection.value);

		num2.value = selection.value;

		sort.onlyDraw(ctx, ctx2);
	}
}

/*

	This function is for the value change mode

*/
function changeValues(checkValue)
{
	changingValue = checkValue;
	animating = false;
	sort.onlyDraw(ctx, ctx2);

	if (checkValue)
	{
		createArray(0);
	}
}


//Loads the up arrow image
function loadImage()
{
	upArrowImg = document.getElementById("upArrow");
}


//Changes the algorithm used for sorting
function changeAlgo()
{
	whichAlgo = document.getElementById("select_sort").selectedIndex + 1;
	createArray(0);
}

elem1 = $("#firstCanvas")[0]; 
  
        let resizeObserver1 = new ResizeObserver(() => { 
            canvasWidth = document.getElementById("firstCanvas").offsetWidth - 12; 
            myCanvas.width = canvasWidth;

            changePosAndWidth();

            sort.onlyDraw(ctx, ctx2);
    }); 
  
resizeObserver1.observe(elem1);

elem2 = $("#secondCanvas")[0]; 
  
        let resizeObserver2 = new ResizeObserver(() => { 
            canvasWidth2 = document.getElementById("secondCanvas").offsetWidth;
            myCanvas2.width = canvasWidth2;

            changePosAndWidth();

            sort.onlyDraw(ctx, ctx2);
        }); 
  
resizeObserver2.observe(elem2);  


function changePosAndWidth()
{

	startBarY = canvasHeight - bottomMargin;

	barGap = (canvasWidth - ( 2 * horizMargin )) / (2 * numOfBars - 1);
	barWidth = barGap;

	var x = startBarX;
	var y = startBarY;


	for (var i = 0; i < numOfBars; i++)
	{
		bars[i].xPos = x;
		bars[i].yPos = y;
		bars[i].width = barWidth;

		bars[i].targetX = x;

		x += barWidth + barGap;
	}

	sort.canvasWidth = canvasWidth;
	sort.canvasWidth2 = canvasWidth2;

	sort.startX = bars[0].xPos + bars[0].width / 2;
	sort.increment = 2 * bars[0].width;

	sort.lineOffset = (canvasWidth2 - (2 * sort.horizMargin)) / bars.length;
	sort.boxLength = canvasWidth2 - (2 * sort.horizMargin);

	if (window.innerWidth >= 992 || this.whichAlgo == 4)
		sort.boxStartY = (canvasHeight2 / 2) - (sort.boxWidth / 2);
	else
		sort.boxStartY = 20;

	setPosInBox();
}


function inputChange()
{
	var previousValue = numOfBars;

	var curInput = parseInt(num1.value);

	if (isNaN(curInput))
	{
		num1.value = previousValue;
		return;
	}
	if (curInput == previousValue)
	{
		num1.value = previousValue;
		return;
	}

	if (curInput < 5)
		curInput = 5;
	else if (curInput > 20)
		curInput = 20;

	num1.value = curInput;
	document.getElementById("myRange").value = curInput;

	recreateBars(curInput);
}

function inputChange2()
{
	var selection = document.getElementById("numbers");
	var previousValue = selection.value;

	var curInput = parseInt(num2.value);

	if (isNaN(curInput))
	{
		num2.value = previousValue;
		return;
	}
	if (curInput == previousValue)
	{
		num2.value = previousValue;
		return;
	}

	if (curInput < 1)
		curInput = 1;
	else if (curInput > 99)
		curInput = 99;

	num2.value = curInput;
	selection.value = curInput;

	changeArrayElement();
}