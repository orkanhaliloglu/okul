export default function TabanPuanlar2026Page() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-indigo-900 dark:text-indigo-300">
                2026 Lise ve Üniversite Taban Puanları Beklentisi
            </h1>

            <div className="prose dark:prose-invert max-w-none">
                <p className="text-xl text-muted-foreground mb-8">
                    2026 yılı sınav dönemi için uzman görüşleri, puan analizleri ve LGS/YKS projeksiyonları hakkında en güncel bilgiler burada olacak.
                </p>

                <div className="grid gap-8 md:grid-cols-2 mb-12">
                    <div className="bg-card p-6 rounded-xl border shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            LGS 2026 Öngörüleri
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>Matematik zorluk seviyesi analizi</li>
                            <li>Yeni nesil soru beklentileri</li>
                            <li>Kontenjan artış/azalış tahminleri</li>
                        </ul>
                    </div>

                    <div className="bg-card p-6 rounded-xl border shadow-sm">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                            YKS 2026 Beklentileri
                        </h2>
                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                            <li>TYT ve AYT baraj puanı değişimleri</li>
                            <li>Popüler bölümlerin sıralama trendleri</li>
                            <li>Yeni açılacak bölümler ve üniversiteler</li>
                        </ul>
                    </div>
                </div>

                <div className="bg-indigo-50 dark:bg-indigo-950/30 p-8 rounded-2xl">
                    <h3 className="text-xl font-bold mb-3 text-indigo-800 dark:text-indigo-200">
                        Takipte Kalın!
                    </h3>
                    <p>
                        2025 yerleştirme sonuçları açıklandıktan hemen sonra, 2026 projeksiyonlarımız bu sayfada güncellenecektir.
                        Okul Bul robotunu kullanarak geçmiş yılların verileriyle simülasyon yapabilirsiniz.
                    </p>
                </div>
            </div>
        </div>
    );
}
