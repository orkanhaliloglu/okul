import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, ListChecks, Target } from "lucide-react";

export default function TercihNasilYapilirPage() {
    return (
        <div className="container mx-auto py-12 px-4 max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center text-indigo-900 dark:text-indigo-300">
                Doğru Tercih Nasıl Yapılır?
            </h1>
            <p className="text-center text-xl text-muted-foreground mb-12">
                Hayalindeki okula giden yolda adım adım rehber.
            </p>

            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <Target className="h-8 w-8 text-indigo-600" />
                            1. Kendini Tanı ve Hedef Belirle
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <p>
                            Sadece puana göre değil, ilgi alanlarına ve yeteneklerine göre seçim yapmalısın.
                            Hangi dersleri seviyorsun? Gelecekte nasıl bir meslek hayal ediyorsun?
                            Lise seçimi yaparken okulun kültürü, yabancı dil imkanları ve üniversite başarısı kritiktir.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <ListChecks className="h-8 w-8 text-indigo-600" />
                            2. Geniş Bir Liste Oluştur
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <p>
                            Puanın yetse de yetmese de gitmek istediğin tüm okulları listene ekle.
                            <strong>Yüzdelik dilim</strong> puanından daha güvenilir bir kriterdir.
                            Kendi yüzdelik diliminin biraz üstünden başlayarak (örneğin %5 isen %2-3'ten başlayarak)
                            garanti görebileceğin seviyeye (%8-10) kadar inen bir liste hazırla.
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3 text-2xl">
                            <CheckCircle2 className="h-8 w-8 text-indigo-600" />
                            3. Okul Ziyaretleri ve Araştırma
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground">
                        <p>
                            Mümkünse okulları fiziksel olarak ziyaret et. Okul müdürü, öğretmenler veya rehberlik servisiyle görüş.
                            Okulun ulaşım imkanlarını, fiziki şartlarını (laboratuvar, spor salonu vb.) yerinde gör.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
