
class SlideUpSentence extends NodeController{

    constructor(sentenceString){
        super(sentenceString);
    }

    animateAllWordsUp(delayInSeconds = 0){
        const action = () => {
            for (let i = 0; i < this.wordControllers.length; i++){
                const word = this.wordControllers[i];
                word.animateUp(i * 0.1);
            }
        };

        if (delayInSeconds === undefined){
            action();
        } else {
            setTimeout(() => {
                action();
            }, delayInSeconds * 1000);
        }
        
    }

    static getNewProperties(sentenceString){
        const properties = {};
        const wordStrings = sentenceString.split(" ");
        properties.wordControllers = wordStrings.map((ws) => new SlideUpWord(ws));
        properties.node = div({className: "animate-up-words-box"},[
            ...properties.wordControllers.map((c) => c.node)
        ])
        return properties;
    }

}

class SlideUpWord extends NodeController {

    constructor(wordText) {
        super(wordText);
    }

    animateUp(delayInSeconds = 0) {
        this.word.style.transitionDelay = delayInSeconds + "s"
        this.word.style.transform = "initial";
    }

    static getNewProperties(wordText) {
        const properties = {};
        properties.node = div({className: "word-box-holder"}, [
            properties.word = div({ className: "word-box"}, [
                text(wordText)
            ])
        ])
        return properties;
    }

}

executeWhenDocumentIsLoaded(() => {
    const sentence = new SlideUpSentence("Solutions at the Speed of Life");
    // sentence.node.addClass("title");
    document.querySelector(".title").append(sentence.node);
    sentence.animateAllWordsUp(0.3);
    
    addHeaderAndFooterToDocument(HeaderSelectedItem.home);
});

