"use client";

import { useState } from "react";

export default function Home() {
  const [papData, setPapData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleCrawl() {
    setLoading(true);
    try {
      const res = await fetch("/api/crawl");
      const json = await res.json();

      if (json.success) {
        setPapData(json.data);
      } else {
        console.error("Eroare la primirea datelor:", json.message);
      }
    } catch (err) {
      console.error("Eroare fetch:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>Planul de Achiziții Publice (PAP) - Crawler</h1>
      <button onClick={handleCrawl} disabled={loading}>
        {loading ? "Se încarcă..." : "Generare PAP"}
      </button>

      <table
        border={1}
        style={{ marginTop: 20, borderCollapse: "collapse", width: "80%" }}
      >
        <thead>
          <tr>
            <th>Site</th>
            <th>Text Link</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {papData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.site}</td>
              <td>{item.text}</td>
              <td>
                {item.href.startsWith("http") ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer">
                    {item.href}
                  </a>
                ) : (
                  <a
                    href={`${item.site}${item.href}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.site}
                    {item.href}
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
