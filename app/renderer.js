// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
console.log(
  "%cJEFFe MSC Map",
  "background-color: #e0005a ; color: #ffffff ; font-weight: bold ; padding: 4px ;"
);
console.log(
  "%cÄlä riko",
  "display: inline-block ; background-image: url( 'https://bennadel.github.io/JavaScript-Demos/demos/console-log-css/rock.png' ) ; " +
  "background-size: cover ; padding: 10px 175px 158px 10px ; color: black;" +
  "border: 2px solid black ; font-size: 11px ; line-height: 11px ; " +
  "font-family: monospace ;"
);

const { ipcRenderer } = require('electron')
// console.log(ipcRenderer.sendSync('synchronous-message', 'ping')) // prints "pong"

const nimi = document.querySelector('#nimi')
const väri = document.querySelector('#väri')
const id = document.querySelector('#id')
const osoite = document.querySelector('#osoite')

const start = document.querySelector('#start')
const stop = document.querySelector('#stop')
const update = document.querySelector('#update')

start.addEventListener('click', startHandler)
stop.addEventListener('click', stopHandler)
update.addEventListener('click', updateHandler)

setInterval(() => {
  document.querySelector('#status').innerHTML = window.status
  document.querySelector('#coordinates').innerHTML = JSON.stringify(window.coordinates) ? JSON.stringify(window.coordinates) : "Käynnistä masiina"
  document.querySelector('#socket').innerHTML = `Socket: ${window.socketConn}`
  ipcRenderer.send('coordinates')
  ipcRenderer.send('socketConnected')
}, 2000);

function updateHandler () {
  const osoite2 = osoite.value
  ipcRenderer.send('setUrl', osoite2)
}

function startHandler () {
  console.log(nimi, väri, id)
  if (!nimi.value && !väri.value && !id.value) return
  ipcRenderer.send('start', JSON.stringify({name: nimi, color: väri, id: id}))
}

function stopHandler () {
  ipcRenderer.send('stop')
  console.log("stop")
}


ipcRenderer.on('reply', (event, arg) => {
  window.status = arg[0]
  console.log(window.status)
  console.log(arg) // prints "pong"
})

ipcRenderer.on('coordinatesGet', (event, arg) => {
  // console.log(arg)
  window.coordinates = arg
})

ipcRenderer.on('socket', (event, arg) => {
  // console.log(arg)
  window.socketConn = arg
})



