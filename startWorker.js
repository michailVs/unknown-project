function rnd() {
    return (-.5 + Math.random() * 1)
}


function fly(arr) {
    if (arr.length === 0) {
        console.log(arr)
        return this.postMessage('get new arr')
    }
    const newArr = arr.map(el => {
        return [el[0] += rnd(), el[1] += rnd()]
    })
    return newArr
}

this.onerror = err => {
    throw new Error(err.messages)
}

this.onmessage = messages => {

    const {data} = messages

    this.postMessage(fly(data))

}