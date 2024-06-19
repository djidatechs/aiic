"use client";
import { useState } from 'react';

function Send() {
    const [results, setResults] = useState(null);
    const [error, setError] = useState(null);
    

    const handleFetch = async () => {
        try {
            const params = "1"
            const response = await fetch(`/api/admin/workinghours/get/filter?startTime[min]=1970-01-01T13:00:00.000Z`);
            const data = await response.json();

            if (response.ok) {
                setResults(data);
                setError(null);
            } else {
                setError(data.error);
                setResults(null);
            }
        } catch (err:any) {
            setError(err);
            setResults(null);
        }
    };

    return (
        <div>
            <h1>Test API Endpoint</h1>
            <button onClick={handleFetch}>Fetch Data</button>
            {error && <div style={{ color: 'red' }}>{JSON.stringify(results, null, 2)}</div>}
            {results && (
                <div>
                    <h2>Results:</h2>
                    <pre>{JSON.stringify(results, null, 2)}</pre>
                </div>
            )}
        </div>
    );
}

export default Send;
