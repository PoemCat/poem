export function timeOut(ms) {
    return new Promise(reslove => {
        setTimeout(() => {
            reslove()
        }, ms)
    })
}
