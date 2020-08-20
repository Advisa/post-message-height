let previousHeight;
let bodyOffset = 0;

const getBodyOffset = () => {
  const bodyStyle = getComputedStyle(document.body);
  return (
    parseInt(bodyStyle.marginTop) + parseInt(bodyStyle.marginBottom) +
    parseInt(bodyStyle.paddingTop) + parseInt(bodyStyle.paddingBottom) +
    parseInt(bodyStyle.borderTopWidth) + parseInt(bodyStyle.borderBottomWidth)
  );
}

const postHeight = () => {
  const newHeight = document.body.scrollHeight + getBodyOffset();
  if (previousHeight !== newHeight) {
    const data = {
      height: newHeight,
    };
    window.parent.postMessage(JSON.stringify(data), '*');
    previousHeight = newHeight;
  }
};

const visibleDomMutation = (mutationsList) => {
  const domHasVisiblyMutated = mutationsList.some((mutationRecord) => {
    switch (mutationRecord.type) {
      case 'childList':
        return true;
      case 'attributes':
        switch (mutationRecord.attributeName) {
          // Add cases for any other attributes that may affect scroll
          case 'style':
          case 'class':
            return true;
          default:
            return false;
        }
      default:
        return false;
    }
  });

  if (domHasVisiblyMutated) {
    postHeight();
  }
};

const scrollHeightObserver = () => {
  if (typeof window !== 'undefined') {
    const observer = new MutationObserver(visibleDomMutation);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
    });

    window.addEventListener('resize', postHeight);
  }
};

window.addEventListener('load', (event) => {
  bodyOffset = getBodyOffset();
  postHeight();
  scrollHeightObserver();
});
