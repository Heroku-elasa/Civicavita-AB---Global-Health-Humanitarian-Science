import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../types';

interface AIProvider {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  endpoint: string;
  model: string;
  apiKeyEnvVar: string;
  hasApiKey: boolean;
  limits: {
    requestsPerMinute: number;
    requestsPerDay: number;
    tokensPerMinute: number;
  };
  usage: {
    requestsToday: number;
    tokensToday: number;
    errorsToday: number;
  };
}

interface AILog {
  id: number;
  timestamp: string;
  providerId: string;
  functionName: string;
  status: 'success' | 'error' | 'fallback';
  durationMs: number;
  tokensUsed: number;
  errorMessage?: string;
}

interface TestResult {
  success: boolean;
  message: string;
  duration?: number;
}

const API_BASE = '/api/admin/ai';

const AIDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'providers' | 'usage' | 'logs' | 'debug'>('providers');
  const [providers, setProviders] = useState<AIProvider[]>([]);
  const [logs, setLogs] = useState<AILog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [testingProvider, setTestingProvider] = useState<string | null>(null);
  const [testPrompt, setTestPrompt] = useState('Explain quantum computing in one sentence.');
  const [testResponse, setTestResponse] = useState<{ text: string; provider: string; duration: number } | null>(null);
  const [testingFunction, setTestingFunction] = useState(false);
  const [logFilter, setLogFilter] = useState({ status: '', provider: '' });
  const [healthCheckRunning, setHealthCheckRunning] = useState(false);

  const fetchProviders = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/providers`);
      if (!res.ok) throw new Error('Failed to fetch providers');
      const data = await res.json();
      setProviders(data);
    } catch (e) {
      setError((e as Error).message);
    }
  }, []);

  const fetchLogs = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/logs?limit=100`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(data);
    } catch (e) {
      console.error('Failed to fetch logs:', e);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProviders(), fetchLogs()]);
      setLoading(false);
    };
    loadData();
  }, [fetchProviders, fetchLogs]);

  const toggleProvider = async (id: string, enabled: boolean) => {
    try {
      await fetch(`${API_BASE}/providers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled }),
      });
      await fetchProviders();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const testProvider = async (id: string) => {
    setTestingProvider(id);
    try {
      const res = await fetch(`${API_BASE}/providers/${id}/test`, { method: 'POST' });
      const result = await res.json();
      setTestResults((prev) => ({ ...prev, [id]: result }));
    } catch (e) {
      setTestResults((prev) => ({ ...prev, [id]: { success: false, message: (e as Error).message } }));
    }
    setTestingProvider(null);
  };

  const runHealthCheck = async () => {
    setHealthCheckRunning(true);
    try {
      const res = await fetch(`${API_BASE}/health-check`, { method: 'POST' });
      const results = await res.json();
      setTestResults(results);
    } catch (e) {
      setError((e as Error).message);
    }
    setHealthCheckRunning(false);
  };

  const testFunction = async () => {
    setTestingFunction(true);
    setTestResponse(null);
    try {
      const res = await fetch(`${API_BASE}/test-function`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: testPrompt, maxTokens: 500, temperature: 0.7 }),
      });
      const data = await res.json();
      if (data.success) {
        setTestResponse({ text: data.response, provider: data.provider, duration: data.duration });
      } else {
        setError(data.error);
      }
      await fetchLogs();
    } catch (e) {
      setError((e as Error).message);
    }
    setTestingFunction(false);
  };

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs?')) return;
    try {
      await fetch(`${API_BASE}/logs`, { method: 'DELETE' });
      await fetchLogs();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const exportLogs = async (format: 'json' | 'csv') => {
    window.open(`${API_BASE}/logs/export?format=${format}`, '_blank');
  };

  const moveProvider = async (id: string, direction: 'up' | 'down') => {
    const idx = providers.findIndex((p) => p.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === providers.length - 1)) return;

    const newOrder = [...providers];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newOrder[idx], newOrder[swapIdx]] = [newOrder[swapIdx], newOrder[idx]];

    try {
      await fetch(`${API_BASE}/providers/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newOrder.map((p) => p.id) }),
      });
      await fetchProviders();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400';
      case 'error': return 'text-red-400';
      case 'fallback': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (logFilter.status && log.status !== logFilter.status) return false;
    if (logFilter.provider && log.providerId !== logFilter.provider) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">AI Dashboard</h1>
        <p className="text-gray-400">Manage AI providers, monitor usage, and debug AI functions</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-500 rounded-lg text-red-300">
          {error}
          <button onClick={() => setError(null)} className="ml-4 text-red-400 hover:text-red-300">Dismiss</button>
        </div>
      )}

      <div className="flex gap-2 mb-6 border-b border-slate-700">
        {(['providers', 'usage', 'logs', 'debug'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-3 font-medium transition-colors ${
              activeTab === tab
                ? 'text-primary border-b-2 border-primary'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'providers' && (
        <div className="space-y-4">
          <div className="flex gap-4 mb-6">
            <button
              onClick={runHealthCheck}
              disabled={healthCheckRunning}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {healthCheckRunning ? 'Running...' : 'Test All Providers'}
            </button>
          </div>

          <div className="bg-slate-800/50 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-700/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Provider</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Model</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">API Key</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Requests Today</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {providers.map((provider, idx) => (
                  <tr key={provider.id} className="hover:bg-slate-700/30">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => moveProvider(provider.id, 'up')}
                          disabled={idx === 0}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          ▲
                        </button>
                        <span className="text-white font-mono w-6 text-center">{provider.priority}</span>
                        <button
                          onClick={() => moveProvider(provider.id, 'down')}
                          disabled={idx === providers.length - 1}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-30"
                        >
                          ▼
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-white font-medium">{provider.name}</span>
                    </td>
                    <td className="px-4 py-4">
                      <code className="text-sm text-gray-400 bg-slate-900 px-2 py-1 rounded">{provider.model}</code>
                    </td>
                    <td className="px-4 py-4">
                      {provider.hasApiKey ? (
                        <span className="text-emerald-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-emerald-400 rounded-full" /> Configured
                        </span>
                      ) : (
                        <span className="text-red-400 flex items-center gap-1">
                          <span className="w-2 h-2 bg-red-400 rounded-full" /> Missing
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-white">{provider.usage.requestsToday} / {provider.limits.requestsPerDay}</span>
                        <div className="w-24 h-2 bg-slate-700 rounded-full mt-1">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${Math.min((provider.usage.requestsToday / provider.limits.requestsPerDay) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={provider.enabled}
                          onChange={(e) => toggleProvider(provider.id, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                      </label>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => testProvider(provider.id)}
                          disabled={testingProvider === provider.id}
                          className="px-3 py-1 text-sm bg-slate-700 hover:bg-slate-600 text-white rounded transition-colors disabled:opacity-50"
                        >
                          {testingProvider === provider.id ? 'Testing...' : 'Test'}
                        </button>
                        {testResults[provider.id] && (
                          <span className={testResults[provider.id].success ? 'text-emerald-400' : 'text-red-400'}>
                            {testResults[provider.id].success ? '✓' : '✗'}
                            {testResults[provider.id].duration && ` ${testResults[provider.id].duration}ms`}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'usage' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {providers.map((provider) => (
            <div key={provider.id} className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{provider.name}</h3>
                <span className={`text-sm ${provider.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                  {provider.enabled ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Requests Today</span>
                    <span className="text-white">{provider.usage.requestsToday} / {provider.limits.requestsPerDay}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-700 rounded-full">
                    <div
                      className={`h-full rounded-full ${
                        (provider.usage.requestsToday / provider.limits.requestsPerDay) > 0.8
                          ? 'bg-red-500'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min((provider.usage.requestsToday / provider.limits.requestsPerDay) * 100, 100)}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-400">Tokens Used</span>
                    <span className="text-white">{provider.usage.tokensToday.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Errors Today</span>
                    <span className={provider.usage.errorsToday > 0 ? 'text-red-400' : 'text-emerald-400'}>
                      {provider.usage.errorsToday}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={logFilter.status}
              onChange={(e) => setLogFilter((f) => ({ ...f, status: e.target.value }))}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="">All Status</option>
              <option value="success">Success</option>
              <option value="error">Error</option>
              <option value="fallback">Fallback</option>
            </select>

            <select
              value={logFilter.provider}
              onChange={(e) => setLogFilter((f) => ({ ...f, provider: e.target.value }))}
              className="px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
            >
              <option value="">All Providers</option>
              {providers.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>

            <button
              onClick={() => fetchLogs()}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Refresh
            </button>

            <button
              onClick={() => exportLogs('csv')}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
            >
              Export CSV
            </button>

            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-red-600/20 hover:bg-red-600/40 text-red-400 rounded-lg transition-colors"
            >
              Clear Logs
            </button>
          </div>

          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm max-h-[500px] overflow-y-auto">
            {filteredLogs.length === 0 ? (
              <p className="text-gray-500">No logs to display</p>
            ) : (
              filteredLogs.map((log) => (
                <div key={log.id} className="py-2 border-b border-slate-800 last:border-0">
                  <span className="text-gray-500">[{new Date(log.timestamp).toLocaleString()}]</span>
                  {' '}
                  <span className={getStatusColor(log.status)}>[{log.status.toUpperCase()}]</span>
                  {' '}
                  <span className="text-blue-400">[{log.providerId}]</span>
                  {' '}
                  <span className="text-white">{log.functionName}</span>
                  {' - '}
                  {log.status === 'error' ? (
                    <span className="text-red-400">{log.errorMessage}</span>
                  ) : (
                    <span className="text-gray-400">{log.durationMs}ms, {log.tokensUsed} tokens</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'debug' && (
        <div className="space-y-6">
          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Test AI Function</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Test Prompt</label>
                <textarea
                  value={testPrompt}
                  onChange={(e) => setTestPrompt(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Enter a test prompt..."
                />
              </div>

              <button
                onClick={testFunction}
                disabled={testingFunction || !testPrompt.trim()}
                className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {testingFunction ? 'Running...' : 'Run Test'}
              </button>

              {testResponse && (
                <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center gap-4 mb-3 text-sm">
                    <span className="text-gray-400">Provider:</span>
                    <span className="text-primary font-medium">{testResponse.provider}</span>
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{testResponse.duration}ms</span>
                  </div>
                  <div className="text-white whitespace-pre-wrap">{testResponse.text}</div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-slate-800/50 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Provider Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider) => (
                <div key={provider.id} className="p-4 bg-slate-900 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{provider.name}</span>
                    <span className={`text-sm ${provider.enabled ? 'text-emerald-400' : 'text-gray-500'}`}>
                      {provider.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-sm text-gray-400 space-y-1">
                    <p>API Key: {provider.hasApiKey ? '****' + provider.apiKeyEnvVar.slice(-4) : 'Not configured'}</p>
                    <p>Model: {provider.model}</p>
                    <p>Priority: {provider.priority}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIDashboard;
