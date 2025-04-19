<script lang="ts">
  function getTime() {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  let time: string = getTime();

  setInterval(() => {
    time = getTime();
  }, 1000);
</script>

<h1>
  {time}
</h1>

<style>
  h1 {
    font-size: calc(24px + 4vmin);
    color: rgb(var(--c1));
    background-color: rgb(var(--c2));
    padding: 1rem;
    border-radius: .5rem;
    border: 1px solid rgb(var(--c1));
    font-variant-numeric: tabular-nums;
    font-family: Roboto !important;
  }
</style>
