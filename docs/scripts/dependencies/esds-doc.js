// DO NOT EDIT: This file is automatically generated by the project's build task
'use strict';
var Esds = Esds || {};

// Polyfill closest() for IE 11 & Edge 14
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector ||
                                Element.prototype.webkitMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        /* eslint-disable consistent-this */
        var el = this;
        var ancestor = this;
        /* eslint-enable consistent-this */
        if (!document.documentElement.contains(el)) {
            return null;
        }
        do {
            if (ancestor.matches(s)) {
                return ancestor;
            }
            ancestor = ancestor.parentElement;
        } while (ancestor !== null);
        return null;
    };
}


Esds.Utils = function() {
    const getArrayOfDomElements = function getArrayOfDomElements(selector, parent) {
        parent = typeof parent === 'undefined' ? document : parent;
        return Array.prototype.slice.call(parent.querySelectorAll(selector), 0);
    };

    return {
        getArrayOfDomElements: getArrayOfDomElements
    };
}();

'use strict';
var Esds = Esds || {};

Esds.CodeSnippet = function() {
    const copiedClass = 'esds-doc-code-snippet--show-copied-notification';

    function triggerCopiedEvent(snippet) {
        let event;

        if (window.CustomEvent) {
          event = new CustomEvent('esds-doc-code-snippet-copied', {detail: {snippet: snippet}});
        } else {
          event = document.createEvent('CustomEvent');
          event.initCustomEvent('esds-doc-code-snippet-copied', true, true, {snippet: snippet});
        }

        snippet.dispatchEvent(event);
    }

    function triggerCopyErrorEvent(snippet) {

    }

    function triggerCopyNotSupportedEvent(snippet) {

    }

    function copyCodeToClipboard(snippet) {
        const source = snippet.querySelector('.esds-doc-code-snippet__pre code');

        let textarea = document.createElement('textarea');
        textarea.style.height = '0';
        textarea.style.width = '0';
        textarea.style.position = 'absolute';
        textarea.style.left = '-99999px';
        snippet.appendChild(textarea);

        textarea.textContent = source.textContent;
        textarea.select();

        try {
          var successful = document.execCommand('copy');
          if (successful) {
            triggerCopiedEvent(snippet);
          } else {
            triggerCopyErrorEvent(snippet);
          }
          // var msg = successful ? 'successful' : 'unsuccessful';
        } catch (err) {
            triggerCopyNotSupportedEvent(snippet);
          // console.log('Oops, unable to copy');
        }

        snippet.removeChild(textarea);
    }

    function getCopyTriggers() {
        return Esds.Utils.getArrayOfDomElements('.esds-doc-code-snippet__copy-code-wrap');
    }

    function getSnippets() {
        return Esds.Utils.getArrayOfDomElements('.esds-doc-code-snippet');
    }

    function handleSuccessfulCopy(e) {
        const snippet = e.target;
        snippet.classList.add(copiedClass);
    }

    function resetCopiedState(snippet) {
        snippet.classList.remove(copiedClass);
    }

    function handleCopyButtonClick(e) {
        const trigger = e.target,
                snippet = trigger.closest('.esds-doc-code-snippet');
        resetCopiedState(snippet);
        copyCodeToClipboard(snippet);
    }

    function enableCopyFunctionality() {
        const triggers = getCopyTriggers();
        triggers.forEach(function(t){
            t.addEventListener('click', handleCopyButtonClick);
        });
    }

    function setCopiedListeners() {
        const snippets = getSnippets();
        snippets.forEach(function(s){
            s.addEventListener('esds-doc-code-snippet-copied', handleSuccessfulCopy);
        });
    }

    // Saving tab functionality for a future release
    // function initializeTabs() {
    //     const tabs = document.querySelectorAll('.esds-doc-code-snippet__tabs');
    //     tabs.forEach(function(t){
    //         const snippet = t.closest('.esds-doc-code-snippet');
    //     });
    // }

    let init = function init() {
        enableCopyFunctionality();
        setCopiedListeners();
        // initializeTabs();
    };

    return {
        init: init
    };
}();

