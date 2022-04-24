var db, sqlPromise, dataPromise, SQL, buf, db, result
var sqlPromise

async function a() {

    SQL = await initSqlJs({
        // Required to load the wasm binary asynchronously. Of course, you can host it wherever you want
        // You can omit locateFile completely when running in node
        locateFile: file => `Database\\Git\\database\\sql-wasm.wasm`
    });
    var xhr = new XMLHttpRequest();
    xhr.open('GET', "https://raw.githubusercontent.com/KrishFX1/Jarachi/main/Language.sqlite", true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = function (e) {
        var uInt8Array = new Uint8Array(this.response);
        db = new SQL.Database(uInt8Array);
    };
    xhr.send();
}
a()



var input = document.getElementById("input")
input.focus()
var submit = document.getElementById("submit")
var translatedText = document.getElementById("translatedText")
var finalSentence = []



submit.addEventListener("click", (e) => {
    input.value = input.value.toLowerCase().trim()
    if (input.value != null && input.value.length > 0) {
        for (let i = 0; i < input.value.split(" ").length; i++) {

            var translation = ""
            var letters = Array.from(input.value)
            emojis = []  //also include punctuation marks

            for (let k = 0; k < letters.length; k++) {
                var isEmoji = regexChecker(letters[k]) //also include punctuation marks
                if (isEmoji == true) {
                    //a emoji or a punctuation mark 
                    emojis.push(letters[k])
                    letters[k] = "¤" //so that "hi😀bro" would become "hi¤bro" so that could be translated correctly.
                }
            }

            var j = 0
            var words = []
            for (let k = 0; k < letters.length; k++) {
                if (letters[k] == "¤") {
                    j++
                    words[j] = "¤"
                    j++
                } else {
                    if (words[j] === undefined) {
                        words[j] = letters[k]
                    }
                    else {
                        words[j] = words[j] + letters[k]
                    }
                }

            }
            words = words.filter(function (el) {
                return el != null;
            });
            var l = 0;
            for (let k = 0; k < words.length; k++) {

                if (words[k] == "¤") {
                    translation = translation + emojis[l]
                    l++
                } else {
                    translation = translation + EngToJarachi(words[k])
                }
            }
            finalSentence[i] = translation

        }
        translatedText.value = finalSentence[0]
        finalSentence[0] = ''
    }

    input.focus()
    e.preventDefault();
    return false;
})


document.addEventListener("DOMContentLoaded", (e) => {
    translatedText.disabled = "true";
})

let copy = document.getElementById("copy")
copy.addEventListener("click", (e) => {
    navigator.clipboard.writeText(translatedText.value);
    e.preventDefault();
    return false;
})

document.addEventListener("keydown", function (e) {
    if (e.code === "Enter") {  //checks whether the pressed key is "Enter"
        submit.click()
        e.preventDefault();
        return false;
    }
});



function regexChecker(letter) {
    var emojiRegex = /\p{Extended_Pictographic}/ug
    emojiRegex = !!emojiRegex.test(letter)
    var result = !!letter.match(/^[!`@~%$₹'"#^&,*_\)\(\\/>.<\}\{\-_\[\]  ]/)
    if (result == true || emojiRegex == true) {
        return true
    } else {
        return false
    }
}



function EngToJarachi(word) {
    var translatedText
    var result = db.exec(`SELECT * FROM language
WHERE english='${word}';`)
    result.length > 0 ? translatedText = `${db.exec(`SELECT * FROM language
WHERE english='${word}';`)[0].values[0][1]}` : translatedText = "[..]"
    return translatedText
}