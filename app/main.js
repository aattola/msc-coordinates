// Modules to control application life and create native browser window
const {app, BrowserWindow, ipcMain} = require('electron')
const path = require('path')

const memoryjs = require('memoryjs');
const io = require('socket.io-client')

global.osoite = 'http://localhost:3000'

const socket = io(global.osoite, {
  autoConnect: false
});
const data = { id: 1, color: "#202312", name: "Jehve" }
const processName = "mysummercar.exe";


// require('./index')

function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 500,
    height: 650,
    // frame: false,
    webPreferences: {
        nodeIntegration: true,
        // contextIsolation: true,
        // nativeWindowOpen: true,
        sandbox: false,
        worldSafeExecuteJavaScript: true,
        contextIsolation: false
      }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('start', (event, arg) => {
  console.log(arg)
  socket.connect()
  readMemoryLoop(JSON.parse(arg))
  event.reply('reply', ['started', true])
})

ipcMain.on('stop', (event, arg) => {
  clearInterval(global.orava)
  socket.disconnect()
  event.reply('reply', ['stopped', true])
})

ipcMain.on('socketConnected', (event, arg) => {
  event.reply('socket', `${socket.connected} Osoite: ${global.osoite}`)
})

ipcMain.on('coordinates', (event, arg) => {
  event.reply('coordinatesGet', global.coordinates)
})

ipcMain.on('setUrl', (event, arg) => {
  global.osoite = arg
  console.log(arg, global.osoite)
})

// const offsetsX = [
//   0x50,
//   0x40,
//   0x60,
//   0x90,
//   0x0,
//   0x20,
//   0x280
// ]

// const offsetsZ = [
//   0x50,
//   0x40,
//   0x60,
//   0x90,
//   0x0,
//   0x20,
//   0x288
// ]


const offsetsX = [
  0x60,
  0xF68,
  0x28,
  0x858,
  0x68,
  0x28,
  0xF8
]

const offsetsZ = [
  0x60,
  0xF68,
  0x28,
  0x858,
  0x68,
  0x28,
  0x100
]

function readMemoryLoop (appData) {
  memoryjs.openProcess(processName, (error, processObject) => {
    if (error) throw new Error(error)
    console.log(processName, processObject)
    var modules = memoryjs.getModules(processObject.th32ProcessID);
    // console.log(modules[0].th32ModuleID, modules[0].szModule,  modules[0].modBaseAddr)
    // console.log(modules)

    const address2 = modules.filter(module => {
      if (module.szModule == 'mono.dll') {
        return module.modBaseAddr
      }
    })

    console.log(address2[0], address2[0].modBaseAddr)

    // const address = modules[0].modBaseAddr + 0x010757E8
    const address = address2[0].modBaseAddr + 0x00260A58
    // console.log(0x010757E8)
    console.log("Address", address)
    const one = memoryjs.readMemory(processObject.handle, address, memoryjs.INT);

    // const eka = memoryjs.readMemory(processObject.handle, address + offsets[0], memoryjs.FLOAT);
    // console.log(eka, address + 0x50)
    global.orava = setInterval(() => {
      const X = readValue(offsetsX, memoryjs.FLOAT, one, processObject.handle)
      const Z = readValue(offsetsZ, memoryjs.FLOAT, one, processObject.handle)
      console.log(X, Z)
      socket.emit('coordinates', {...appData, x: X, z: Z})
      global.coordinates = {x: X, z: Z}
    }, 2000);
  });

}

function readValue(offsets, type, modBaseAddr, handle) {
  let address = modBaseAddr;
  for (let i = 0; i < offsets.length - 1; i++) {
    address = memoryjs.readMemory(handle, address + offsets[i], memoryjs.PTR);
  }

  let value = memoryjs.readMemory(handle, address + offsets[offsets.length - 1], type);
  return value;
}
// <?xml version="1.0" encoding="utf-8"?>
// <CheatTable>
//   <CheatEntries>
//     <CheatEntry>
//       <ID>21</ID>
//       <Description>"pointerscan result"</Description>
//       <LastState Value="-9.198564529" RealAddress="40D3CF30"/>
//       <VariableType>Float</VariableType>
//       <Address>"mysummercar.exe"+010757E8</Address>
//       <Offsets>
//         <Offset>280</Offset>
//         <Offset>20</Offset>
//         <Offset>0</Offset>
//         <Offset>90</Offset>
//         <Offset>60</Offset>
//         <Offset>40</Offset>
//         <Offset>50</Offset>
//       </Offsets>
//     </CheatEntry>
//   </CheatEntries>
// </CheatTable>



// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
