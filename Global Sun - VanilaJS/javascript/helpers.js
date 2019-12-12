

[

    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "br",
    "div",
    "span",
    "p",
    "a",
    "section",
    "main",
    "header",
    "footer",
    "form",
    "input",
    "img",
    "textarea"
].forEach((tag) => {

    window[tag] = function (config, children) {


        if (config === undefined) {
            throw new Error("the config object is required");
        }

        const newEl = document.createElement(tag);

        if (config.className !== undefined) {
            newEl.className = config.className;
        }

        if (children !== undefined && children[Symbol.iterator] !== undefined) {
            newEl.append(...children);
        }

        const attributeKeys = Object.keys(config).filter((att) => {
            return att !== "className";
        });

        for (const key of attributeKeys) {
            newEl.setAttribute(key, arguments[0][key]);
        }

        return newEl;
    }

});

window.text = function text(string) {
    return new Text(string);
}








class NodeController {

    constructor() {
        const newProperties = this.__proto__.constructor.getNewProperties(...arguments);
        if ((newProperties.node instanceof Node) === false) {
            throw new Error("the getNewProperties function of a node controller must provide a property 'node' which is an instance of, or an instance of a subclass of Node");
        }
        Object.assign(this, newProperties);

        // to hold the NodeController in memory for as long as the node is being held.
        this.node.controller = this;
    }

    nodeWasAddedToDocument() {

    }

    nodeWasRemovedFromDocument() {

    }

    // must, at at the very least, contain a property 'node' which is to be the node this NodeController will control.
    static getNewProperties() {
        return {};
    }

}



(() => {

    const observer = new MutationObserver(records => {

        const NodeCheckingPurpose = {
            FOR_ADDITION: Symbol("addition"),
            FOR_REMOVAL: Symbol("removal")
        }

        function checkNode(node, purpose) {
            const controller = node.controller;

            if (controller instanceof NodeController) {
                switch (purpose) {
                    case NodeCheckingPurpose.FOR_ADDITION:
                        controller.nodeWasAddedToDocument();
                        break;
                    case NodeCheckingPurpose.FOR_REMOVAL:
                        controller.nodeWasRemovedFromDocument();
                        break;
                }
            }

            for (const child of node.childNodes) {
                checkNode(child, purpose);
            }

        }

        for (const record of records) {
            for (const addedNode of record.addedNodes) {
                checkNode(addedNode, NodeCheckingPurpose.FOR_ADDITION);
            }
            for (const removedNode of record.removedNodes) {
                checkNode(removedNode, NodeCheckingPurpose.FOR_REMOVAL);
            }
        }
    });

    observer.observe(document, { childList: true, subtree: true });

})();









class Notification {

    constructor() {
        let listeners = {};

        this.post = function () {
            for (const sender of Object.getOwnPropertySymbols(listeners)) {
                listeners[sender](...arguments);
            }
        }

        this.listen = function (sender, listener) {
            if (typeof listener !== "function") {
                throw new Error("the listener must be a function!!")
            }
            listeners[sender] = listener;
        }

        this.anonymousListen = function (listener) {
            this.listen(Symbol(), listener);
        }

        this.removeListener = function (sender) {
            delete listeners[sender];
        }
    }
}

// posted whenever the dom is finished loading
const documentDidLoadNotification = new Notification();

// posted whenever the body or any of its decendents is added or removed. when posted, it includes the array of MutationRecord objects in the parameter.
const documentBodyDidChangeNotification = new Notification();


// posted whenever the size of the window changes
const windowSizeDidChangeNotification = new Notification();

(() => {
    window.onresize = () => {
        windowSizeDidChangeNotification.post();
    };
})();


(() => {
    let shouldPostDocumentDidLoadNotificaiton = true;

    document.addEventListener("readystatechange", () => {
        if (shouldPostDocumentDidLoadNotificaiton === false ||
            document.readyState === "loading") { return; }
        shouldPostDocumentDidLoadNotificaiton = false;
        documentDidLoadNotification.post();
    });
})()



