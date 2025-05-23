<script lang="ts">
  import Icon from "@iconify/svelte";

  interface Operation {
    icon: string;
    calculation: (_a: number, _b: number) => number;
  }

  export const Operations = {
    plus: { icon: 'mdi:plus', calculation: (a: number, b: number) => a + b },
    minus: { icon: 'mdi:minus', calculation: (a: number, b: number) => a - b },
    divide: { icon: 'mdi:division', calculation: (a: number, b: number) => a / b },
    multiply: { icon: 'mdi:multiply', calculation: (a: number, b: number) => a * b },
  } as const satisfies Record<string, Operation>;

  type Equation = [number, Operation | null][];
  
  let history = $state<[number, Equation][]>([]);
  let currentEquation = $state<Equation>([]);

  function addNumber(digit: number) {
    if (currentEquation.length === 0) {
      currentEquation = [[digit, null]];
    } else {
      const last = currentEquation[currentEquation.length - 1];
      if (last[1] === null) {
       currentEquation = [
        ...currentEquation.slice(0, -1),
        [last[0] * 10 + digit, null]
      ];
     } else {
	currentEquation = [...currentEquation, [digit, null]];
      }
    }
  }

  function addOperation(operation: Operation) {
    const last = currentEquation[currentEquation.length - 1];
    if (last) {
      currentEquation= [
	...currentEquation.slice(0, -1),
	[last[0], operation]
      ];
    }
  }

  function clearCalculation() {
    currentEquation = [];
  }

  export function evaluateExpression(): void {
    if (currentEquation.length === 0) return;

    // Create token list
    const tokens: Array<number | Operation> = currentEquation.flatMap(
      ([value, op]) => (op ? [value, op] : [value])
    );

    // Pass 1, multiply and divide
    const pass1 = collapsePrecedence(tokens, [Operations.multiply, Operations.divide]);

    // Pass 2, plus and minus
    const pass2 = collapsePrecedence(pass1, [Operations.plus, Operations.minus]);

    const result: number = Math.round(pass2[0] as number * 1000) / 1000;

    history = [
      [ result, currentEquation ],
      ...history
    ];
    clearCalculation();
  }

  export function collapsePrecedence(
    tokens: Array<number | Operation>,
    ops: Operation[]
  ): Array<number | Operation> {
    const out: Array<number | Operation> = [];
    let i = 0;

    while (i < tokens.length) {
      const token = tokens[i];

      if (typeof token === 'object' && ops.includes(token)) {
	const op = token;
	const left = out.pop()! as number;
	const right = tokens[i + 1] as number;
	const combined = op.calculation(left, right);
	out.push(combined);
	i += 2;
      } else {
	out.push(token);
	i++;
      }
    }

    return out;
  }
</script>

<div id="calculator">
  <div id="history">
    <div>
      {#if currentEquation.length > 0}
	{#each currentEquation as [digit, operation], i (i)}
	  <span>{digit}</span>
	  {#if operation}
	    <Icon icon={operation.icon} />
	  {/if}
	{/each}
      {:else}
	<span>0</span>
      {/if}
    </div>
    {#each history as [result, equation], i (i)}
      <div>
	{#each equation as [digit, operation], i (i)}
	  <span>{digit}</span>
	  {#if operation}
	    <Icon icon={operation.icon} />
	  {/if}
	{/each}
	<Icon icon="mdi:equal" />
	{result}
      </div>
    {/each}
  </div>
  
  <div id="numbers">
    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
    {#each {length: 10} as _, i (i)}
      <button onclick={() => addNumber((i + 1) % 10)}>{(i + 1) % 10}</button>
    {/each}
  </div>
  <div id="operations">
    <button onclick={clearCalculation}>C</button>
    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
    {#each Object.entries(Operations) as [_, operation], i (i)}
      <button onclick={() => addOperation(operation)}><Icon icon={operation.icon} /></button>
    {/each}
    <button onclick={evaluateExpression}><Icon icon="mdi:equal" /></button>
  </div>
</div>

<style>
  #calculator {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: 33% 1fr .33fr;
    height: 100%;
    max-height: 100%;
    width: 100%;
    overflow: hidden;
    background-color: rgba(var(--c1), var(--o1));
    border: 1px solid rgb(var(--c2));
    border-radius: 1rem;
    box-sizing: border-box;
    padding: 1rem;
  }

  #history {
    display: flex;
    flex-direction: column;
    gap: .5rem;

    padding: .5rem;
    box-sizing: border-box;
    
    max-height: 100%;
    overflow-y: auto;
    overflow-x: hidden;

    background-color: rgba(var(--c1), var(--o2));
    color: rgb(var(--c2));

    border: 2px solid rgb(var(--c1));
    border-radius: 1vmin;
  }

  #history div {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
    
    max-width: 100%;

    font-size: 2vmin;
    word-break: break-all;

    padding: .25rem;
    border: 1px solid rgb(var(--c2));
    border-radius: 1vmin;
  }

  #numbers {
    display: flex;
    flex-wrap: wrap;
    gap: .25rem;
    height: 100%;
    max-height: 100%;
    padding: .25rem;
    box-sizing: border-box;
    font-size: 2.5vmin;
    justify-content: center;
    grid-column: 2;
  }

  #numbers button {
    flex: 1 1 calc(33.333% - .25rem);
    flex-grow: 0;
  }
  
  #numbers button:last-child {
    grid-column: 2;
  }

  #operations {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: .25rem;

    height: 100%;
    padding: .25rem;
    box-sizing: border-box;    
    overflow: hidden;

    font-size: 2.5vmin;
  }

  #operations button {
    flex: 1 1 calc(16.66% - .25rem);
    flex-grow: 0;
  }

  #calculator button {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 100%;

    outline: none;
    color: rgb(var(--c2));
    background-color: rgba(var(--c1), var(--o2));
    border: 2px solid rgb(var(--c1));
    border-radius: 1vmin;
    cursor: pointer;

    font-size: inherit;
    font-weight: inherit;
    
    transition: transform .2s, filter .5s;
  }
  
  #calculator button:hover {
    transform: scale(1.01);
    filter: drop-shadow(0 0 .125rem rgb(var(--c2)));
  }
</style>
