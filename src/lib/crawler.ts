import puppeteer from 'puppeteer';

export interface LinkItem {
  site: string;
  title: string;
  url: string;
  format: string;
  date: string;
}

export async function crawlPAP(): Promise<LinkItem[]> {
  const urls = [
    'https://www.edu.ro',
    'https://www.mae.ro',
    'https://www.madr.ro',
    'https://anap.gov.ro',
  ];

  const browser = await puppeteer.launch({
    headless: true, // Pornește browser-ul în mod headless
  });

  const allData: LinkItem[] = [];
  const today = new Date().toISOString().split('T')[0];

  for (const site of urls) {
    const page = await browser.newPage();
    await page.goto(site, { waitUntil: 'domcontentloaded' });

    // Extragem toate linkurile și informațiile relevante
    const links = await page.$$eval('a', anchors =>
      anchors.map(anchor => ({
        href: anchor.href,
        text: anchor.textContent?.trim() || '',
      }))
    );

    // Filtru pentru linkurile relevante
    const relevantLinks = links.filter(link => {
      const lowerText = link.text.toLowerCase();
      const lowerHref = link.href.toLowerCase();
      return (
        lowerText.includes('achizi') ||
        lowerText.includes('licitat') ||
        lowerHref.includes('achizi') ||
        lowerHref.includes('licitat') ||
        lowerHref.includes('publice')
      );
    });

    // Mapăm rezultatele într-un format structurat
    relevantLinks.forEach(link => {
      allData.push({
        site,
        title: link.text,
        url: link.href.startsWith('http') ? link.href : `${site}${link.href}`,
        format: link.href.endsWith('.pdf')
          ? 'PDF'
          : link.href.endsWith('.doc') || link.href.endsWith('.docx')
          ? 'DOC'
          : 'Altul',
        date: today,
      });
    });

    await page.close();
  }

  await browser.close();

  // Eliminăm duplicatele
  return Array.from(new Map(allData.map(item => [item.url, item])).values());
}
