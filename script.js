$(document).on('ready', function() {
	var passwordStandard = getUrlVars()['standard'];
	
	if (passwordStandard) {
		//?standard= in URL is set to something
		standardChars = passwordStandard.split('');
		for (var x = 1; x <= 16; x++) {
			var thisStandardChar = standardChars[x - 1];
			thisStandardChar = (thisStandardChar == '+') ? '#' : thisStandardChar;
			if (thisStandardChar && (thisStandardChar == 'a' || thisStandardChar == 'A' || thisStandardChar == '#' || thisStandardChar == '$' || thisStandardChar == '?')) {
				$("span#char_" + x).html(thisStandardChar);
			}
			else {
				$("span#char_" + x).html("_");
			}
		}
	}
	
	generatePassword();
});

$(document).on('click', 'span[id^="char_"]', function() {
	var charType = $(this).text();
	
	switch(charType) {
		//For each character in the standard (16)
		//Change the char type on click to the next one
		case 'A':
			$(this).text('a');
			break;
		case 'a':
			$(this).text('#');
			break;
		case '#':
			$(this).text('$');
			break;
		case '$':
			$(this).html('?');
			break;
		case '?':
			$(this).html('_');
			break;
		case '_':
			$(this).text('A');
			break;
	}
});

function generatePassword() {
	var vocals = ["a", "e", "i", "o", "u", "y"];
	var consonants = ["b", "c", "d", "f", "g", "h", "j", "k", "l", "m", "n", "p", "q", "r", "s", "t", "v", "x", "z"];
	var special = ["!", "#", "%", "&", "(", ")", "$"];
	
	$('#password_div').empty();
	
	for (var x = 0; x < 10; x++) {
		var newPassword = "";
		var prevType = "";
		var prevChar = "";
		var currentChar = "";

		$('span[id^="char_"]').each(function() {
			var charType = $(this).text();

			if (charType.toLowerCase() == "a") {
				//For alpha characters
				if (prevType == "") {
					//The first character can be both a vocal or a consonant
					currentChar = (Math.floor((Math.random() * 2) + 1) == 1) ? vocals[Math.floor(Math.random()*vocals.length)] : consonants[Math.floor(Math.random()*consonants.length)];
				}
				else if (/^[a-zA-Z]+$/.test(prevChar) && $.inArray(prevChar.toLowerCase(), consonants) > -1) {
					//If the previous character were a vocal, make this one a consonant
					currentChar = vocals[Math.floor(Math.random()*vocals.length)]
				}
				else {
					//If the previous character were a consonant, make this one a vocal
					currentChar = consonants[Math.floor(Math.random()*consonants.length)];
				}
				
				//Make it uppercase if the user want it to be
				currentChar = (charType == "A") ? currentChar.toUpperCase() : currentChar;
			}
			else if (charType == "#") {
				//For numbers
				//Do not include 0, can be confused with o
				currentChar = Math.floor((Math.random() * 9) + 1);
			}
			else if (charType == "$") {
				//For special characters
				currentChar = special[Math.floor(Math.random()*special.length)];
			}
			else if (charType == "?") {
				//For random characters
				switch (Math.floor((Math.random() * 3) + 1)) {
					case 1:
						//Create a random consonant or vocal, uppercase or lowercase
						currentChar = (Math.floor((Math.random() * 2) + 1) == 1) ? vocals[Math.floor(Math.random()*vocals.length)] : consonants[Math.floor(Math.random()*consonants.length)];
						currentChar = (Math.floor((Math.random() * 2) + 1) == 1) ? currentChar.toUpperCase() : currentChar;
						break;
					case 2:
						//Make it a number
						currentChar = Math.floor((Math.random() * 9) + 1);
						break;
					case 3:
						//Make it a special character
						currentChar = special[Math.floor(Math.random()*special.length)];
						break;
				}				
			}
			
			newPassword += currentChar; //Append to the new password
			prevChar = currentChar;		//Remember this character
			prevType = charType;		//Remember this type of character
			currentChar = "";			//Reset the current character
		});
		
		//Append new character to page
		$('#password_div').append('<span class="password_suggestion">' + newPassword + '<span><br>');
	}
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}