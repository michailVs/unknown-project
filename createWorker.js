
function createArr(count = 2000, x, y) {
    return Array(count).fill([x, y])
    // return Array(count).fill(0).map(el => [0, Math.round(Math.random() * canvas.height)])
}

this.onerror = err => {
    throw new Error(err.messages)
}

this.onmessage = messages => {

    const {data} = messages

    this.postMessage(createArr(data[0], data[1], data[2]))

}