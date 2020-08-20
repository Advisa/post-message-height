window.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  console.log('got message', data);

  iframe.height = data.height;

  const listItem = document.createElement('li');
  listItem.innerText = event.data;
  eventslist.prepend(listItem);
}, false);
