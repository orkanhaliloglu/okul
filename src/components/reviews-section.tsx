"use client";

import { useEffect, useState } from "react";
import { Star, MessageSquare, Send, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { submitReview, getRecentReviews, type Review } from "@/actions/review-actions";
import { useToast } from "@/components/ui/use-toast"; // Assuming toast exists or will use simple alert
import { Toaster } from "@/components/ui/toaster";

export function ReviewsSection() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [rating, setRating] = useState(5);

    useEffect(() => {
        loadReviews();
    }, []);

    async function loadReviews() {
        const data = await getRecentReviews();
        setReviews(data);
        setLoading(false);
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setSubmitting(true);
        const formData = new FormData(event.currentTarget);
        formData.set('rating', rating.toString());

        const result = await submitReview(formData);

        if (result.success) {
            // Reset form
            (event.target as HTMLFormElement).reset();
            setRating(5);
            alert("Yorumunuz için teşekkürler!");
            loadReviews(); // Refresh list
        } else {
            alert(result.error);
        }
        setSubmitting(false);
    }

    return (
        <section className="border-t bg-slate-50/50 dark:bg-black/20 py-12 md:py-16">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-10">
                    <div className="inline-block rounded-lg bg-indigo-100 dark:bg-indigo-900/30 px-3 py-1 text-sm text-indigo-600 dark:text-indigo-400">
                        Sizden Gelenler
                    </div>
                    <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                        Ziyaretçi Yorumları
                    </h2>
                    <p className="max-w-[700px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Sitemiz hakkında düşüncelerinizi paylaşın veya diğer kullanıcıların deneyimlerini okuyun.
                    </p>
                </div>

                <div className="grid gap-10 md:grid-cols-2 lg:gap-16">
                    {/* Reviews List */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <MessageSquare className="h-5 w-5 text-indigo-600" />
                            Son Yorumlar
                        </h3>
                        <div className="grid gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {loading ? (
                                <p className="text-muted-foreground">Yorumlar yükleniyor...</p>
                            ) : reviews.length === 0 ? (
                                <Card>
                                    <CardContent className="p-6 text-center text-muted-foreground">
                                        Henüz yorum yapılmamış. İlk yorumu siz yapın!
                                    </CardContent>
                                </Card>
                            ) : (
                                reviews.map((review) => (
                                    <Card key={review.id} className="bg-white/60 dark:bg-zinc-900/50 backdrop-blur-sm border-0 shadow-sm ring-1 ring-gray-200 dark:ring-gray-800">
                                        <CardContent className="p-4 space-y-2">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                                                        <User className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                                                    </div>
                                                    <span className="font-semibold text-sm">{review.user_name}</span>
                                                </div>
                                                <div className="flex text-yellow-500">
                                                    {Array.from({ length: 5 }).map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${i < review.rating ? "fill-current" : "text-gray-300 dark:text-gray-700"}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground leading-relaxed">
                                                "{review.comment}"
                                            </p>
                                            <p className="text-xs text-muted-foreground/50 text-right">
                                                {new Date(review.created_at).toLocaleDateString('tr-TR')}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Review Form */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Bizi Değerlendirin
                        </h3>
                        <Card className="border-0 shadow-lg bg-white/80 dark:bg-black/40 backdrop-blur-md ring-1 ring-gray-200 dark:ring-gray-800">
                            <CardContent className="p-6">
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Adınız Soyadınız</label>
                                        <Input name="name" placeholder="Adınız" required className="bg-white/50 dark:bg-black/20" />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Puanınız</label>
                                        <div className="flex gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <button
                                                    type="button"
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className="focus:outline-none transition-transform hover:scale-110"
                                                >
                                                    <Star
                                                        className={`h-8 w-8 transition-colors ${rating >= star ? "fill-yellow-500 text-yellow-500" : "text-gray-300 dark:text-gray-700"}`}
                                                    />
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Yorumunuz</label>
                                        <Textarea
                                            name="comment"
                                            placeholder="Görüş ve önerileriniz..."
                                            required
                                            className="min-h-[100px] bg-white/50 dark:bg-black/20"
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        disabled={submitting}
                                        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:from-indigo-700 hover:to-violet-700"
                                    >
                                        {submitting ? "Gönderiliyor..." : (
                                            <>
                                                Gönder <Send className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </section>
    );
}
