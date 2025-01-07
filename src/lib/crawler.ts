// src/lib/crawler.ts
import axios from 'axios';
import https from 'https';
import * as cheerio from 'cheerio';

export interface LinkItem {
  site: string;
  text: string;
  href: string;
}

export async function crawlPAP(): Promise<LinkItem[]> {
  // Alege site-urile care n-au dat erori mari
  const urls = [
    'https://www.edu.ro',
    'https://www.mae.ro',
    'https://www.madr.ro',
    'https://anap.gov.ro',
  ];

  // Agent care ignoră certificatele SSL
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });

  const allData: LinkItem[] = [];

  for (const site of urls) {
    try {
      // Facem request la site
      const { data } = await axios.get(site, { httpsAgent });

      // Parsăm HTML cu Cheerio
      const $ = cheerio.load(data);

      // De test: extragem TOATE link-urile <a>, apoi le filtrezi ulterior
      const links = $('a');
      const siteData: LinkItem[] = [];

      links.each((_, el) => {
        siteData.push({
          site,
          text: $(el).text().trim(),
          href: $(el).attr('href') || '',
        });
      });

      allData.push(...siteData);
    } catch (error: any) {
      console.error(`Eroare la accesarea site-ului ${site}:`, error.message);
    }
  }

  return allData;
}
