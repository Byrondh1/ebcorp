import { ScrollViewStyleReset } from 'expo-router/html';

export default function Root({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <title>Distribuidora de Pollo</title>
        <ScrollViewStyleReset />
        <style dangerouslySetInnerHTML={{
          __html: `
            html, body, #root { height: 100%; margin: 0; padding: 0; }
            body { background-color: #0d1f35; font-family: system-ui, -apple-system, sans-serif; overflow: hidden; }
            ::-webkit-scrollbar { display: none; }
            * { scrollbar-width: none; -ms-overflow-style: none; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
            [role="button"], button { cursor: pointer; }
          `,
        }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
