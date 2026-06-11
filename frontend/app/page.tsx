"use client";

import { useState, useEffect } from 'react';


export default function Home() {

  const [matches, setMatches] = useState([]);

  const getAllMatches = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/football/all-matches`);
    const data = await response.json();
    setMatches(data);
    console.log(matches);
  }

  useEffect(() => {
    getAllMatches();
  }, [])

  return (
    <div>
      <div className='mt-40'></div>
      <div className='flex flex-row gap-4 justify-center items-center mb-1em'>
        <button><a href="/logs">Logs</a></button>
        <button><a href={`${process.env.NEXT_PUBLIC_API_URL}/admin/queues`}>Jobs</a></button>
      </div>
      <div>
        {matches.map((match: any) => (
          <div key={match.id} className='border p-4 mb-4 flex flex-row justify-between items-center'>
            <p>{new Date(match.utcDate).toLocaleString()}</p>
            <h2>{match.homeTeam.name} {match.score.fullTime.home} - {match.score.fullTime.away} {match.awayTeam.name}</h2>
            <button>
              <a href={`/prediction/${match.id}`}>
                View Prediction
              </a>
            </button>
          </div>
        ))}
      </div>
    </div>
  )

}