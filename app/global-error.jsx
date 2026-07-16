"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body>
        <div style={{ backgroundColor: 'darkred', color: 'white', padding: '20px', height: '100vh', width: '100vw' }}>
          <h1>GLOBAL CRITICAL REACT ERROR</h1>
          <pre>{error.message}</pre>
          <pre>{error.stack}</pre>
          <button onClick={() => reset()}>Retry</button>
        </div>
      </body>
    </html>
  );
}
