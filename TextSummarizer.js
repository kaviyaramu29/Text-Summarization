import React, { useState } from 'react';

const TextSummarizer = () => {
    const [text, setText] = useState('');
    const [abstractive, setAbstractive] = useState('');
    const [extractive, setExtractive] = useState('');
    const [loading, setLoading] = useState(false);

    const [minLength, setMinLength] = useState(30);
    const [maxLength, setMaxLength] = useState(130);
    const [numSentences, setNumSentences] = useState(3);

    const handleSummarize = async () => {
        setLoading(true);

        const response = await fetch('http://127.0.0.1:5000/summarize', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text,
                min_length: minLength,
                max_length: maxLength,
                num_sentences: numSentences
            }),
        });

        const data = await response.json();
        setAbstractive(data.abstractive);
        setExtractive(data.extractive);
        setLoading(false);
    };

    return (
        <div className="app-container">
            <div className="card">
                <h1>Text Summarizer</h1>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste article here..."
                />

                <div style={{ marginBottom: '10px' }}>
                    <label>Min Length: </label>
                    <input type="number" value={minLength} onChange={e => setMinLength(e.target.value)} />

                    <label style={{ marginLeft: '10px' }}>Max Length: </label>
                    <input type="number" value={maxLength} onChange={e => setMaxLength(e.target.value)} />

                    <label style={{ marginLeft: '10px' }}>Extractive Sentences: </label>
                    <input type="number" value={numSentences} onChange={e => setNumSentences(e.target.value)} />
                </div>

                <button onClick={handleSummarize} disabled={loading}>
                    {loading ? 'Summarizing...' : 'Summarize'}
                </button>

                {abstractive && (
                    <div className="summary-box">
                        <h3>Abstractive Summary:</h3>
                        <p>{abstractive}</p>
                    </div>
                )}
                {extractive && (
                    <div className="summary-box">
                        <h3>Extractive Summary:</h3>
                        <p>{extractive}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TextSummarizer;
