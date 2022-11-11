import {
  component$,
  Slot,
  createContext,
  useContextProvider,
  useContext,
  useStore,
  useSignal,
  noSerialize,
  useClientEffect$,
  useWatch$,
} from '@builder.io/qwik';
import { isBrowser } from '@builder.io/qwik/build';

export const TriggerCtx = createContext('symbolTrigger');
export const SymbolsCtx = createContext('symbols');

export const Use = ({ id }) => (
  <svg width="2em" height="2em">
    <use href={`#${id}`} />
  </svg>
);
export const Symbol = component$(({ svgTxt, id }) => {
  console.log('render Symbol', id);
  const symbols = useContext(SymbolsCtx);
  //   // Make sure not to read from the store, so we don't rerender
  //   if (!('symbols' in s)) s.symbols = noSerialize({});

  if (symbols[id])
    return (
      <div>
        Symbol {id}: <Use id={id} />
      </div>
    );

  console.log('adding', id);
  symbols[id] = svgTxt;
  // Trigger render of Collection
  const trigger = useContext(TriggerCtx);
  if (isBrowser) trigger.value++;

  return (
    <div>
      Added symbol {id}:{' '}
      <svg
        sym:collectme
        style="display:none"
        dangerouslySetInnerHTML={toSymbol(id, svgTxt)}
      />
      <Use id={id} />
    </div>
  );
});

export const toSymbol = (id, t) =>
  `<symbol id="${id}" fill="currentColor">${t}</symbol>`;
export const sym1 = `<path d="M18.75 12.75h1.5a.75.75 0 000-1.5h-1.5a.75.75 0 000 1.5zM12 6a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 6zM12 18a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 0112 18zM3.75 6.75h1.5a.75.75 0 100-1.5h-1.5a.75.75 0 000 1.5zM5.25 18.75h-1.5a.75.75 0 010-1.5h1.5a.75.75 0 010 1.5zM3 12a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 013 12zM9 3.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5zM12.75 12a2.25 2.25 0 114.5 0 2.25 2.25 0 01-4.5 0zM9 15.75a2.25 2.25 0 100 4.5 2.25 2.25 0 000-4.5z"/>`;
export const sym2 =
  '<path d="M12,21.74C23.84,13.46,23.4,10.55,23.4,8.27a5.46,5.46,0,0,0-5.7-5c-3.56,0-5.7,3.36-5.7,3.36S9.86,3.22,6.3,3.22a5.46,5.46,0,0,0-5.7,5C.6,10.56.16,13.46,12,21.74Z"></path>';
export const sym3 =
  '<path d="M19,12.76V10.29A7.2,7.2,0,0,0,12.22,3,7,7,0,0,0,5,10v2.76a5.42,5.42,0,0,1-1.59,3.83h0a1.41,1.41,0,0,0-.41,1H3A1.41,1.41,0,0,0,4.41,19H19.59A1.41,1.41,0,0,0,21,17.59h0a1.41,1.41,0,0,0-.41-1h0A5.42,5.42,0,0,1,19,12.76Z"></path>';

export const Collection = component$(() => {
  console.log('render Collection');
  const symbolsCtx = useContext(SymbolsCtx);
  const trigger = useContext(TriggerCtx);
  const ref = useSignal();
  useWatch$(({ track }) => {
    const count = track(() => trigger.value);
    console.log('add new symbols', count);
  });
  useClientEffect$(
    () => {
      console.log('Collection on client');
      // add new symbols into svg ref
    },
    { eagerness: 'load' }
  );
  const symbols = Object.entries(symbolsCtx);
  // todo useclienteffect on load that tracks added and adds symbols to table, sets copied ones to true
  return (
    <svg
      ref={ref}
      dangerouslySetInnerHTML={symbols
        .map(([id, t]) => toSymbol(id, t))
        .join('')}
      style={{ display: 'none' }}
    />
  );
});

export const RealProvider = component$(() => {
  console.log('render Provider');
  // bug? Should be in provider imho
  const s = useSignal(0);
  useContextProvider(SymbolsCtx, {});
  useContextProvider(TriggerCtx, s);
  return <Slot />;
});
export const Provider = component$(() => (
  <RealProvider>
    Slot:
    <hr />
    <Slot />
    <hr />
    &lt;Collection /&gt;: <Collection />
    <hr />
    Script: find all &lt;symbol&gt; elements and move them into the collection
  </RealProvider>
));

export const Sub = component$(() => (
  <>
    <Symbol svgTxt={sym1} id="sym1" />
    <Symbol svgTxt={sym2} id="sym2" />
    <Symbol svgTxt={sym1} id="sym1" />
    <Symbol svgTxt={sym2} id="sym2" />
  </>
));

export default component$(() => {
  const t = useSignal(0);
  return (
    <Provider>
      <Sub />
      <button onClick$={() => t.value++}>Click me</button>
      {!!t.value && <Symbol svgTxt={sym3} id="sym3" />}
    </Provider>
  );
});
