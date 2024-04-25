let ctx = null
this.onmessage = messages => {
    const {data} = messages
    if (data['canvas']) {
        ctx = data.canvas.getContext('2d')
    }
    if (data['arr']) {
        ctx.clearRect(0, 0, 500, 500)
        data.arr.forEach((el, i) => {

            const command = el[0] < -10 || el[1] < -10 || el[0] > 500 + 10 || el[1] > 500 + 10

            if (command) {
                return data.arr.splice(i, 1)
            }
            ctx.fillStyle = 'blue'
            ctx.fillRect(el[0], el[1], 1, 1)
        })
    }
    this.postMessage(data.arr)
}