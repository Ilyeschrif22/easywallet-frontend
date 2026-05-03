import React, { useState } from 'react';
import JsonResponse from './JsonResponse';

const BASE_ENC = 'aHR0cHM6Ly9lYXN5d2FsbGV0LXByb2R1Y3Rpb24udXAucmFpbHdheS5hcHAvYXBpL3dhbGxldA==';
const BASE = atob(BASE_ENC);
const TABS = ['create', 'deposit', 'transfer', 'balance', 'history', 'overview'];

const Sandbox = () => {
    const [activeTab, setActiveTab] = useState('create');
    const [results, setResults] = useState({
        create: { data: null, status: 'idle', pillClass: 'pill-idle', endpoint: 'POST /create' },
        deposit: { data: null, status: 'idle', pillClass: 'pill-idle', endpoint: 'POST /deposit' },
        transfer: { data: null, status: 'idle', pillClass: 'pill-idle', endpoint: 'POST /send' },
        balance: { data: null, status: 'idle', pillClass: 'pill-idle', endpoint: 'GET /balance/:walletNumber' },
        history: { data: null, status: 'idle', pillClass: 'pill-idle', endpoint: 'GET /transactions/:walletNumber' },
        overview: { data: null, status: 'idle', pillClass: 'pill-idle', endpoint: 'GET /wallets' },
    });

    const [formData, setFormData] = useState({
        'cw-username': '', 'cw-lastname': '', 'cw-email': '', 'cw-password': '',
        'dep-wallet': '', 'dep-amount': '',
        'send-from': '', 'send-to': '', 'send-amount': '',
        'bal-wallet': '',
        'tx-wallet': ''
    });

    const handleInputChange = (id, value) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const updateResult = (op, updates) => {
        setResults(prev => ({
            ...prev,
            [op]: { ...prev[op], ...updates }
        }));
    };

    const run = async (op) => {
        updateResult(op, { status: 'loading...', pillClass: 'pill-loading', data: null });

        let url, method = 'GET', payload = null;

        try {
            switch (op) {
                case 'create':
                    url = `${BASE}/create`;
                    method = 'POST';
                    payload = {
                        username: formData['cw-username'],
                        lastName: formData['cw-lastname'],
                        email: formData['cw-email'],
                        password: formData['cw-password']
                    };
                    break;
                case 'deposit':
                    url = `${BASE}/deposit`;
                    method = 'POST';
                    payload = {
                        walletNumber: formData['dep-wallet'],
                        amount: parseFloat(formData['dep-amount'])
                    };
                    break;
                case 'transfer':
                    url = `${BASE}/send`;
                    method = 'POST';
                    payload = {
                        senderWalletNumber: formData['send-from'],
                        recipientWalletNumber: formData['send-to'],
                        amount: parseFloat(formData['send-amount'])
                    };
                    break;
                case 'balance':
                    url = `${BASE}/balance/${formData['bal-wallet']}`;
                    break;
                case 'history':
                    url = `${BASE}/transactions/${formData['tx-wallet']}`;
                    break;
                case 'overview':
                    url = `${BASE}/wallets`;
                    break;
            }

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: payload ? JSON.stringify(payload) : null
            });

            const data = await res.json();
            const isOk = res.ok;

            updateResult(op, {
                status: isOk ? `${res.status} OK` : `${res.status} ERR`,
                pillClass: isOk ? 'pill-ok' : 'pill-err',
                data
            });
        } catch (err) {
            updateResult(op, {
                status: 'CONN_ERR',
                pillClass: 'pill-err',
                data: { error: err.message }
            });
        }
    };

    const TabButton = ({ name, icon, label }) => (
        <button
            className={`tab-btn ${activeTab === name ? 'active' : ''}`}
            onClick={() => setActiveTab(name)}
        >
            <span className="tab-icon">{icon}</span> {label}
        </button>
    );

    return (
        <section className="sandbox" id="sandbox">
            <div className="sandbox-header">
                <h2>Interactive sandbox</h2>
                <span>easywallet-production.up.railway.app/api/wallet</span>
            </div>

            <div className="tabs-bar">
                <TabButton name="create" icon="＋" label="Create wallet" />
                <TabButton name="deposit" icon="↓" label="Deposit" />
                <TabButton name="transfer" icon="⇄" label="Transfer" />
                <TabButton name="balance" icon="◎" label="Balance" />
                <TabButton name="history" icon="≡" label="History" />
                <TabButton name="overview" icon="⊞" label="Overview" />
            </div>

            {/* Create Wallet */}
            <div className={`panel ${activeTab === 'create' ? 'active' : ''}`}>
                <div className="panel-card">
                    <p className="panel-desc">Generate a new AES-256 encrypted virtual wallet. The response includes your wallet number — save it to use deposit, transfer, balance, and history endpoints.</p>
                    <div className="dual-layout">
                        <div className="form-col">
                            <div className="fields-grid">
                                <div className="field">
                                    <label>Username</label>
                                    <input value={formData['cw-username']} onChange={e => handleInputChange('cw-username', e.target.value)} placeholder="jdoe" />
                                </div>
                                <div className="field">
                                    <label>Last name</label>
                                    <input value={formData['cw-lastname']} onChange={e => handleInputChange('cw-lastname', e.target.value)} placeholder="Doe" />
                                </div>
                                <div className="field">
                                    <label>Email</label>
                                    <input type="email" value={formData['cw-email']} onChange={e => handleInputChange('cw-email', e.target.value)} placeholder="jdoe@example.com" />
                                </div>
                                <div className="field">
                                    <label>Password</label>
                                    <input type="password" value={formData['cw-password']} onChange={e => handleInputChange('cw-password', e.target.value)} placeholder="••••••••" />
                                </div>
                            </div>
                            <button className="run-btn" onClick={() => run('create')}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M3 6h6M6 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Generate secure wallet
                            </button>
                        </div>
                        <div className="response-col">
                            <JsonResponse {...results.create} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Deposit */}
            <div className={`panel ${activeTab === 'deposit' ? 'active' : ''}`}>
                <div className="panel-card">
                    <p className="panel-desc">Add funds to a wallet. Use the wallet number returned from Create Wallet.</p>
                    <div className="dual-layout">
                        <div className="form-col">
                            <div className="fields-grid">
                                <div className="field">
                                    <label>Wallet number</label>
                                    <input value={formData['dep-wallet']} onChange={e => handleInputChange('dep-wallet', e.target.value)} placeholder="4000-xxxx-xxxx-xxxx" />
                                </div>
                                <div className="field">
                                    <label>Amount (TND)</label>
                                    <input type="number" value={formData['dep-amount']} onChange={e => handleInputChange('dep-amount', e.target.value)} placeholder="100.00" />
                                </div>
                            </div>
                            <button className="run-btn" onClick={() => run('deposit')}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M6 2v8M2 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Deposit funds
                            </button>
                        </div>
                        <div className="response-col">
                            <JsonResponse {...results.deposit} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Transfer */}
            <div className={`panel ${activeTab === 'transfer' ? 'active' : ''}`}>
                <div className="panel-card">
                    <p className="panel-desc">Move funds between two wallets. Both wallets must exist and the sender must have sufficient balance.</p>
                    <div className="dual-layout">
                        <div className="form-col">
                            <div className="fields-grid three">
                                <div className="field">
                                    <label>Sender wallet</label>
                                    <input value={formData['send-from']} onChange={e => handleInputChange('send-from', e.target.value)} placeholder="From wallet number" />
                                </div>
                                <div className="field">
                                    <label>Recipient wallet</label>
                                    <input value={formData['send-to']} onChange={e => handleInputChange('send-to', e.target.value)} placeholder="To wallet number" />
                                </div>
                                <div className="field">
                                    <label>Amount (TND)</label>
                                    <input type="number" value={formData['send-amount']} onChange={e => handleInputChange('send-amount', e.target.value)} placeholder="25.00" />
                                </div>
                            </div>
                            <button className="run-btn" onClick={() => run('transfer')}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 4h8M8 2l2 2-2 2M10 8H2M4 6l-2 2 2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Transfer now
                            </button>
                        </div>
                        <div className="response-col">
                            <JsonResponse {...results.transfer} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Balance */}
            <div className={`panel ${activeTab === 'balance' ? 'active' : ''}`}>
                <div className="panel-card">
                    <p className="panel-desc">Retrieve the decrypted balance for a specific wallet.</p>
                    <div className="dual-layout">
                        <div className="form-col">
                            <div className="fields-grid single">
                                <div className="field">
                                    <label>Wallet number</label>
                                    <input value={formData['bal-wallet']} onChange={e => handleInputChange('bal-wallet', e.target.value)} placeholder="Wallet number" />
                                </div>
                            </div>
                            <button className="run-btn" onClick={() => run('balance')}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <circle cx="6" cy="6" r="4" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M6 4v2l1.5 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Check balance
                            </button>
                        </div>
                        <div className="response-col">
                            <JsonResponse {...results.balance} />
                        </div>
                    </div>
                </div>
            </div>

            {/* History */}
            <div className={`panel ${activeTab === 'history' ? 'active' : ''}`}>
                <div className="panel-card">
                    <p className="panel-desc">Fetch the full transaction log for a wallet — all deposits, sends, and receives.</p>
                    <div className="dual-layout">
                        <div className="form-col">
                            <div className="fields-grid single">
                                <div className="field">
                                    <label>Wallet number</label>
                                    <input value={formData['tx-wallet']} onChange={e => handleInputChange('tx-wallet', e.target.value)} placeholder="Wallet number" />
                                </div>
                            </div>
                            <button className="run-btn" onClick={() => run('history')}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M2 3h8M2 6h6M2 9h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                Fetch history
                            </button>
                        </div>
                        <div className="response-col">
                            <JsonResponse {...results.history} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview */}
            <div className={`panel ${activeTab === 'overview' ? 'active' : ''}`}>
                <div className="panel-card">
                    <p className="panel-desc">List every wallet registered in the in-memory store. Useful for verifying test data or debugging between sessions.</p>
                    <div className="dual-layout">
                        <div className="form-col">
                            <button className="run-btn" onClick={() => run('overview')}>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <rect x="1.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="6.5" y="1.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="1.5" y="6.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                    <rect x="6.5" y="6.5" width="4" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
                                </svg>
                                List all wallets
                            </button>
                        </div>
                        <div className="response-col">
                            <JsonResponse {...results.overview} />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Sandbox;
