document.addEventListener('DOMContentLoaded', function() {

    const textEditor = document.querySelector(".text-editor")
    // const textSize = document.querySelector(".text-size")
    const spellcheckBtn = document.querySelector(".spellcheck-btn")
    const showCodeBtn = document.querySelector(".show-code")
    const toolbarButtons = document.querySelectorAll(".toolbar button[data-command]")
    const toolbarInputs = document.querySelectorAll(".toolbar input:not([type='range'])")
    const toolbarSelects = document.querySelectorAll(".toolbar select")
    const fontFamilySelectorOptions = document.querySelectorAll(".font-family-selector option")
    const fontFamilySelector = document.querySelector(".font-family-selector")
    const wordCounter = document.querySelector(".info-bar .word-counter")
    const spellchecker = document.querySelector(".info-bar .spellchecker")

    const categoryButtons = document.querySelectorAll(".category-btn")

    const toolbars = document.querySelectorAll(".toolbar")

    const documentNameInput = document.querySelector(".file-name-input")
    


    //-------------------------------- Init the text editor -------------------------------\\

    document.title = documentNameInput.value + " - Toto Notes"

    documentNameInput.addEventListener("keyup", function(){

        document.title = documentNameInput.value + " - Toto Notes"
        console.log(documentNameInput.value + " - Toto Notes")

    })


    spellcheckBtn.style.backroudColor = "red";

    // Load all the font families aviable on the browser
    function listFontFamilies() {
        const fontFaces = [document.fonts.values()];
        const families = fontFaces.map(font => font.family);
      
        // converted to set then to array to remove duplicates
        return new Set(families);
    }

    // console.log(listFontFamilies())


    // Default font
    fontFamilySelector.value = "arial"
    fontFamilySelector.style.fontFamily = fontFamilySelector.value
    textEditor.style.fontFamily = fontFamilySelector.value


    // Display font with the correct font family in the font select
    fontFamilySelectorOptions.forEach(option => {
        option.style.fontFamily = option.value
    })

    // Statistics
    wordCounter.innerHTML = "0 word"
    spellchecker.innerHTML = textEditor.spellcheck

    document.execCommand('defaultParagraphSeparator', false, '#text');
    document.execCommand("styleWithCSS", false, "true")


    //------------------------------------------------ Change-Menu-Category -------------------------------------------\\

    categoryButtons.forEach(button => {
        button.addEventListener("click", function() {
            
            // Hide all toolbars if it is not the menu
            toolbars.forEach(toolbar => {
                if(toolbar.classList.contains("toolbar-"+button.value.trim(" "))){
                    toolbar.style.display = "flex";

                }else{
                    toolbar.style.display = "none";}
            })
            
        })
    })

    //----------------------------------------------- Change-margin -------------------------------------------\\

    const marginLeftRange = document.querySelector(".margin-left")
    const marginRightRange = document.querySelector(".margin-right")
    const marginTopRange = document.querySelector(".margin-top")
    const marginBottomRange = document.querySelector(".margin-bottom")
    marginLeftRange.value = 2.5
    marginRightRange.value = 2.5
    marginTopRange.value = 2.5
    marginBottomRange.value = 2.5

    marginLeftRange.addEventListener("change", function() {
        var value = marginLeftRange.value
        textEditor.style.paddingLeft = value + "cm"
        marginLeftRange.max = 18.5 - marginRightRange.value - 1.5
    })

    marginRightRange.addEventListener("change", function() {
        var value = marginRightRange.value
        textEditor.style.paddingRight = value + "cm"
        marginRightRange.min = 0 + marginLeftRange.value + 1.5
    })

    marginTopRange.addEventListener("change", function() {
        var value = marginTopRange.value
        textEditor.style.paddingTop = value + "cm"
        marginTopRange.min = 0 + marginBottomRange.value + 1.5
    })

    marginBottomRange.addEventListener("change", function() {
        var value = marginBottomRange.value
        textEditor.style.paddingBottom = value + "cm"
        marginBottomRange.max = 18.5 - marginTopRange.value + 1.5
    })




    //----------------------------------------------- Spell-Check -------------------------------------------\\


    spellcheckBtn.addEventListener("click", function(){
        textEditor.setAttribute("spellcheck", !textEditor.spellcheck)
        if(textEditor.spellcheck){
            console.log("Oui !")
            spellcheckBtn.classList.add("active")
        } else {
            console.log("Non !")
            spellcheckBtn.classList.remove("active")
        }
        spellchecker.innerHTML = textEditor.spellcheck
    })



    //------------------------------------- Show-Code ---------------------------------------------\\

    var showCode = showCodeBtn.classList.contains("active")
    showCodeBtn.addEventListener("click", function(){
        console.log(textEditor.innerHTML)
        showCode = !showCode
        if(showCode){
            showCodeBtn.classList.add("active")
            textEditor.classList.add("pre")
            textEditor.textContent = textEditor.innerHTML
            // textEditor.innerHTML = "<pre>" + textEditor.innerHTML + "</pre>"
            // textEditor.textContent = textEditor.textContent
        } else {
            showCodeBtn.classList.remove("active")
            textEditor.classList.remove("pre")
            textEditor.innerHTML = textEditor.textContent
        }
    })




    //----------------------------------- Check-the-format-of-the-selection --------------------------------\\
        // Exemple if the text is bold, the bold button will be pressed otherwise released
    textEditor.addEventListener("click", function() {
        checkFormat()
    })

    textEditor.addEventListener("keyup", function() {
        checkFormat()
    })

    toolbarButtons.forEach(button => {
        button.addEventListener("click", function(){
            
            var tag = button.dataset['command']
            if(tag){
                if(tag == "createLink" || tag == "insertImage"){
                    var url = prompt("Url :", "")
                    document.execCommand(tag, false, url)
                }
                else{

                    document.execCommand(tag)
                }

                checkFormat()
            }
        })
    })

    toolbarInputs.forEach(input => {
        input.addEventListener("change", function(){
            // console.log(tag, value)
            var tag = input.dataset['command']
            if(tag){
                var value = input.value

                document.execCommand(tag, false, value)

                checkFormat()
            }
        })
    })

    toolbarSelects.forEach(select => {
        select.addEventListener("change", function(){
            
            var tag = select.dataset['command']
            if(tag){
                var value = select.value

                if(tag == "fontName"){
                    fontFamilySelector.style.fontFamily = value
                }

                document.execCommand(tag, false, value)

                checkFormat()
            }
        })
    })

    // Update the toolbar's buttons/inputs/selects depending of the format of the selection
    function checkFormat(){
        toolbarButtons.forEach(button => {
            format = button.dataset["command"]
            if(isFormatted(format)){
                button.classList.add("active")
            } else {
                button.classList.remove("active")
            }
        })

        toolbarInputs.forEach(input => {
            element = input.dataset["element"]
            if(getValue(element)){
                value = getValue(element)
                if(value.slice(0, 3) == "rgb"){
                    value = value.replace("rgb(", '')
                    value = value.replace(")", '')
                    value = value.split(", ")
                    input.value = RGBtoHex(parseInt(value[0], 10), parseInt(value[1], 10), parseInt(value[2], 10))
                }
            }
        })        

        toolbarSelects.forEach(select => {
            command = select.dataset["command"]
            if(getValue(command)){
                value = getValue(command).toLowerCase()
                value = value.replaceAll('"', " ") // Replace '"' (quote) by "" (none) when the font name is various words
                value = value.trim(" ")
                select.value = value
                }
            }
        )
    }

    // Convert RGB to hex
    function RGBtoHex(red, green, blue) {
        hexadecimal = "#"
        Array(red, green, blue).forEach(color =>{
            colorInHex =  color.toString(16);
            hexadecimal += colorInHex.length == "1" ? "0" + colorInHex : colorInHex
        })
        return hexadecimal;
    }

    // Return if the selection repect the format
    function isFormatted(format) {
        var correctFormat = false;
        if(document.queryCommandState) {
            correctFormat = document.queryCommandState(format);
            // console.log(document.queryCommandState("a"))
        }
        return correctFormat;
    }

    // Return the value of the selection depending the element
    function getValue(element) {
        var value = null;
        if(document.queryCommandValue) {
            value = document.queryCommandValue(element);
        }
        return value;
    }

    // Can click on links if Ctrl + clic
    textEditor.addEventListener("mouseover", function() {
        const a = textEditor.querySelectorAll('a')
        a.forEach(link => {
            link.addEventListener("mouseover", function() {
                textEditor.addEventListener("keydown", function(event){
                    if(event.key == "Control"){
                        textEditor.setAttribute("contenteditable", false)
                        link.style.cursor = "pointer"
                    } else {
                        textEditor.setAttribute("contenteditable", true)
                        link.style.cursor = "text"                        
                    }
                })
            })

            link.addEventListener("mouseleave", function() {
                textEditor.setAttribute("contenteditable", true)
                link.style.cursor = "initial"
            })
        })
    })   



    //----------------------------------- Update-statistics --------------------------------\\
    
    textEditor.addEventListener("keyup", function() {
        // textEditor.innerHTML.replace('<br>', " ")
        // console.log(textEditor.innerText)
        var content = textEditor.innerText.replaceAll('\n', " ")
        content = content.split(" ")

        // Removing all "" empty entries
        content = content.filter(function(item) {
            return item !== ""
        })
        
        var numberOfWords = content.length      
        
        wordCounter.innerHTML = numberOfWords + " word" + (numberOfWords > 1 ? "s" : "")
    })




    //----------------------------------- Save-file --------------------------------\\

    
    const saveButtons = document.querySelectorAll(".save-as-btn")
    saveButtons.forEach(button => {
        button.addEventListener("click", function() {
            save(button.value)
        })
    })

    function save(value) {
        if(value == "txt"){
            const blob = new Blob([textEditor.innerText])
            const url = URL.createObjectURL(blob)
            const link = document.createElement("a")
            link.href = url
            link.download = `${documentNameInput.value}.txt`
            link.click()
            link.remove()
        } else if(value == "pdf"){
            html2pdf(textEditor).save(documentNameInput.value)
        }   
    }



    //----------------------------------- Print-document --------------------------------\\

    const printBtn = document.querySelector(".toolbar .print-btn")
    printBtn.addEventListener("click", printDocument)

    function printDocument(){
        a = window.open()
        a.document.body.innerHTML = textEditor.innerHTML
        a.document.body.style.fontFamily = "Arial"
        a.print()
    }


    const showAllBtn = document.querySelector(".toolbar .show-all-btn")
    showAll = false
    showAllBtn.addEventListener("click", function(){
        showAll = !showAll
        if(showAll){
            a = textEditor.innerText
            a = a.replaceAll(" ", "•")
            a = a.replaceAll("\n", "¶\n")
            console.log(a)
            textEditor.innerText = a
            showAllBtn.classList.add("active")
        }
        else {
            a = textEditor.innerText
            a = a.replaceAll("•", " ")
            a = a.replaceAll("¶", "\n")
            textEditor.innerText = a
            showAllBtn.classList.remove("active")
        }



    })
    


})




