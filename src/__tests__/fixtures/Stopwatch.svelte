<script>
  import { onDestroy } from 'svelte'

  let timer
  let lapse = 0
  let running = false

  function handleRunClick () {
    if (running) {
      clearInterval(timer)
    } else {
      const startTime = Date.now() - lapse

      timer = setInterval(() => {
        lapse = Date.now() - startTime
      }, 1)
    }

    return running = true
  }

  function handleClearClick () {
    clearInterval(timer)
    lapse = 0
    running = false
  }

  onDestroy(() => {
    clearInterval(timer)
  })
</script>

<style></style>

<div>
  <span>{lapse}ms</span>
  <button on:click={handleRunClick}>
    {running ? 'Stop' : 'Start'}
  </button>
  <button on:click={handleClearClick}>Clear</button>
</div>

