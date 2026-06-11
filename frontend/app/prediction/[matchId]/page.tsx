"use client";

import { useParams } from 'next/dist/client/components/navigation';
import { useState, useEffect } from 'react';

export default function PredictionPage() {
    const params = useParams();

    const [prediction, setPrediction] = useState<any>([]);

    useEffect(() => {
        const fetchPrediction = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prediction/${params.matchId}`);
            const data = await response.json();
            setPrediction(data);
        };

        fetchPrediction();
    }, [params.matchId]);

    return (
        <div>
            <div className='mt-40'></div>
            <div>
                {
                    prediction.map((pred: any) => (
                        <div key={pred.id} className='border p-4 mb-4 flex flex-col gap-2'>
                            <p>Predictor: {pred.predictor}</p>
                            <p>Prediction: {pred.homeTeam} {pred.predictedHomeGoals} - {pred.predictedAwayGoals} {pred.awayTeam}</p>
                            <p>Explanation: {pred.explanation}</p>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}