/* global scrollMonitor */

'use strict';
var Esds = Esds || {};

Esds.PageNavigation = function() {
    const pageNavigationSelector = ".esds-doc-page-navigation",
            pageNavigationListSelector = ".esds-doc-page-navigation__inner",
            listItemTemplateSelector = ".esds-doc-page-navigation__item--template",
            listItemLinkSelector = ".esds-doc-page-navigation__link",
            listItemLinkActiveClass = "esds-doc-page-navigation__link--active",
            anchorLinkTargetDataAttribute = "data-esds-doc-anchor-link-target-selector",
            fixedDistanceFromTopDataAttribute = "data-esds-doc-fixed-distance-from-top",
            pageNavigationFixedClass = "esds-doc-page-navigation--fixed",
            suppressScrollMonitoringClass = "esds-doc-page-navigation--no-scroll-monitor";

    let pageNavigationComponents,
        listItemTemplate,
        listItemModifierClasses = false;

    function getArrayOfDomElements(selector, parent) {
        parent = typeof parent === 'undefined' ? document : parent;
        return Array.prototype.slice.call(parent.querySelectorAll(selector), 0);
    }

    function getListItemModifierClasses() {
        const pageNavigation = document.querySelector(pageNavigationSelector);
        let modifierClasses = false;
        if (pageNavigation && pageNavigation.dataset['esds-doc-list-item-modifier-classes']) {
            modifierClasses = JSON.parse(pageNavigation.dataset['esds-doc-list-item-modifier-classes']);
        }

        return modifierClasses;
    }

    function getPageNavigationComponents() {
        return getArrayOfDomElements(pageNavigationSelector);
    }

    function getListItemId(anchorLinkItem) {
        let initialId = anchorLinkItem.getAttribute('id') === null ? anchorLinkItem.textContent : anchorLinkItem.getAttribute('id'),
            listItemId = initialId.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        listItemId = !isNaN(parseInt(listItemId.charAt(0), 10)) ? 'page-section-' + listItemId : listItemId; // If the header starts with a number, prefix it a string

        return listItemId;
    }

    function assignListItemIdToAnchorLinkItem(listItemId, anchorLinkItem) {
        anchorLinkItem.setAttribute('id', listItemId);
    }

    function createListItemElement(template, anchorLinkItem) {
        let listItemId = getListItemId(anchorLinkItem),
            href = '#' + listItemId,
            listItemElement = template.cloneNode(true),
            listItemLink = listItemElement.querySelector(listItemLinkSelector);
        listItemLink.setAttribute('href', href);
        listItemLink.textContent = anchorLinkItem.textContent;
        assignListItemIdToAnchorLinkItem(listItemId, anchorLinkItem);
        return listItemElement;
    }

    function getListItemTemplate(pageNavigation) {
        let domTemplate = pageNavigation.querySelector(listItemTemplateSelector),
            clonedTemplate = domTemplate.cloneNode(true); // Clone the template to a new element

        domTemplate.parentNode.removeChild(domTemplate); // Remove the template from the DOM
        clonedTemplate.classList.remove(listItemTemplateSelector); //Remove the --template class

        return clonedTemplate;
    }

    function buildPageNavigationListItems(pageNavigation) {
        const anchorLinkTargetSelector = pageNavigation.getAttribute(anchorLinkTargetDataAttribute),
            anchorLinkItems = anchorLinkTargetSelector === null ? false : getArrayOfDomElements(anchorLinkTargetSelector),
            pageNavigationList = pageNavigation.querySelector(pageNavigationListSelector);

        if (anchorLinkItems) {
            listItemTemplate = getListItemTemplate(pageNavigation);
            anchorLinkItems.forEach(function(ali) {
                let listItem = createListItemElement(listItemTemplate, ali);
                if (listItemModifierClasses) {
                    const selectors = Object.keys(listItemModifierClasses);
                    const match = selectors.find(s => ali.matches(s));
                    if (match) {
                        const modifierClasses = listItemModifierClasses[match].split(' ');
                        modifierClasses.forEach(c => {
                            listItem.classList.add(c);
                        });
                    }
                }
                pageNavigationList.appendChild(listItem);
            });
        }
    }

    function setWrapperWidth(pageNavigation) {
        const navWidth = pageNavigation.offsetWidth,
                fixedPositionList = pageNavigation.querySelector(pageNavigationListSelector);
        pageNavigation.style.width = navWidth;
        fixedPositionList.style.width = navWidth;
    }

    function setFixedPosition(pageNavigation, elementWatcher) {
        if (elementWatcher.isAboveViewport && !pageNavigation.classList.contains(pageNavigationFixedClass)) {
            pageNavigation.classList.add(pageNavigationFixedClass);
        } else if (!elementWatcher.isAboveViewport && pageNavigation.classList.contains(pageNavigationFixedClass)) {
            pageNavigation.classList.remove(pageNavigationFixedClass);
        }
    }

    function monitorPageNavigationFixedStatus(pageNavigation) {
        const distanceFromTop = getTopOffset(pageNavigation),
            elementWatcher = scrollMonitor.create(pageNavigation, {top: distanceFromTop});

        setFixedPosition(pageNavigation, elementWatcher);
        elementWatcher.stateChange(function(){
            setFixedPosition(pageNavigation, elementWatcher);
        });
    }

    function scrollMonitoringEnabled(pageNavigation) {
        return !pageNavigation.classList.contains(suppressScrollMonitoringClass);
    }

    function disableScrollMonitoring(pageNavigation) {
        pageNavigation.classList.add(suppressScrollMonitoringClass);
    }

    function enableScrollMonitoring(pageNavigation) {
        pageNavigation.classList.remove(suppressScrollMonitoringClass);
    }

    function setListItemActive(linkHref) {
        const activeLink = document.querySelector(".esds-doc-page-navigation a[href='" + linkHref + "']"),
                pageNavigation = activeLink.closest(pageNavigationSelector),
                highlightedLinks = getArrayOfDomElements("." + listItemLinkActiveClass, pageNavigation);

        highlightedLinks.forEach(function(link){
            link.classList.remove(listItemLinkActiveClass);
        });

        activeLink.classList.add(listItemLinkActiveClass);
    }

    function getTopOffset(pageNavigation) {
        const topOffset = pageNavigation.getAttribute(fixedDistanceFromTopDataAttribute);
        return topOffset === null ? 0 : topOffset;
    }

    function monitorPageSectionsForActiveLinkHighlighting(pageNavigation, debug) {
        const pageAnchorLinks = pageNavigation.querySelectorAll(listItemLinkSelector),
                topOffset = getTopOffset(pageNavigation);

        for (var i = 0; i < pageAnchorLinks.length; i++) {
            let anchorLink = pageAnchorLinks[i],
                targetHref = anchorLink.getAttribute('href'),
                target = document.querySelector(targetHref),
                nextAnchorLink = pageAnchorLinks[i + 1],
                nextTargetHref = typeof nextAnchorLink === 'undefined' ? false : nextAnchorLink.getAttribute('href'),
                nextTarget = nextTargetHref ? document.querySelector(nextTargetHref) : false,
                sectionTop = target.offsetTop - topOffset,
                sectionBottom = nextTarget ? nextTarget.offsetTop - 1 - topOffset : document.body.offsetHeight,
                elementWatcher = scrollMonitor.create({top: sectionTop, bottom: sectionBottom});

            // When a section spans the entire viewport
            elementWatcher.stateChange(function(){
                if (scrollMonitoringEnabled(pageNavigation) && elementWatcher.isAboveViewport && elementWatcher.isBelowViewport) {
                    setListItemActive(targetHref);
                }
            });

            // Scroll Down Behavior
            elementWatcher.partiallyExitViewport(function(){
                if (elementWatcher.isAboveViewport) {
                    if (scrollMonitoringEnabled(pageNavigation) && nextTarget) {
                        // When one section exits the viewport at the top, set the next section's header to be active
                        setListItemActive(targetHref);
                    }
                }
            });

            // Scroll Up Behavior
            elementWatcher.enterViewport(function(){
                if (!elementWatcher.isBelowViewport) {
                    if (scrollMonitoringEnabled(pageNavigation)) {
                        setListItemActive(targetHref);
                    }
                }
            });

            // Highlight the last item in the nav when the last section is fully scrolled into view
            if (!nextTarget) {
                elementWatcher.fullyEnterViewport(function(){
                   if (scrollMonitoringEnabled(pageNavigation)) {
                       setListItemActive(targetHref);
                   }
                });
            }

            if (debug) {
                // Adds horizontal lines to the top and bottom of each section for debugging
                generatePageSectionMarkers(sectionTop, sectionBottom);
            }
        }
    }

    function generatePageSectionMarkers(topPosition, bottomPosition) {
        let topMarker = document.createElement('div'),
            bottomMarker = document.createElement('div');

        topMarker.style.width = "100%";
        topMarker.style.height = "1px";
        topMarker.style.backgroundColor = "red";
        topMarker.style.position = "absolute";
        topMarker.style.left = 0;
        topMarker.style.top = topPosition;

        bottomMarker.style.width = "100%";
        bottomMarker.style.height = "1px";
        bottomMarker.style.backgroundColor = "blue";
        bottomMarker.style.position = "absolute";
        bottomMarker.style.left = 0;
        bottomMarker.style.top = bottomPosition;


        document.body.appendChild(topMarker);
        document.body.appendChild(bottomMarker);
    }

    function initiateScrollMonitoring(pageNavigation, debug) {
        monitorPageNavigationFixedStatus(pageNavigation);
        monitorPageSectionsForActiveLinkHighlighting(pageNavigation, debug);
    }

    function smoothScrollToSection(sectionSelector, pageNavigation) {
        const pageSection = document.querySelector(sectionSelector),
            topOffset = getTopOffset(pageNavigation),
            scrollPosition = pageSection.offsetTop - topOffset;

        disableScrollMonitoring(pageNavigation);
        window.scroll({
            top: scrollPosition,
            left: 0,
            behavior: 'smooth'
        });
        // Brittle, but browser-native .scrollIntoView doesn't provide any callback mechanism
        setTimeout(function(){
            enableScrollMonitoring(pageNavigation);
        }, 500);
    }

    function initiateSoftScrollOnClick(pn) {
        const links = getArrayOfDomElements(listItemLinkSelector, pn);

        links.forEach(function(l){
            l.addEventListener('click', function(e){
                e.preventDefault();

                const href = this.hash;

                setListItemActive(href);
                history.pushState(null, null, href);
                smoothScrollToSection(href, pn);
            });
        });
    }

    function setDefaultActiveLink(pageNavigation) {
        if (window.location.hash.length !== 0) {
            const hash = window.location.hash;
            setListItemActive(hash);
            smoothScrollToSection(hash, pageNavigation);
        } else {
            // If no hash is set in the URL, highlight the first item in the navigation to start
            const links = getArrayOfDomElements(listItemLinkSelector, pageNavigation);
            setListItemActive(links[0].getAttribute('href'));
        }
    }

    function initializePageNavigationComponents(debug) {
        listItemModifierClasses = getListItemModifierClasses();
        pageNavigationComponents = getPageNavigationComponents();

        pageNavigationComponents.forEach(function(pn){
            buildPageNavigationListItems(pn);
            setWrapperWidth(pn);
            initiateScrollMonitoring(pn, debug);
            initiateSoftScrollOnClick(pn);
            setDefaultActiveLink(pn);
        });
    }

    let init = function init(debug) {
        debug = typeof debug === 'undefined' ? false : debug;
        setTimeout(function() {
            initializePageNavigationComponents(debug);
        }, 500); // set a small delay before initializing the page nav to ensure the layout has fully loaded and Page Section Scroll Markers are calculated accurately
    };

    return {
        init: init
    };
}();
