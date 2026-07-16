"use client";

export default function Error({ error, reset }) {
  return (
    <div className="h-screen w-screen bg-red-900 text-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-4">CRITICAL REACT ERROR</h1>
      <pre className="bg-black p-4 rounded text-red-400 overflow-auto max-w-full">
        {error.message}
        <br />
        {error.stack}
      </pre>
      <button onClick={() => reset()} className="mt-8 px-4 py-2 bg-white text-black font-bold">
        Retry
      </button>
    </div>
  );
}
