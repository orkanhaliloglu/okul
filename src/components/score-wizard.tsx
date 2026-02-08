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
    const [inputs, setInputs] = useState<Record<string, { correct: number; wrong: number }>>(() => {
        const initialStates: any = {};
        subjects.forEach(s => {
            initialStates[s.id] = { correct: 0, wrong: 0 };
        });
        return initialStates;
    });

    const [result, setResult] = useState<{ score: number; difference: number | null } | null>(null);

    const handleInputChange = (subjectId: string, field: 'correct' | 'wrong', value: string) => {
        const numVal = parseInt(value) || 0;
        const currentSubject = subjects.find(s => s.id === subjectId);

        if (!currentSubject) return;

        setInputs(prev => {
            const newState = { ...prev };
            // Validation: correct + wrong <= maxQuestions
            const otherField = field === 'correct' ? 'wrong' : 'correct';
            const totalQuestions = numVal + newState[subjectId][otherField];

            if (totalQuestions <= currentSubject.maxQuestions) {
                newState[subjectId] = { ...newState[subjectId], [field]: numVal };
            }
            return newState;
        });
    };

    const calculateScore = () => {
        let weightedNets = 0;

        subjects.forEach(sub => {
            const { correct, wrong } = inputs[sub.id];
            const net = correct - (wrong / 3);
            weightedNets += net * sub.coefficient;
        });

        // Approximate Formula for 2024: Base ~195 + (WeightedNet * ~1.1296)
        const baseScore = 195;
        const multiplier = 1.12963;

        let calculatedDetails = (weightedNets * multiplier) + baseScore;

        // Cap at 500 and floor at 195
        if (calculatedDetails > 500) calculatedDetails = 500;
        if (calculatedDetails < 195) calculatedDetails = 195;

        const score = Number(calculatedDetails.toFixed(3));
        const difference = targetScore !== undefined ? Number((score - targetScore).toFixed(3)) : null;

        setResult({
            score,
            difference
        });
    };

    return (
        <div className="grid md:grid-cols-2 gap-8">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Calculator className="h-5 w-5" />
                        Net Sihirbazı
                    </CardTitle>
                    <CardDescription>
                        Derslerdeki doğru ve yanlış sayılarını girerek puanını hesapla.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="grid grid-cols-4 gap-4 mb-2 font-medium text-sm text-muted-foreground text-center">
                            <div className="col-span-2 text-left">Ders</div>
                            <div>Doğru</div>
                            <div>Yanlış</div>
                        </div>
                        {subjects.map(subject => (
                            <div key={subject.id} className="grid grid-cols-4 gap-4 items-center">
                                <label className="col-span-2 text-sm font-medium">{subject.name} <span className="text-xs text-muted-foreground">({subject.maxQuestions} Soru)</span></label>
                                <Input
                                    type="number"
                                    min="0"
                                    max={subject.maxQuestions}
                                    value={inputs[subject.id].correct || ''}
                                    onChange={(e) => handleInputChange(subject.id, 'correct', e.target.value)}
                                    className="text-center"
                                />
                                <Input
                                    type="number"
                                    min="0"
                                    max={subject.maxQuestions}
                                    value={inputs[subject.id].wrong || ''}
                                    onChange={(e) => handleInputChange(subject.id, 'wrong', e.target.value)}
                                    className="text-center"
                                />
                            </div>
                        ))}
                    </div>
                    <Button onClick={calculateScore} className="w-full mt-6">
                        Hesapla
                    </Button>
                </CardContent>
            </Card>

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
                                Bir lise sayfasından bu aracı kullandığında hedef puan burada görünür.
                            </p>
                        </CardContent>
                    </Card>
                )}

                {result && (
                    <Card className={result.difference !== null && result.difference < 0 ? "border-red-500 bg-red-50 dark:bg-red-900/10" : "border-green-500 bg-green-50 dark:bg-green-900/10"}>
                        <CardHeader>
                            <CardTitle className="flex items-center justify-center gap-2">
                                {result.difference !== null && result.difference < 0 ? <XCircle className="h-6 w-6 text-red-600" /> : <CheckCircle className="h-6 w-6 text-green-600" />}
                                Tahmini Puanın: {result.score}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="text-center space-y-2">
                            {result.difference !== null ? (
                                <>
                                    <p className={result.difference >= 0 ? "text-green-700 dark:text-green-400 font-medium" : "text-red-700 dark:text-red-400 font-medium"}>
                                        {result.difference >= 0
                                            ? `Tebrikler! ${schoolName} puanını geçiyorsun.`
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
