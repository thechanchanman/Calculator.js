/***********************************************************************
**																																		**
**																																		**
**															VARIABLES															**
**																																		**
**																																		**
***********************************************************************/

// variable names starting with '$' store dom elements

var $screen = document.getElementById("screen");
var $screenSmall = document.getElementById("screenSmall");
var $numbers = document.querySelectorAll(".numbers");
var $clear = document.getElementById("clear");
var $period = document.getElementById("period");
var $container = document.getElementById("calc-container");
var $grid = document.getElementById("grid");
var $menuBtn = document.getElementById("menu-icon");
var $menu = document.getElementById("menu");
var $themeBlue = document.getElementById("theme-blue-preview");
var $themeWhite = document.getElementById("theme-white-preview");
var $themeCandy = document.getElementById("theme-candy-preview");
var $themePreviews = document.querySelectorAll(".preview");
// operations
var $plus = document.getElementById("plus");
var $minus = document.getElementById("minus");
var $divide = document.getElementById("divide");
var $multiply = document.getElementById("multiply");
var $power = document.getElementById("power");
var $sqr = document.getElementById("sqr");
var $sqrt = document.getElementById("sqrt");
var $equality = document.getElementById("equality");
var $sign = document.getElementById("sign");

var total = 0;
var numTemp;
var operant;
var operationType;
var numInput = "";
// "switch" variable to determine if the input
// is going to concatenate with existing value or
// be a new value
var canErase = false;
// store history of operations
var arrHistory = [];



/***********************************************************************
**																																		**
**																																		**
**															FUNCTIONS															**
**																																		**
**																																		**
***********************************************************************/

function hit(el) {
	// when the user pressing a keyboard button, toggle
	// the "active" class to the corresponging UI buttons
	document.getElementById(el).click();
	document.getElementById(el).classList.toggle("active");
	setTimeout(function(){
		document.getElementById(el).classList.toggle("active");
	},240);
} // end of hit

// math functions
function addNums(a, b) {
	return a + b;
}

function minusNums(a, b) {
	return a - b;
}

function multiplyNums(a, b) {
	return a * b;
}

function divideNums(a, b) {
	return a / b;
}

function powerNum(a, b) {
	return Math.round((Math.pow(a, b)) * 100) / 100;
}

function sqrNum(a) {
	return Math.round((a * a) * 100) / 100;
}

function sqrtNum(a) {
	return Math.sqrt(a);
}

var filterFloat = function (value) {
    if(/^(\-|\+)?([0-9]+(\.[0-9]+)?|Infinity)$/
      .test(value))
      return Number(value);
  return NaN;
}


function readable(val) {
	// format the numbers, separating them with commas (",")
	// DEPEDENCY: accounting.js
	var input = "";
	input += val;
	if (input.indexOf(".") > 0) {
		return $screen.innerHTML = accounting.formatNumber(input, ((input.length - 1) - input.indexOf(".")));
	} else {
		return $screen.innerHTML = accounting.formatNumber(input);
	}
} // end of readable


function parseNum(numInput) {
	if ((typeof numInput === "string" && numInput.indexOf(".") > 0) || (numInput % 1 !== 0)) {
		// check if input has a ".", then parse it as a float else as an integer
		return filterFloat(numInput);
	}
	else {
		return parseInt(numInput);
	}
} // end of parseNum


function doThePower(operation, symb) {
	numInput = parseNum(numInput); // parse the input as a number
	if (arrHistory.length > 1 && arrHistory[arrHistory.length - 1] === "&equals;") {
		numTemp = total;
		arrHistory = [];
		$screenSmall.innerHTML = "";
		arrHistory.push(numTemp);
		arrHistory.push(symb);
	} else {
		numTemp = numInput; // store input value in a temporary variable
	}
	operant = operation; // store the current operation in a temporary variable
	canErase = true; // can erase input
	numInput = ""; // clean input
}


