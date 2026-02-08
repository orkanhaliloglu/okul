# Domain Yönlendirme Rehberi (Natro -> Vercel)

## Yöntem 1: Nameserver (NS) Yönlendirmesi (Önerilen)
Bu yöntem domaininizin tüm DNS yönetimini Vercel'e devreder. En kolayıdır.

1.  **Vercel'e Gidin:**
    *   Projenizi açın -> **Settings** -> **Domains**.
    *   Domaininizi (örn: ) ekleyin.
    *   Vercel size 2 adet adres verecek (genelde  ve ).

2.  **Natro'ya Gidin:**
    *   Natro Müşteri Panelinize giriş yapın.
    *   **Domain Yönetimi** -> İlgili domaini seçin -> **Yönet**.
    *   **DNS Sunucuları (Nameservers)** seçeneğini bulun.
    *   Mevcut adresleri silin ve Vercel'in verdiklerini yazın:
        *   
        *   
    *   Kaydedin. (Güncellenmesi 1-24 saat sürebilir).

## Yöntem 2: A ve CNAME Kaydı (DNS Yönetimi Natro'da Kalır)
Eğer maillerinizi Natro üzerinden kullanıyorsanız bunu tercih edin.

1.  **Vercel:** Domain eklediğinizde size bir  (IP adresi) ve  verecektir.
2.  **Natro:** Domain Yönetimi -> **Gelişmiş DNS Yönetimi**'ne girin.
3.  **A Kaydı:** Mevcut  (www olmayan) kaydını silip Vercel'in verdiği IP (örn: ) ile değiştirin.
4.  **CNAME Kaydı:**  kaydını  olarak güncelleyin.

