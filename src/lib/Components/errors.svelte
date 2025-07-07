<script lang="ts">
  import { errors } from '$lib/stores/errors';
</script>

<aside id="errors">
  {#each $errors as { message, code }, i (i)}
    <div class="error">
      <div class="code">{code} error:</div>
      <div class="message">{message}</div>
    </div>
  {/each}
</aside>

<style>
  #errors {
    position: fixed;
    left: 1vmin;
    bottom: 1vmin;

    display: flex;
    flex-direction: column-reverse;
    gap: 0.25rem;

    height: auto;
    max-width: 33%;
    overflow: hidden;

    z-index: 15;
  }

  .error {
    position: relative;

    display: flex;
    flex-direction: row;
    gap: 0.25em;

    background-color: red;
    color: white;

    border-radius: 0.25rem;

    box-sizing: border-box;
    padding: 0.25rem 0.33rem;

    font-size: calc(10px + 1.25vmin);
    white-space: nowrap;
    overflow: hidden;

    z-index: 0;

    animation: errorOut 5s linear forwards;
  }

  .error .code {
    font-weight: bold;
  }

  .error .message {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @keyframes errorOut {
    93% {
      transform: scale(1);
    }
    95% {
      transform: scale(1.1);
      opacity: 1;
    }
    100% {
      transform: scale(0);
      opacity: 0;
    }
  }

  .error::before {
    position: absolute;
    content: '';

    bottom: 0;
    left: 0;

    width: 100%;
    height: 0.2rem;

    background-color: rgba(0, 0, 0, 0.25);

    z-index: 10;

    animation: barOut 5s linear;
  }

  @keyframes barOut {
    from {
      width: 100%;
    }
    to {
      width: 0;
    }
  }
</style>
