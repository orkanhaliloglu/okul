import requests
from bs4 import BeautifulSoup
import json
import re

url = "https://zeytinli.meb.k12.tr/icerikler/enbasarililiselersiralamasi_15113991.html"

def scrape_meb_highschools():
    print(f"Fetching {url}...")
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
    except Exception as e:
        print(f"Error fetching URL: {e}")
        return

    soup = BeautifulSoup(response.content, 'html.parser')
    
    # The data is likely in a table. Let's find all tables.
    tables = soup.find_all('table')
    
    schools = []
    
    print(f"Found {len(tables)} tables.")
    
    for table in tables:
        rows = table.find_all('tr')
        # Skip header if possible. Usually first row.
        for row in rows:
            cols = row.find_all(['td', 'th'])
            cols_text = [c.get_text(strip=True) for c in cols]
            
            # We expect columns like: Rank, Name, Score, Percentile, etc.
            # We need to guess the structure based on content.
            # Example row assumption: [1, "Galatasaray Lisesi", "500", "0.01", ...]
            
            if len(cols_text) >= 3:
                # Naive heuristic to identify a school row
                name = cols_text[1]
                
                # Check if it looks like a school name
                if "Lisesi" in name or "Koleji" in name or "Fen" in name:
                    # Clean up data
                    try:
                        # Try to parse score and percentile if present
                        # This depends heavily on the specific table format of that page.
                        # I'll try to be generic. 
                        
                        school = {
                            "name": name,
                            "raw_data": cols_text
                        }
                        
                        # Try to extract score (look for numbers > 100)
                        for item in cols_text:
                            if re.match(r'^\d{3}[,.]?\d*$', item):
                                try:
                                    score = float(item.replace(',', '.'))
                                    if 150 < score <= 500:
                                        school["score"] = score
                                except:
                                    pass
                                    
                        schools.append(school)
                    except:
                        continue

    print(f"Extracted {len(schools)} potential school records.")
    
    # Save raw data first to verify
    with open('src/data/high-schools-raw.json', 'w', encoding='utf-8') as f:
        json.dump(schools, f, ensure_ascii=False, indent=2)
    print("Saved to src/data/high-schools-raw.json")

if __name__ == "__main__":
    scrape_meb_highschools()
