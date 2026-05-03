import React from 'react';

const JsonResponse = ({ data, status, endpoint, pillClass }) => {
    const syntaxHighlight = (json) => {
        if (!json) return '—';
        const strJson = JSON.stringify(json, null, 2);
        return strJson.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, match => {
            let cls = 'num';
            if (/^"/.test(match)) cls = /:$/.test(match) ? 'key' : 'str';
            else if (/true|false/.test(match)) cls = 'bool';
            else if (/null/.test(match)) cls = 'null';
            return `<span class="${cls}">${match}</span>`;
        });
    };

    return (
        <div className="response">
            <div className="response-head">
                <span className="response-label">{endpoint}</span>
                <span className={`status-pill ${pillClass}`}>{status}</span>
            </div>
            <div className="response-body" dangerouslySetInnerHTML={{ __html: syntaxHighlight(data) }}></div>
        </div>
    );
};

export default JsonResponse;
