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
            <th>Site administrație</th>
            <th>Titlu</th>
            <th>URL</th>
            <th>Format document</th>
            <th>Dată colectare</th>
          </tr>
        </thead>
        <tbody>
          {papData.map((item, idx) => (
            <tr key={idx}>
              <td>{item.site}</td>
              <td>{item.title}</td>
              <td>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.url}
                </a>
              </td>
              <td>{item.format}</td>
              <td>{item.date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