function doTheInstantMath(operation) {
	numInput = parseNum(numInput); // parse the input as a number
	numInput = operation(numInput);
	$screen.innerHTML = readable(numInput);
}


function doTheMath(operation, symb) {
	// main function
	// kicks in when user clicks/presses an operator (+,-,*,/,=)

	if (arrHistory.length > 1 && /[(&plus;)(&minus;)(&times;)(&divide;)]/.test(arrHistory[arrHistory.length - 1]) && numInput === "") {
		// check if arrHistory's last value (arrHistory.length - 1) was +,/,x,...
		// if yes, remove that value (arrHistory.pop()), push the selected operator,
		// change the operationType and exit
		arrHistory.pop();
		arrHistory.push(symb);
		$screenSmall.innerHTML = arrHistory.join(" ");
		operationType = operation;
		return;
	}

	// if the last action was "=" then clean up arrHistory and the small screen
	if (arrHistory[arrHistory.length - 1] === "&equals;") {
		arrHistory = [];
		$screenSmall.innerHTML = "";
	}


	// if arrHistory is clean
	if (arrHistory.length === 0) {
		if (numInput === "") {
			// check if the value is empty, then set it to 0
			numInput = 0;
		}
		// when user clicks on operator, store the value of numInput at total
		total = parseNum(numInput);
	}


	// parse the input as a number
	numInput = parseNum(numInput);


	if (operant) {
		if (operant === powerNum) {
			if (arrHistory.length < 2) {
				total = operant(numTemp, numInput);
				numInput = total;
				$screen.innerHTML = readable(total);
			}
			else {
				numInput = operant(numTemp, numInput);
				$screen.innerHTML = readable(numInput);
			}
			operant = null;
		}
	}

	// push the value of numInput/total to arrHistory
	arrHistory.push(numInput);
	// push the operator symbol to arrHistory
	arrHistory.push(symb);
	// display the arrHistory on the small screen
	$screenSmall.innerHTML = arrHistory.join(" ");


	if (operationType) {
		// if there is a pending operation
		// do the operation and store it to total
		// and then display it
		total = operationType(total, numInput);
		$screen.innerHTML = readable(total);
	}


	// check if the last operation was "=", if it was, then numInput is total
	if (operation === equality) {
		operationType = null;
		numInput = total;
	} else {
		operationType = operation;
		numInput = "";
	}

	canErase = true;

} // end of doTheMath



/***********************************************************************
**																																		**
**																																		**
**													EVENT LISTENERS														**
**																																		**
**																																		**
***********************************************************************/


// window load
window.onload = function(){
	if (localStorage.grid === "on") {
		document.getElementById("buttons").classList.add("grid");
		$grid.checked = true;
	}
	if (localStorage.theme) {
		for (var tq = 0;  tq < $themePreviews.length; tq += 1) {
			if (localStorage.theme === $themePreviews[tq].dataset.name) {
				$themePreviews[tq].classList.add("selected");
			}
		}
		$container.classList.add(localStorage.theme);
	}
};



// menu button
$menuBtn.addEventListener("click", function(){
	this.classList.toggle("active");
	$menu.classList.toggle("active");
});

// grid on/off switcher
$grid.addEventListener("click", function(){
	if ($grid.checked) {
		localStorage.setItem("grid", "on");
	} else {
		localStorage.removeItem("grid");
	}
	document.getElementById("buttons").classList.toggle("grid");
});

// change themes
for (var tp = 0; tp < $themePreviews.length; tp += 1) {
	$themePreviews[tp].addEventListener("click", function(){
		for (var p = 0; p < $themePreviews.length; p += 1) {
			$themePreviews[p].classList.remove("selected");
		}
		this.classList.add("selected");
		localStorage.setItem("theme", this.dataset.name);
		$container.classList.remove("theme-white", "theme-candy", "theme-blue");
		$container.classList.add(this.dataset.name);
	});
}

