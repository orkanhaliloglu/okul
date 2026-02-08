"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calculator, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface Subject {
    id: string;
    name: string;
    coefficient: number;
    maxQuestions: number;
}

const subjects: Subject[] = [
    { id: "turkce", name: "Türkçe", coefficient: 4, maxQuestions: 20 },
    { id: "mat", name: "Matematik", coefficient: 4, maxQuestions: 20 },
    { id: "fen", name: "Fen Bilimleri", coefficient: 4, maxQuestions: 20 },
    { id: "inkilap", name: "T.C. İnkılap Tarihi", coefficient: 1, maxQuestions: 10 },
    { id: "din", name: "Din Kültürü", coefficient: 1, maxQuestions: 10 },
    { id: "dil", name: "Yabancı Dil", coefficient: 1, maxQuestions: 10 },
];

interface ScoreWizardProps {
    targetScore?: number;
    schoolName?: string;
}

export function ScoreWizard({ targetScore, schoolName }: ScoreWizardProps) {
    const [examType, setExamType] = useState<'LGS' | 'YKS'>('LGS');
    const [yksField, setYksField] = useState<'SAY' | 'EA' | 'SÖZ' | 'DİL'>('SAY');
    const [diplomaScore, setDiplomaScore] = useState<number | ''>('');

    // LGS State
    const [lgsInputs, setLgsInputs] = useState<Record<string, { correct: number; wrong: number }>>(() => {
        const initialStates: any = {};
        subjects.forEach(s => {
            initialStates[s.id] = { correct: 0, wrong: 0 };
        });
        return initialStates;
    });

    // YKS State
    const [yksInputs, setYksInputs] = useState<Record<string, { correct: number; wrong: number }>>({
        // TYT
        tytTurkce: { correct: 0, wrong: 0 },
        tytSosyal: { correct: 0, wrong: 0 },
        tytMat: { correct: 0, wrong: 0 },
        tytFen: { correct: 0, wrong: 0 },
        // AYT
        aytMat: { correct: 0, wrong: 0 },
        aytFizik: { correct: 0, wrong: 0 },
        aytKimya: { correct: 0, wrong: 0 },
        aytBiyoloji: { correct: 0, wrong: 0 },
        aytEdebiyat: { correct: 0, wrong: 0 },
        aytTarih1: { correct: 0, wrong: 0 },
        aytCografya1: { correct: 0, wrong: 0 },
        aytTarih2: { correct: 0, wrong: 0 },
        aytCografya2: { correct: 0, wrong: 0 },
        aytFelsefe: { correct: 0, wrong: 0 },
        aytDin: { correct: 0, wrong: 0 },
        // YDT
        ydtDil: { correct: 0, wrong: 0 },
    });

    const [result, setResult] = useState<{ score: number; difference: number | null } | null>(null);

    const handleLgsInputChange = (subjectId: string, field: 'correct' | 'wrong', value: string) => {
        const numVal = parseInt(value) || 0;
        const currentSubject = subjects.find(s => s.id === subjectId);
        if (!currentSubject) return;

        setLgsInputs(prev => {
            const newState = { ...prev };
            const otherField = field === 'correct' ? 'wrong' : 'correct';
            if (numVal + newState[subjectId][otherField] <= currentSubject.maxQuestions) {
                newState[subjectId] = { ...newState[subjectId], [field]: numVal };
            }
            return newState;
        });
    };

    const handleYksInputChange = (subjectId: string, field: 'correct' | 'wrong', value: string, maxQ: number) => {
        const numVal = parseInt(value) || 0;
        setYksInputs(prev => {
            const newState = { ...prev };
            const otherField = field === 'correct' ? 'wrong' : 'correct';
            if (numVal + newState[subjectId][otherField] <= maxQ) {
                newState[subjectId] = { ...newState[subjectId], [field]: numVal };
            }
            return newState;
        });
    };

    const calculateScore = () => {
        let score = 0;

        if (examType === 'LGS') {
            let weightedNets = 0;
            subjects.forEach(sub => {
                const { correct, wrong } = lgsInputs[sub.id];
                const net = correct - (wrong / 3);
                weightedNets += net * sub.coefficient;
            });
            // 2024 Approx
            const baseScore = 195;
            const multiplier = 1.12963;
            let calculated = (weightedNets * multiplier) + baseScore;
            if (calculated > 500) calculated = 500;
            if (calculated < 195) calculated = 195;
            score = Number(calculated.toFixed(3));
        } else {
            // YKS Calculation (Simplified Approx)
            // Base score: 100 + OBP
            // OBP = Diploma * 0.6
            const obp = (typeof diplomaScore === 'number' ? diplomaScore : 0) * 0.6;

            // TYT Nets
            const tytNet = (id: string) => yksInputs[id].correct - (yksInputs[id].wrong / 4);
            const tytScore = (
                (tytNet('tytTurkce') * 3.3) +
                (tytNet('tytSosyal') * 3.4) +
                (tytNet('tytMat') * 3.3) +
                (tytNet('tytFen') * 3.4)
            ) + 100 + obp;

            // AYT/YDT part
            let alanScore = 0;
            if (yksField === 'SAY') {
                alanScore = (
                    (tytNet('tytTurkce') * 1.32) + (tytNet('tytSosyal') * 1.36) + (tytNet('tytMat') * 1.32) + (tytNet('tytFen') * 1.36) + // TYT Contribution (40%)
                    (tytNet('aytMat') * 3) +
                    (tytNet('aytFizik') * 2.85) +
                    (tytNet('aytKimya') * 3.07) +
                    (tytNet('aytBiyoloji') * 3.07)
                );
            } else if (yksField === 'EA') {
                alanScore = (
                    (tytNet('tytTurkce') * 1.32) + (tytNet('tytSosyal') * 1.36) + (tytNet('tytMat') * 1.32) + (tytNet('tytFen') * 1.36) +
                    (tytNet('aytMat') * 3) +
                    (tytNet('aytEdebiyat') * 3) +
                    (tytNet('aytTarih1') * 2.8) +
                    (tytNet('aytCografya1') * 3.33)
                );
            } else if (yksField === 'SÖZ') {
                alanScore = (
                    (tytNet('tytTurkce') * 1.32) + (tytNet('tytSosyal') * 1.36) + (tytNet('tytMat') * 1.32) + (tytNet('tytFen') * 1.36) +
                    (tytNet('aytEdebiyat') * 3) + (tytNet('aytTarih1') * 2.8) + (tytNet('aytCografya1') * 3.33) +
                    (tytNet('aytTarih2') * 2.91) + (tytNet('aytCografya2') * 2.91) + (tytNet('aytFelsefe') * 3) + (tytNet('aytDin') * 3) // Approx group coeff
                );
            } else if (yksField === 'DİL') {
                alanScore = (
                    (tytNet('tytTurkce') * 1.32) + (tytNet('tytSosyal') * 1.36) + (tytNet('tytMat') * 1.32) + (tytNet('tytFen') * 1.36) +
                    (tytNet('ydtDil') * 3)
                );
            }

            // Normalize and add Base + OBP
            // This is a very rough approximation as real coefficients change yearly and depend on standard deviation.
            // A more simpler approach roughly: TYT %40, AYT %60.
            // Let's use a simpler heuristic for demo:
            // Score = 100 + OBP + (Total Weighted Net * Coeff)
            // But let's assume 'alanScore' covers the raw points from questions.
            // We just add 100 base + OBP.
            score = 100 + obp + alanScore;

            // Cap at 560 (500 + 60 OBP)
            if (score > 560) score = 560;
            if (score < 100) score = 100;
            score = Number(score.toFixed(3));
        }

        const difference = targetScore !== undefined ? Number((score - targetScore).toFixed(3)) : null;
        setResult({ score, difference });
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
                {/* Exam Type Toggle */}
                <div className="flex p-1 bg-muted rounded-lg">
                    <button
                        onClick={() => { setExamType('LGS'); setResult(null); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${examType === 'LGS' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        LGS Hesaplama
                    </button>
                    <button
                        onClick={() => { setExamType('YKS'); setResult(null); }}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${examType === 'YKS' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        YKS (Üniversite) Hesaplama
                    </button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calculator className="h-5 w-5" />
                            {examType === 'LGS' ? 'LGS Net Sihirbazı' : 'YKS Net Sihirbazı'}
                        </CardTitle>
                        <CardDescription>
                            {examType === 'LGS' ? 'Derslerdeki doğru ve yanlış sayılarını girerek LGS puanını hesapla.' : 'TYT ve AYT/YDT netlerinle yerleştirme puanını hesapla.'}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {examType === 'LGS' ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-4 gap-4 mb-2 font-medium text-sm text-muted-foreground text-center">
                                    <div className="col-span-2 text-left">Ders</div>
                                    <div>Doğru</div>
                                    <div>Yanlış</div>
                                </div>
                                {subjects.map(subject => (
                                    <div key={subject.id} className="grid grid-cols-4 gap-4 items-center">
                                        <label className="col-span-2 text-sm font-medium">{subject.name} <span className="text-xs text-muted-foreground">({subject.maxQuestions})</span></label>
                                        <Input
                                            type="number" min="0" max={subject.maxQuestions}
                                            value={lgsInputs[subject.id].correct || ''}
                                            onChange={(e) => handleLgsInputChange(subject.id, 'correct', e.target.value)}
                                            className="text-center"
                                        />
                                        <Input
                                            type="number" min="0" max={subject.maxQuestions}
                                            value={lgsInputs[subject.id].wrong || ''}
                                            onChange={(e) => handleLgsInputChange(subject.id, 'wrong', e.target.value)}
                                            className="text-center"
                                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Field Selection */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Puan Türü</label>
                                    <div className="flex gap-2">
                                        {['SAY', 'EA', 'SÖZ', 'DİL'].map((field) => (
                                            <Button
                                                key={field}
                                                variant={yksField === field ? "default" : "outline"}
                                                size="sm"
                                                onClick={() => setYksField(field as any)}
                                                className="flex-1"
                                            >
                                                {field}
                                            </Button>
                                        ))}
                                    </div>
                                </div>

                                {/* Diploma Score */}
                                <div>
                                    <label className="text-sm font-medium mb-2 block">Diploma Notu (OBP)</label>
                                    <Input
                                        type="number" min="50" max="100" placeholder="Örn: 85"
                                        value={diplomaScore}
                                        onChange={(e) => {
                                            const val = parseFloat(e.target.value);
                                            if (!isNaN(val) && val <= 100) setDiplomaScore(val);
                                            else if (e.target.value === '') setDiplomaScore('');
                                        }}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">Diploma notu 0.6 ile çarpılarak puana eklenir.</p>
                                </div>

                                {/* TYT Inputs (Common) */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm border-b pb-1">TYT (Temel Yeterlilik)</h4>
                                    <div className="grid grid-cols-4 gap-2 text-xs text-center text-muted-foreground">
                                        <div className="col-span-2 text-left">Ders</div><div>D</div><div>Y</div>
                                    </div>
                                    {[
                                        { id: 'tytTurkce', name: 'Türkçe', max: 40 },
                                        { id: 'tytSosyal', name: 'Sosyal', max: 20 },
                                        { id: 'tytMat', name: 'Matematik', max: 40 },
                                        { id: 'tytFen', name: 'Fen', max: 20 },
                                    ].map(sub => (
                                        <div key={sub.id} className="grid grid-cols-4 gap-2 items-center">
                                            <label className="col-span-2 text-sm">{sub.name}</label>
                                            <Input type="number" className="h-8 text-center" placeholder="0"
                                                value={yksInputs[sub.id].correct || ''}
                                                onChange={(e) => handleYksInputChange(sub.id, 'correct', e.target.value, sub.max)}
                                            />
                                            <Input type="number" className="h-8 text-center" placeholder="0"
                                                value={yksInputs[sub.id].wrong || ''}
                                                onChange={(e) => handleYksInputChange(sub.id, 'wrong', e.target.value, sub.max)}
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* AYT/YDT Inputs (Dynamic) */}
                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm border-b pb-1">{yksField === 'DİL' ? 'YDT (Yabancı Dil)' : 'AYT (Alan Yeterlilik)'}</h4>

                                    {yksField === 'SAY' && [
                                        { id: 'aytMat', name: 'Matematik', max: 40 },
                                        { id: 'aytFizik', name: 'Fizik', max: 14 },
                                        { id: 'aytKimya', name: 'Kimya', max: 13 },
                                        { id: 'aytBiyoloji', name: 'Biyoloji', max: 13 },
                                    ].map(sub => (
                                        <div key={sub.id} className="grid grid-cols-4 gap-2 items-center">
                                            <label className="col-span-2 text-sm">{sub.name}</label>
                                            <Input type="number" className="h-8 text-center" value={yksInputs[sub.id].correct || ''} onChange={(e) => handleYksInputChange(sub.id, 'correct', e.target.value, sub.max)} />
                                            <Input type="number" className="h-8 text-center" value={yksInputs[sub.id].wrong || ''} onChange={(e) => handleYksInputChange(sub.id, 'wrong', e.target.value, sub.max)} />
                                        </div>
                                    ))}

                                    {yksField === 'EA' && [
                                        { id: 'aytMat', name: 'Matematik', max: 40 },
                                        { id: 'aytEdebiyat', name: 'Edebiyat', max: 24 },
                                        { id: 'aytTarih1', name: 'Tarih-1', max: 10 },
                                        { id: 'aytCografya1', name: 'Coğrafya-1', max: 6 },
                                    ].map(sub => (
                                        <div key={sub.id} className="grid grid-cols-4 gap-2 items-center">
                                            <label className="col-span-2 text-sm">{sub.name}</label>
                                            <Input type="number" className="h-8 text-center" value={yksInputs[sub.id].correct || ''} onChange={(e) => handleYksInputChange(sub.id, 'correct', e.target.value, sub.max)} />
                                            <Input type="number" className="h-8 text-center" value={yksInputs[sub.id].wrong || ''} onChange={(e) => handleYksInputChange(sub.id, 'wrong', e.target.value, sub.max)} />
                                        </div>
                                    ))}

                                    {yksField === 'SÖZ' && [
                                        { id: 'aytEdebiyat', name: 'Edebiyat', max: 24 },
                                        { id: 'aytTarih1', name: 'Tarih-1', max: 10 },
                                        { id: 'aytCografya1', name: 'Coğrafya-1', max: 6 },
                                        { id: 'aytTarih2', name: 'Tarih-2', max: 11 },
                                        { id: 'aytCografya2', name: 'Coğrafya-2', max: 11 },
                                        { id: 'aytFelsefe', name: 'Felsefe Grb.', max: 12 },
                                        { id: 'aytDin', name: 'Din Kült.', max: 6 },
                                    ].map(sub => (
                                        <div key={sub.id} className="grid grid-cols-4 gap-2 items-center">
                                            <label className="col-span-2 text-sm">{sub.name}</label>
                                            <Input type="number" className="h-8 text-center" value={yksInputs[sub.id].correct || ''} onChange={(e) => handleYksInputChange(sub.id, 'correct', e.target.value, sub.max)} />
                                            <Input type="number" className="h-8 text-center" value={yksInputs[sub.id].wrong || ''} onChange={(e) => handleYksInputChange(sub.id, 'wrong', e.target.value, sub.max)} />
                                        </div>
                                    ))}

                                    {yksField === 'DİL' && [
                                        { id: 'ydtDil', name: 'Yabancı Dil', max: 80 },
                                    ].map(sub => (
                                        <div key={sub.id} className="grid grid-cols-4 gap-2 items-center">
                                            <label className="col-span-2 text-sm">{sub.name}</label>
                                            <Input type="number" className="h-8 text-center" value={yksInputs[sub.id].correct || ''} onChange={(e) => handleYksInputChange(sub.id, 'correct', e.target.value, sub.max)} />
                                            <Input type="number" className="h-8 text-center" value={yksInputs[sub.id].wrong || ''} onChange={(e) => handleYksInputChange(sub.id, 'wrong', e.target.value, sub.max)} />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <Button onClick={calculateScore} className="w-full mt-6 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white">
                            Hesapla
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-6">
                {targetScore !== undefined ? (
                    <Card className="bg-muted/50 border-dashed">
                        <CardHeader>
                            <CardTitle className="text-center">Hedef Okul Puanı</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                            <span className="text-4xl font-bold text-primary">{targetScore}</span>
                        </CardContent>
                    </Card>
                ) : (
                    <Card className="bg-muted/50 border-dashed h-40 flex items-center justify-center">
                        <CardContent className="text-center p-6">
                            <p className="text-muted-foreground">
                                Bir okul sayfasından bu aracı kullandığında hedef puan burada görünür.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {result && (
                    <Card className={result.difference !== null && result.difference < 0 ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-green-500 bg-green-50 dark:bg-green-900/10 animate-in zoom-in-95 duration-300"}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                {result.difference !== null && result.difference < 0 ? <XCircle className="h-6 w-6 text-red-600" /> : <CheckCircle className="h-6 w-6 text-green-600" />}
                                Tahmini {examType} Puanın: <span className="text-3xl">{result.score}</span>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                            {result.difference !== null ? (
                                <>
                                    <p className={result.difference >= 0 ? "text-green-700 dark:text-green-400 font-medium" : "text-red-700 dark:text-red-400 font-medium"}>
                                        {result.difference >= 0
                                            ? `Tebrikler! ${schoolName || 'Hedef'} puanını geçiyorsun.`
                                            : `Bu okulu kazanmak için yaklaşık ${Math.abs(result.difference).toFixed(2)} puana daha ihtiyacın var.`
                                        }
                                    </p>
                                    {result.difference < 0 && (
                                        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <span>Biraz daha çalışarak bu farkı kapatabilirsin!</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <p className="text-green-700 dark:text-green-400 font-medium">
                                    Puanın hesaplandı. Okul detay sayfalarında bu puanı hedeflerinle karşılaştırabilirsin.
                                </p>
                            )}
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
