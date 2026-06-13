"use client";

import { useParams } from 'next/dist/client/components/navigation';
import { useState, useEffect } from 'react';

export default function PredictionPage() {
    const params = useParams();

    const [prediction, setPrediction] = useState<any>([]);
    const [matchId, setMatchId] = useState<number>(0);
    const handlePredict = async () => {

        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prediction/predict-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchId, model: 'Open Router' }),
        });
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prediction/predict-match`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ matchId, model: 'Google Gemini 2.5 Flash' }),
        });
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prediction/${matchId}`);
        const data = await response.json();
        setPrediction(data);
    }

    useEffect(() => {
        const fetchPrediction = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/prediction/${matchId}`);
            const data = await response.json();
            setPrediction(data);
        };
        if (params.matchId) {
            setMatchId(Number(params.matchId));
            fetchPrediction();
        }
    }, [params.matchId]);

    return (
        <div>
            <div className='mt-40'></div>
            <button className='ml-10 bg-blue-500 text-white p-2 rounded' onClick={handlePredict}>Manual Prediction</button>
            <div className='mt-10'>
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