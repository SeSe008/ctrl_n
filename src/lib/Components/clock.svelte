<script lang="ts">
  let time = new Date().toLocaleTimeString();

  setInterval(() => {
    time = new Date().toLocaleTimeString();
  }, 1000);
</script>

<h1>
  {time}
</h1>

<style>
  h1 {
    color: rgb(var(--c1));
    background-color: rgb(var(--c2));
    padding: 1rem;
    border-radius: .5rem;
    border: 1px solid rgb(var(--c1));
    font-variant-numeric: tabular-nums;
    padding: .5rem 1rem;
    font-family: Roboto !important;
  }
</style>
