"use client";

import { useState, useEffect } from 'react';

export default function LogsPage() {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/log`);
            const data = await response.json();
            setLogs(data);
        };

        fetchLogs();
    }, []);

    return (
        <div>
            <div className='mt-40'></div>
            <div>
                {logs.length > 0 ? (
                    <div className='border p-4 mb-4 flex flex-col gap-2'>
                        {logs.map((log) => (
                            <p key={log.id}>{log.createdAt} {log.jobType} {log.status}: {log.message}</p>
                        ))}
                    </div>
                ) : (
                    <p>No logs available.</p>
                )}
            </div>
        </div>
    );
}