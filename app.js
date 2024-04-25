const canvas = document.querySelector('.canvas')
// const ctx = canvas.getContext('2d')
const logs = document.querySelector('.logs-text')
const startBtn = document.querySelector('.start')
const count = document.querySelector('.count')

let drawWorker = new Worker('./drawWorker.js')
const offscreen = canvas.transferControlToOffscreen()
drawWorker.postMessage({canvas: offscreen}, [offscreen])

function createArr(count = 10000) {
    return Array(count).fill([0, canvas.height / 2])
    // return Array(count).fill(0).map(el => [0, Math.round(Math.random() * canvas.height)])
}
action = 1
function render(arr, worker) {
    // ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (action === 0) {
        return
    }
    drawWorker.postMessage({arr})
    // arr.forEach((el, i) => {
    //     const command = el[0] < -10 || el[1] < -10 || el[0] > canvas.width + 10 || el[1] > canvas.height + 10

    //     if (command) {
    //         return arr.splice(i, 1)
    //     }
    //     ctx.fillStyle = 'blue'
    //     ctx.fillRect(el[0], el[1], 1, 1)
    // })

    
    // worker.postMessage(arr)

    // worker.onerror = err => {
    //     console.error(err.messages)
    // }

    // worker.onmessage = messages => {

    //     const {data} = messages

    //     if (data === 'get new arr') {
    //         workers()
    //         return 
    //     }

    //     logs.innerText = `Entity: ${data.length}`
    //     render(data, worker)
    // }

    drawWorker.onmessage = messages => {
        let arr = messages.data
        worker.postMessage(arr)

        worker.onerror = err => {
            console.error(err.messages)
        }

        worker.onmessage = messages => {

            const {data} = messages

            if (data === 'get new arr') {
                workers()
                return 
            }

            logs.innerText = `Entity: ${data.length}`
            render(data, worker)
        }
    }
}

function rnd() {
    return (-.5 + Math.random() * 1)
}

function fly(arr) {
    if (arr.length === 0) return fly(createArr())
    const newArr = arr.map(el => {
        return [el[0] += rnd(), el[1] += rnd()]
    })
    return setTimeout(() => render(newArr), 10)
}
// render(createArr())


let startWorker = null
let createWorker = null

function start() {
    if (startBtn.classList.contains('active')) {
        startBtn.classList.remove('active')
        startBtn.innerText = 'Start'
        action = 0
        return
    }
    action = 1
    startBtn.classList.add('active')
    startBtn.innerText = 'Stop'
    // startWorker = new Worker('./startWorker.js')
    // createWorker = new Worker('./createWorker.js')
    if (+count.value < 1 || !+count.value) return alert('Input count!')
    workers()
    // createWorker.postMessage([Math.round(+count.value), 0, canvas.height / 2])

    // createWorker.onerror = error => {
    //     console.error(error.messages)
    // }

    // createWorker.onmessage = messages => {
    //     startWorker.postMessage(messages.data)

    //     startWorker.onerror = err => {
    //         console.error(err.messages)
    //     }

    //     startWorker.onmessage = msg => {
    //         const {data} = msg

    //         logs.innerText = `Entity: ${data.length}`
            
    //         render(data, startWorker, createWorker)
    //     }
    // }
}

function workers() {
    if (startWorker) {
        startWorker.terminate()
        createWorker.terminate()
    }
    startWorker = new Worker('./startWorker.js')
    createWorker = new Worker('./createWorker.js')

    createWorker.postMessage([Math.round(+count.value), Math.random() * canvas.width, Math.random() * canvas.height])
    // createWorker.postMessage([Math.round(+count.value), canvas.width / 2, canvas.height / 2])

    createWorker.onerror = error => {
        console.error(error.messages)
    }

    createWorker.onmessage = messages => {
        startWorker.postMessage(messages.data)

        startWorker.onerror = err => {
            console.error(err.messages)
        }

        startWorker.onmessage = msg => {
            const {data} = msg

            logs.innerText = `Entity: ${data.length}`
            
            render(data, startWorker)
        }
    }
}
startBtn.addEventListener('click', start)
