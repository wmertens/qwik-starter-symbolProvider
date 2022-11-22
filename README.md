# qwik-starter-symbolProvider

[Edit on StackBlitz ⚡️](https://stackblitz.com/edit/qwik-starter-nbfs1f)

The interesting code is in [https://github.com/wmertens/qwik-starter-symbolProvider/blob/main/src/routes/index.tsx](src/routes/index.tsx). It implements a provider that on SSR injects individual symbols in the HTML when they're first used and on the client it moves all symbols into a single element that it manages.

Try to follow the flow from SSR to client, it's fun :-)
