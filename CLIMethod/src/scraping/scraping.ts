import * as cheerio from 'cheerio';


export async function fetchWebsiteContent(url: string): Promise<string> {
  try {
    let response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error Occured -> ${response.status}`);
    }

    let data = await response.text();
    // console.log(`Data Scraped Successfully -> Source: ${url}`);

    return data;
  } catch (error) {
    throw error;
  }
}


async function parseLinks(htmlContent: string) {
    
    let links: string[] = [];
    const $ = cheerio.load(htmlContent);
    
    $('a').each((i, el) => {

        let potentialLink = $(el).attr('href');

        if (potentialLink) {
            console.log(`N.${i} Link Found -> ${potentialLink}`);
            links.push(potentialLink);
        }
    });

    return links;
}


async function tests() {
    const SAMPLEURL = "https://www.x80labs.com/";

    let html = await fetchWebsiteContent(SAMPLEURL);
    // console.log(html);

    console.log(parseLinks(html));
}

// tests();