function executeWhenDocumentIsLoaded(action) {
    if (document.readyState === "loading") {
        const symbol = Symbol("notification")
        documentDidLoadNotification.listen(symbol, () => {
            action();
            documentBodyDidChangeNotification.removeListener(symbol);
        });
    } else {
        action();
    }
}

executeWhenDocumentIsLoaded(() => {
    const observer = new MutationObserver((records) => {
        documentBodyDidChangeNotification.post(records);
    });
    observer.observe(document.body, { childList: true, subtree: true });
})





// accepts multiple string arguments, each representing a class that is to be added to the node.
Node.prototype.addClass = function () {
    for (const arg of arguments) {
        this.classList.add(arg);
    }
    return this;
}


const HeaderSelectedItem = {
    home: Symbol(),
    aboutUs: Symbol(),
    contactUs: Symbol(),
    services: Symbol(),
    portfolio: Symbol(),
    blog: Symbol()
}

function addHeaderAndFooterToDocument(headerSelectedItem) {
    if (headerSelectedItem === undefined) {
        throw new Error("the headerSelectedItem parameter must be provided");
    }

    const home = a({ href: "index.html" }, [text("home")]);
    const aboutUs = a({ href: "about-us.html" }, [text("about us")]);
    const contactUs = a({ href: "contact-us.html" }, [text("contact us")]);
    const services = a({ href: "services.html" }, [text("services")]);
    const portfolio = a({ href: "portfolio.html" }, [text("portfolio")]);
    const blog = a({ href: "blog.html" }, [text("news")]);

    const selectedLink = (() => {
        switch (headerSelectedItem) {
            case HeaderSelectedItem.home: return home;
            case HeaderSelectedItem.aboutUs: return aboutUs;
            case HeaderSelectedItem.contactUs: return contactUs;
            case HeaderSelectedItem.services: return services;
            case HeaderSelectedItem.portfolio: return portfolio;
            case HeaderSelectedItem.blog: return blog;
        }
    })();

    selectedLink.addClass("selected");

    const headerNode = div({ className: "nav-bar-holder" }, [
        div({ class: "nav-bar" }, [
            img({ className: "global-sun-logo", src: "../assets/global-sun-logo.png" }),
            div({ className: "right-links" }, [
                home,
                aboutUs,
                services,
                portfolio,
                blog,
                contactUs,
            ])
        ])
    ]);

    const footerNode = footer({}, [
        div({ className: "arc-box" }),
        div({ className: "content" }, [
            p({ className: "stay-in-touch-text" }, [
                text("Stay in Touch With Us!")
            ]),
            div({ className: "social-media-logos" }, [
                a({ className: "facebook-logo rise-on-hover", href: "https://www.facebook.com/globalsunintegration/", target: "_blank" }, [
                    img({ src: "../assets/social-media-icons/facebook.svg" })
                ]),
                div({ className: "twitter-logo rise-on-hover" }, [
                    img({ src: "../assets/social-media-icons/twitter.svg" })
                ]),
                a({ className: "linkedin-logo rise-on-hover", href: "https://in.linkedin.com/company/global-sun-bahamas", target: "_blank" }, [
                    img({ src: "../assets/social-media-icons/linkedin.svg" })
                ]),
                a({ className: "email-logo rise-on-hover", href: "mailto:info@globalsunintegration.com", target: "_blank" }, [
                    img({ src: "../assets/social-media-icons/email.svg" })
                ]),
            ]),
            p({ className: "bottom-small-text" }, [
                text("© 2019 Global Sun Integration Management"),
                br({}),
                text("Powered by: DevDigital: Nashville Software Development")
            ])
        ])
    ]);


    const mainElement = document.querySelector("main");
    mainElement.before(headerNode);
    mainElement.after(footerNode);

}


