
import requests
from bs4 import BeautifulSoup
import json
import re

URL = "https://www.bilimsenligi.com/istanbul-liseleri-lgs-taban-puanlari.html/"

def slugify(text):
    text = text.lower()
    text = text.replace('ğ', 'g').replace('ü', 'u').replace('ş', 's').replace('ı', 'i').replace('ö', 'o').replace('ç', 'c')
    text = re.sub(r'[^a-z0-9-]', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

def scrape():
    print(f"Fetching {URL}...")
    headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'}
    try:
        r = requests.get(URL, headers=headers)
        r.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch: {e}")
        return

    soup = BeautifulSoup(r.content, 'html.parser')
    
    # Locate table
    table = soup.find('table')
    if not table:
        print("No table found.")
        return

    schools = []
    rows = table.find_all('tr')
    
    # Skip header
    for row in rows[1:]:
        cols = row.find_all('td')
        if len(cols) < 3:
            continue
            
        # Structure assumption based on typical pages:
        # Columns often: District, School Name, Type, Duration, Language, Quota, Score, Percentile
        # We need to be flexible. Let's grab text and try to map.
        
        texts = [c.get_text(strip=True) for c in cols]
        
        # Heuristic mapping
        # Usually: İlçe (0), Okul (1), Tür (2), ... Puan (Index varies), Yüzdelik (Index varies)
        
        district = texts[0]
        name = texts[1]
        
        # Try to find Score (looks like 4xx.xxxx)
        score = 0
        percentile = 0
        school_type = "Anadolu" # Default
        
        for t in texts:
            if "Fen" in t or "Anadolu" in t or "İmam" in t:
                if len(t) < 20: # Make sure it's not a long sentence
                    school_type = t
            
            # Score detection (e.g. 494.5027)
            if re.match(r'^\d{3}[,.]\d+$', t):
                try:
                    val = float(t.replace(',', '.'))
                    if val > 150 and val <= 500:
                        score = val
                except:
                    pass
            
            # Percentile detection (e.g. 0.04 or 12.5)
            # Usually smaller numbers, maybe with comma
            # Distinguishing from quota (int) is hard, but percentile usually has decimal
            if re.match(r'^\d{1,2}[,.]\d+$', t):
                try:
                    val = float(t.replace(',', '.'))
                    if val < 100: # Percentile is < 100
                        percentile = val
                except:
                    pass

        # Cleanup name
        name = re.sub(r'\s+', ' ', name)
        
        item = {
            "name": name,
            "slug": slugify(f"{district}-{name}"),
            "city": "İstanbul",
            "district": district,
            "type": school_type,
            "score": score,
            "percentile": percentile,
            "admission_type": "LGS",
            "education_duration": 4 # Default
        }
        schools.append(item)

    print(f"Scraped {len(schools)} schools.")
    
    with open('src/data/high-schools.json', 'w', encoding='utf-8') as f:
        json.dump(schools, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    scrape()
