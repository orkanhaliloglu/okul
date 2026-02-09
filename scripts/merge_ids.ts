/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';
import path from 'path';

// Read existing files
const sayPath = path.join(process.cwd(), 'src/data/universities_say.json');
const eaPath = path.join(process.cwd(), 'src/data/universities_ea.json');

const sayData = JSON.parse(fs.readFileSync(sayPath, 'utf-8'));
const eaData = JSON.parse(fs.readFileSync(eaPath, 'utf-8'));

// Scraped ID data (from browser subagent)
const scrapedIds = {
  say: [
    { "university": "İSTANBUL MEDİPOL ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "203110477" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "203910699" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "203910363" },
    { "university": "ACIBADEM MEHMET ALİ AYDINLAR ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "200110071" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Elektrik-Elektronik Mühendisliği", "id_yok": "203910399" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "202110408" },
    { "university": "İSTANBUL MEDİPOL ÜNİVERSİTESİ", "program": "Yapay Zeka Mühendisliği", "id_yok": "203190981" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Elektrik-Elektronik Mühendisliği", "id_yok": "202110426" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Endüstri Mühendisliği", "id_yok": "203910424" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Fizik", "id_yok": "203910054" },
    { "university": "İSTANBUL MEDİPOL ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "203110035" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Matematik", "id_yok": "203910115" },
    { "university": "HACETTEPE ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "104810626" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "108410336" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Makine Mühendisliği", "id_yok": "203910487" },
    { "university": "İSTANBUL MEDİPOL ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "203190967" },
    { "university": "İSTANBUL ÜNİVERSİTESİ-CERRAHPAŞA", "program": "Tıp", "id_yok": "111610025" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "105510608" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "102210277" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Elektrik-Elektronik Mühendisliği", "id_yok": "108410354" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "204811077" },
    { "university": "HACETTEPE ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "104810617" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Yapay Zeka ve Veri Mühendisliği", "id_yok": "105590133" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Elektrik-Elektronik Mühendisliği", "id_yok": "102210286" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Moleküler Biyoloji ve Genetik", "id_yok": "203910557" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Kimya-Biyoloji Mühendisliği", "id_yok": "203910451" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Endüstri Mühendisliği", "id_yok": "102210295" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "203910706" },
    { "university": "ESKİŞEHİR TEKNİK ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "112410952" },
    { "university": "SABANCI ÜNİVERSİTESİ", "program": "Mühendislik ve Doğa Bilimleri Programları", "id_yok": "205110117" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "205411015" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Elektronik ve Haberleşme Mühendisliği", "id_yok": "105510626" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Endüstri Mühendisliği", "id_yok": "202110444" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "205410114" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Uçak Mühendisliği", "id_yok": "105510538" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Makine Mühendisliği", "id_yok": "202110877" },
    { "university": "TÜRK HAVA KURUMU ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "205710544" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Havacılık ve Uzay Mühendisliği", "id_yok": "108410381" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Makine Mühendisliği", "id_yok": "108470117" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "206110759" },
    { "university": "ANKARA ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "101190208" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "204810176" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Endüstri Mühendisliği", "id_yok": "108410363" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Elektrik-Elektronik Mühendisliği", "id_yok": "205410132" },
    { "university": "BAHÇEŞEHİR ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "200590143" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Elektronik ve Haberleşme Mühendisliği", "id_yok": "105510565" },
    { "university": "İSTANBUL ÜNİVERSİTESİ-CERRAHPAŞA", "program": "Tıp", "id_yok": "111610016" },
    { "university": "İSTANBUL AYDIN ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "202490863" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Makine Mühendisliği", "id_yok": "108410433" },
    { "university": "ANKARA ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "101110775" },
    { "university": "İSTANBUL ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "105611589" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Fizik", "id_yok": "202110065" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Matematik Mühendisliği", "id_yok": "105510168" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Makine Mühendisliği", "id_yok": "102210329" },
    { "university": "KTO KARATAY ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "204090110" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Endüstri Mühendisliği", "id_yok": "105510662" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Yapay Zeka Mühendisliği", "id_yok": "205490113" },
    { "university": "ATILIM ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "200211465" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Elektrik-Elektronik Mühendisliği", "id_yok": "202110744" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Uzay Mühendisliği", "id_yok": "105510926" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Makine Mühendisliği", "id_yok": "205410177" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Endüstri Mühendisliği", "id_yok": "105510292" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Kontrol ve Otomasyon Mühendisliği", "id_yok": "105590307" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Siber Güvenlik Mühendisliği", "id_yok": "105590279" },
    { "university": "İSTANBUL ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "105610634" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Kontrol ve Otomasyon Mühendisliği", "id_yok": "105590314" },
    { "university": "GAZİ ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "104110836" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Bilişim Sistemleri ve Teknolojileri", "id_yok": "202190193" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Yapay Zeka ve Veri Mühendisliği", "id_yok": "204890125" },
    { "university": "EGE ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "103410457" },
    { "university": "GAZİ ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "104111234" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Kimya", "id_yok": "203910099" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Endüstri Mühendisliği", "id_yok": "205410159" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "202110735" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Matematik", "id_yok": "202110108" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "İşletme Mühendisliği", "id_yok": "105510689" },
    { "university": "BAŞKENT ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "200611488" },
    { "university": "HACETTEPE ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "104810917" },
    { "university": "BAŞKENT ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "200690358" },
    { "university": "MARMARA ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "107210695" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Makine Mühendisliği", "id_yok": "105510441" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Elektrik Mühendisliği", "id_yok": "105510617" },
    { "university": "HACETTEPE ÜNİVERSİTESİ", "program": "Elektrik-Elektronik Mühendisliği", "id_yok": "104810511" },
    { "university": "İSTANBUL NİŞANTAŞI ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "210402509" },
    { "university": "BEZM-İ ÂLEM VAKIF ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "200910027" },
    { "university": "ANKARA YILDIRIM BEYAZIT ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "110010174" },
    { "university": "İSTANBUL OKAN ÜNİVERSİTESİ", "program": "Pilotaj", "id_yok": "204790524" },
    { "university": "BAHÇEŞEHİR ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "200511241" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Elektrik-Elektronik Mühendisliği", "id_yok": "204810113" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Elektrik Mühendisliği", "id_yok": "105510098" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Metalurji ve Malzeme Mühendisliği", "id_yok": "108410442" },
    { "university": "İSTİNYE ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "208450758" },
    { "university": "GALATASARAY ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "104010122" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Moleküler Biyoloji ve Genetik", "id_yok": "202110126" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "205411024" },
    { "university": "SAĞLIK BİLİMLERİ ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "111010083" },
    { "university": "YILDIZ TEKNİK ÜNİVERSİTESİ", "program": "Bilgisayar Mühendisliği", "id_yok": "110110031" },
    { "university": "DOKUZ EYLÜL ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "103110557" },
    { "university": "SAĞLIK BİLİMLERİ ÜNİVERSİTESİ", "program": "Tıp", "id_yok": "111010223" }
  ],
  "ea": [
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Ekonomi", "id_yok": "203910275" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "203910309" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "203910796" },
    { "university": "SABANCI ÜNİVERSİTESİ", "program": "Yönetim Bilimleri Programları", "id_yok": "205110144" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "202111106" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "İktisat", "id_yok": "202110205" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Uluslararası İlişkiler", "id_yok": "203910336" },
    { "university": "GALATASARAY ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "104010052" },
    { "university": "SABANCI ÜNİVERSİTESİ", "program": "Sanat ve Sosyal Bilimler Programları", "id_yok": "205110074" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Psikoloji", "id_yok": "202110241" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "102210223" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "İktisat", "id_yok": "102210214" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "205410283" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Psikoloji", "id_yok": "203910133" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Sosyoloji", "id_yok": "203910169" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "202110383" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Yönetim Bilişim Sistemleri", "id_yok": "102270154" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Yönetim Bilişim Sistemleri", "id_yok": "204810476" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Uluslararası Ticaret", "id_yok": "102270147" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Ekonomi", "id_yok": "204810334" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Uluslararası İlişkiler", "id_yok": "202110286" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "İktisat", "id_yok": "205410053" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "205410071" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "204810016" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "204810228" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Felsefe", "id_yok": "203910036" },
    { "university": "GALATASARAY ÜNİVERSİTESİ", "program": "İktisat", "id_yok": "104010061" },
    { "university": "GALATASARAY ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "104010079" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "108410212" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "102270035" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "İktisat", "id_yok": "108410203" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Siyaset Bilimi ve Uluslararası İlişkiler", "id_yok": "102210232" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "202111115" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "Ekonomi", "id_yok": "105511051" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Uluslararası Ticaret ve İşletmecilik", "id_yok": "204890046" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Uluslararası Girişimcilik", "id_yok": "205410389" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Uluslararası Finans", "id_yok": "204811014" },
    { "university": "GALATASARAY ÜNİVERSİTESİ", "program": "Uluslararası İlişkiler", "id_yok": "104010097" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Psikoloji", "id_yok": "102270203" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Siyaset Bilimi ve Kamu Yönetimi", "id_yok": "202110268" },
    { "university": "İSTANBUL ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "105690587" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Uluslararası İlişkiler", "id_yok": "108410275" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Siyaset Bilimi ve Uluslararası İlişkiler", "id_yok": "205411112" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "206111969" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Ekonomi", "id_yok": "206190353" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Uluslararası İlişkiler", "id_yok": "204810731" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Turizm İşletmeciliği", "id_yok": "102270140" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "108410239" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Psikoloji", "id_yok": "108410178" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Yönetim Bilişim Sistemleri", "id_yok": "206190547" },
    { "university": "ANKARA ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "101110518" },
    { "university": "İSTANBUL TEKNİK ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "105510326" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Turizm ve Otel İşletmeciliği", "id_yok": "202190195" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Psikoloji", "id_yok": "204810273" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Havacılık Yönetimi", "id_yok": "204811032" },
    { "university": "GALATASARAY ÜNİVERSİTESİ", "program": "Siyaset Bilimi", "id_yok": "104010088" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Küresel Siyaset ve Uluslararası İlişkiler", "id_yok": "108410257" },
    { "university": "TOBB EKONOMİ VE TEKNOLOJİ ÜNİVERSİTESİ", "program": "Psikoloji", "id_yok": "205410989" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "206110398" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Siyaset Bilimi ve Kamu Yönetimi", "id_yok": "108410266" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Sosyoloji", "id_yok": "102270210" },
    { "university": "HACETTEPE ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "104890610" },
    { "university": "İHSAN DOĞRAMACI BİLKENT ÜNİVERSİTESİ", "program": "Grafik Tasarımı", "id_yok": "202190182" },
    { "university": "İSTANBUL ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "105610501" },
    { "university": "BAHÇEŞEHİR ÜNİVERSİTESİ", "program": "Ekonomi", "id_yok": "200510322" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Siyaset Bilimi ve Uluslararası İlişkiler", "id_yok": "206110495" },
    { "university": "TÜRK-ALMAN ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "109610022" },
    { "university": "BAHÇEŞEHİR ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "200511568" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Uluslararası Finans", "id_yok": "206190456" },
    { "university": "YILDIZ TEKNİK ÜNİVERSİTESİ", "program": "İktisat", "id_yok": "110110507" },
    { "university": "MARMARA ÜNİVERSİTESİ", "program": "Yönetim Bilişim Sistemleri", "id_yok": "107290348" },
    { "university": "GALATASARAY ÜNİVERSİTESİ", "program": "Sosyoloji", "id_yok": "104010043" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "203910832" },
    { "university": "ÖZYEĞİN ÜNİVERSİTESİ", "program": "Otel Yöneticiliği", "id_yok": "204890174" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Uluslararası Ticaret ve İşletmecilik", "id_yok": "206190477" },
    { "university": "YILDIZ TEKNİK ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "110190084" },
    { "university": "KOÇ ÜNİVERSİTESİ", "program": "Ekonomi", "id_yok": "203910284" },
    { "university": "MARMARA ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "107210332" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Psikoloji", "id_yok": "206110247" },
    { "university": "HACETTEPE ÜNİVERSİTESİ", "program": "Psikoloji", "id_yok": "104810141" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Rehberlik ve Psikolojik Danışmanlık", "id_yok": "102210092" },
    { "university": "ANKARA HACI BAYRAM VELİ ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "111710412" },
    { "university": "ALTINBAŞ ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "202910736" },
    { "university": "İBN HALDUN ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "208610015" },
    { "university": "İSTANBUL BİLGİ ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "202510167" },
    { "university": "BAHÇEŞEHİR ÜNİVERSİTESİ", "program": "İşletme", "id_yok": "200510349" },
    { "university": "İZMİR EKONOMİ ÜNİVERSİTESİ", "program": "Ekonomi", "id_yok": "203510261" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Uluslararası İşletme Yönetimi", "id_yok": "206111599" },
    { "university": "BAŞKENT ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "200611328" },
    { "university": "KADİR HAS ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "203710083" },
    { "university": "BOĞAZİÇİ ÜNİVERSİTESİ", "program": "Felsefe", "id_yok": "102270182" },
    { "university": "TÜRK-ALMAN ÜNİVERSİTESİ", "program": "İktisat", "id_yok": "109610173" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Siyaset Bilimi ve Uluslararası İlişkiler", "id_yok": "206110477" },
    { "university": "İSTANBUL ÜNİVERSİTESİ", "program": "Yönetim Bilişim Sistemleri", "id_yok": "105690802" },
    { "university": "ANKARA YILDIRIM BEYAZIT ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "110010023" },
    { "university": "TÜRK-ALMAN ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "109610013" },
    { "university": "ORTA DOĞU TEKNİK ÜNİVERSİTESİ", "program": "Sosyoloji", "id_yok": "108410187" },
    { "university": "ANKARA SOSYAL BİLİMLER ÜNİVERSİTESİ", "program": "Hukuk", "id_yok": "110910096" },
    { "university": "YEDİTEPE ÜNİVERSİTESİ", "program": "Elektronik Ticaret ve Yönetimi", "id_yok": "206190400" },
    { "university": "KADİR HAS ÜNİVERSİTESİ", "program": "Ekonomi", "id_yok": "203710108" }
  ]
};

function mergeIds(originalData: any[], scraped: any[]) {
  return originalData.map(item => {
    // Find matching item in scraped data
    // Match logic: University must match EXACTLY. Program must match LOOSELY (startWith) to handle variations.
    // Also normalize spaces.
    const normUni = (u: string) => u.trim().replace(/\s+/g, ' ');

    const match = scraped.find(s => {
      const sameUni = normUni(s.university) === normUni(item.university);
      if (!sameUni) return false;

      // Program simple match: "Tıp" vs "Tıp (İngilizce)"
      const scrapedProg = s.program.split(' (')[0].trim();
      const originalProg = (item.program || item.programName).split(' (')[0].trim();

      return originalProg.includes(scrapedProg) || scrapedProg.includes(originalProg);
    });

    if (match) {
      item.program_code = match.id_yok;
    }
    return item;
  });
}

// Merge SAY
console.log('Merging SAY...');
const mergedSay = mergeIds(sayData, scrapedIds.say);
fs.writeFileSync(sayPath, JSON.stringify(mergedSay, null, 4));

// Merge EA
console.log('Merging EA...');
const mergedEa = mergeIds(eaData, scrapedIds.ea);
fs.writeFileSync(eaPath, JSON.stringify(mergedEa, null, 4));

console.log('Merged successfully!');
