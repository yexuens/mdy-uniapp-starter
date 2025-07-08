export function useTimer() {
  let timeSpent = 0
  let timer: number | null = null

  function start() {
    if (timer)
      stop()
    timer = setInterval(() => {
      timeSpent += 1
    }, 1000)
  }

  function stop() {
    if (timer)
      clearInterval(timer)
    timer = null
  }

  function getAndClear() {
    stop()
    const _t = timeSpent
    timeSpent = 0
    return _t
  }

  return {
    start,
    stop,
    getAndClear,
  }
}