// click on a number
for (var i = 0; i < $numbers.length; i += 1) {
	$numbers[i].addEventListener("click", function(){
		if (canErase) {
			numInput = "";
			$screen.innerHTML = "";
			canErase = false;
			if (arrHistory[arrHistory.length - 1] == "&equals;") {
				$screenSmall.innerHTML = "";
				arrHistory = [];
			}
		}

		numInput += this.innerHTML;

		readable(numInput);
	});
}

// click on period
$period.addEventListener("click", function(){
	if (canErase) {
		$screen.innerHTML = "";
		canErase = false;
	}
	if ($screen.innerHTML.indexOf(".") > 0) {
		return $screen.innerHTML += "";
	}
	if ($screen.innerHTML === "") {
		$screen.innerHTML = "0.";
		numInput = "0.";
	} else {
		$screen.innerHTML += ".";
		numInput += ".";
	}
});

// click on clear
$clear.addEventListener("click", function(){
	$screen.innerHTML = "";
	$screenSmall.innerHTML = "";
	numInput = "";
	total = 0;
	operationType = null;
	operant = null;
	numTemp = "";
	arrHistory = [];
});


// click on sign
$sign.addEventListener("click", function(){
	if (arrHistory[arrHistory.length - 1] === "&equals;") {
		if ($screen.innerHTML.indexOf("-") === 0) {
			numInput = $screen.innerHTML.substr(1);
		} else {
			numInput = "-" + $screen.innerHTML;
		}
		arrHistory = [];
		total = 0;
	} else {
		if (numInput.indexOf("-") === 0) {
			numInput = numInput.substr(1);
		} else {
			numInput = "-" + numInput;
		}
	}
	$screen.innerHTML = numInput;
});


// click on plus
$plus.addEventListener("click", function() {
	doTheMath(addNums, "&plus;");
});

// click on minus
$minus.addEventListener("click", function() {
	doTheMath(minusNums, "&minus;");
});

// click on multiply
$multiply.addEventListener("click", function(){
	doTheMath(multiplyNums, "&times;");
});

// click on divide
$divide.addEventListener("click", function(){
	doTheMath(divideNums, "&divide;");
});

// click on power
$power.addEventListener("click", function(){
	doThePower(powerNum, "^");
});

// click on sqr
$sqr.addEventListener("click", function(){
	doTheInstantMath(sqrNum);
});

// click on sqr
$sqrt.addEventListener("click", function(){
	doTheInstantMath(sqrtNum, "");
});

// click on equality
$equality.addEventListener("click", function(){
	doTheMath(equality, "&equals;");
});


// respond to keyboard events
document.addEventListener("keyup", function(event){
	// if the shift key is being pressed
	if (event.shiftKey) {
		switch (event.keyCode) {
			case 54:
				hit("power");
				break;
			case 56:
				hit("multiply");
				break;
		}
	} else {
		switch (event.keyCode) {
			case 48:
			case 96:
				hit("zero");
				break;
			case 49:
			case 97:
				hit("1");
				break;
			case 50:
			case 98:
				hit("2");
				break;
			case 51:
			case 99:
				hit("3");
				break;
			case 52:
			case 100:
				hit("4");
				break;
			case 53:
			case 101:
				hit("5");
				break;
			case 54:
			case 102:
				hit("6");
				break;
			case 55:
			case 103:
				hit("7");
				break;
			case 56:
			case 104:
				hit("8");
				break;
			case 57:
			case 105:
				hit("9");
				break;
			case 27:
			case 67:
				hit("clear");
				break;
			case 107:
			case 187:
				hit("plus");
				break;
			case 109:
			case 189:
				hit("minus");
				break;
			case 110:
			case 190:
				hit("period");
				break;
			case 106:
				hit("multiply");
				break;
			case 111:
			case 191:
				hit("divide");
				break;
			case 13:
				hit("equality");
				break;
		}
	}
});




// The Lumineers - "Stubborn Love"
