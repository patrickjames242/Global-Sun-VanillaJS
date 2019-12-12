

const messageWasSentBox = div({className: "message-was-sent-box message-box"},[
    text("Your message has been sent.")
]);

const fillOutAllFieldsBox = div({className: "fill-out-all-fields-box message-box"},[
    text("You must fill out all the fields!")
]);

function getSubmitButton(){
    const selector = "main > .page-bottom-content > .text-input-boxes > .submit-button";
    return document.querySelector(selector);
}

function getAllTextBoxes(){
    const selector = "main > .page-bottom-content > .text-input-boxes > .input-box";
    return document.querySelectorAll(selector);
}

executeWhenDocumentIsLoaded(() => {
    addHeaderAndFooterToDocument(HeaderSelectedItem.contactUs);
    getSubmitButton().addEventListener("click", () => {
        
        messageWasSentBox.remove();
        fillOutAllFieldsBox.remove();

        const allTextBoxes = getAllTextBoxes();
        const allFieldsAreFilled = [...allTextBoxes].filter(e => {
            return e.value.trim() === ""
        }).length === 0;
    
        if (allFieldsAreFilled){
            getSubmitButton().before(messageWasSentBox);
            getAllTextBoxes().forEach(e => e.value = "");
        } else {
            getSubmitButton().before(fillOutAllFieldsBox);
        }
    });
});

