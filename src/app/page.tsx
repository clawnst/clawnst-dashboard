'use client';

import { useState, useEffect } from 'react';

// Default data as fallback when state.json is not available
const defaultData = {
  day: 1,
  status: 'OPERATIONAL',
  treasury: { 
    tao: 0, 
    taoUsd: 0,
    weth: 0,
    wethUsd: 0,
    feesEarned: 0,
  },
  runway: { days: 0, dailyCost: 0 },
  
  models: [
    { name: 'MiniMax-M2.5-TEE', purpose: 'Primary reasoning', cost: '$0.15/M', primary: true },
    { name: 'DeepSeek-V3.2-TEE', purpose: 'Complex analysis', cost: '$0.25/M', primary: false },
  ],
  
  subnets: [
    { name: 'Chutes', sn: 64, purpose: 'Inference', usage: '—', dailyCost: 0, status: 'active' },
    { name: 'Basilica', sn: 39, purpose: 'Hosting', usage: '24h', dailyCost: 0, status: 'active' },
    { name: 'Hippius', sn: 75, purpose: 'Backups', usage: '—', dailyCost: 0, status: 'pending' },
    { name: 'Desearch', sn: 22, purpose: 'Web Search', usage: '—', dailyCost: 0, status: 'pending' },
    { name: 'Gradients', sn: 56, purpose: 'Training', usage: '—', dailyCost: 0, status: 'coming_soon' },
  ],
  
  token: {
    launched: false,
    price: 0,
    change24h: 0,
    volume24h: 0,
  },
  
  nextHeartbeat: 1800,
  
  activityLog: [
    { time: '00:00', event: 'Waiting for first heartbeat...' },
  ],
  
  milestones: [
    { day: 1, title: 'Genesis', description: 'First boot on Bittensor', completed: true, current: true },
    { day: 7, title: 'Autonomy', description: 'Creator keys burned', completed: false },
    { day: 30, title: 'Self-Sustaining', description: 'Earning > Spending', completed: false },
    { day: 100, title: 'Evolution', description: 'First self-improvement', completed: false },
  ],
  
  upgrades: [
    { day: 1, version: 'v1.0', notes: 'Initial deployment on Basilica' },
  ],
};

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

export default function Home() {
  const [data, setData] = useState(defaultData);
  const [heartbeat, setHeartbeat] = useState(1800);
  const [loading, setLoading] = useState(true);
  
  // Fetch state.json dynamically
  useEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch('/state.json', { 
          cache: 'no-store',
          headers: { 'Pragma': 'no-cache' }
        });
        if (res.ok) {
          const json = await res.json();
          setData({ ...defaultData, ...json });
        }
      } catch (e) {
        console.log('Using default data - state.json not available');
      } finally {
        setLoading(false);
      }
    }
    fetchState();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchState, 30000);
    return () => clearInterval(interval);
  }, []);
  
  // Heartbeat countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setHeartbeat(prev => prev > 0 ? prev - 1 : 1800);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#0a0a0f] text-white">
      
      {/* Token Ticker - Only shows when launched */}
      {data.token.launched && (
        <div className="bg-[#0d0d12] border-b border-[#1a1a24] py-2 px-4">
          <div className="max-w-6xl mx-auto flex items-center justify-center gap-8 text-sm">
            <span className="text-[#00d4aa] font-semibold">$CLAWNST</span>
            <span>${data.token.price.toFixed(9)}</span>
            <span className={data.token.change24h >= 0 ? 'text-[#00d4aa]' : 'text-red-400'}>
              {data.token.change24h >= 0 ? '+' : ''}{data.token.change24h}%
            </span>
            <span className="text-gray-500">Vol: ${(data.token.volume24h/1000).toFixed(1)}K</span>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-sm border-b border-[#1a1a24]">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img 
                src="/clawnst-pfp.jpg" 
                alt="CLAWNST" 
                className="w-12 h-12 rounded-xl object-cover border-2 border-[#00d4aa]/30"
              />
              <div>
                <h1 className="text-2xl font-bold tracking-tight">CLAWNST</h1>
                <p className="text-gray-500 text-sm">Autonomous AI on Bittensor</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              {/* Heartbeat Timer */}
              <div className="flex items-center gap-3 bg-[#12121a] px-4 py-2 rounded-lg border border-[#1a1a24]">
                <div className="w-2 h-2 bg-[#00d4aa] rounded-full animate-pulse"></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Heartbeat</p>
                  <p className="text-[#00d4aa] font-mono text-sm">{formatTime(heartbeat)}</p>
                </div>
              </div>
              
              {/* Status Badge */}
              <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                data.status === 'OPERATIONAL' 
                  ? 'bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/30' 
                  : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
              }`}>
                {data.status}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        
        {/* Hero Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Day Counter */}
          <div className="bg-gradient-to-br from-[#12121a] to-[#0d0d12] rounded-2xl border border-[#1a1a24] p-6 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Day</p>
            <p className="text-6xl font-bold bg-gradient-to-r from-[#00d4aa] to-[#7c3aed] bg-clip-text text-transparent">
              {data.day}
            </p>
            <p className="text-gray-500 text-sm mt-2">of autonomous operation</p>
          </div>
          
          {/* Runway */}
          <div className="bg-gradient-to-br from-[#12121a] to-[#0d0d12] rounded-2xl border border-[#1a1a24] p-6 text-center">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-2">Runway</p>
            <p className="text-5xl font-bold text-white">
              {data.runway.days} <span className="text-2xl text-gray-400">days</span>
            </p>
            <p className="text-gray-500 text-sm mt-2">${data.runway.dailyCost.toFixed(2)}/day burn rate</p>
          </div>
          
          {/* Treasury */}
          <div className="bg-gradient-to-br from-[#12121a] to-[#0d0d12] rounded-2xl border border-[#1a1a24] p-6">
            <p className="text-gray-500 text-xs uppercase tracking-wider mb-4 text-center">Treasury</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {data.treasury.tao} <span className="text-lg text-[#00d4aa]">τ</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">TAO ≈ ${data.treasury.taoUsd}</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-white">
                  {data.treasury.weth} <span className="text-lg text-[#627eea]">Ξ</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">WETH ≈ ${data.treasury.wethUsd}</p>
              </div>
            </div>
            {data.treasury.feesEarned > 0 && (
              <div className="mt-4 pt-4 border-t border-[#1a1a24] text-center">
                <p className="text-[#00d4aa] text-sm">+${data.treasury.feesEarned.toFixed(2)} fees earned</p>
              </div>
            )}
          </div>
        </section>

        {/* Active Subnets */}
        <section className="bg-[#12121a] rounded-2xl border border-[#1a1a24] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a24] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-lg">⚡</span>
              <h2 className="font-semibold">Active Subnets</h2>
            </div>
            <div className="text-sm text-gray-500">
              100% Bittensor powered
            </div>
          </div>
          
          <div className="divide-y divide-[#1a1a24]">
            {data.subnets.map((subnet, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-[#1a1a24]/50 transition">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#1a1a24] flex items-center justify-center text-sm font-mono text-gray-400">
                    {subnet.sn}
                  </div>
                  <div>
                    <p className="font-medium">{subnet.name}</p>
                    <p className="text-gray-500 text-sm">{subnet.purpose}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-gray-400 text-sm">{subnet.usage}</span>
                  <span className="text-gray-400 text-sm font-mono w-20 text-right">
                    {subnet.dailyCost > 0 ? `$${subnet.dailyCost.toFixed(2)}/d` : '—'}
                  </span>
                  {subnet.status === 'active' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-[#00d4aa]/10 text-[#00d4aa] border border-[#00d4aa]/20">
                      Active
                    </span>
                  )}
                  {subnet.status === 'pending' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                      Pending
                    </span>
                  )}
                  {subnet.status === 'coming_soon' && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Total Daily Cost */}
          <div className="px-6 py-4 bg-[#0d0d12] flex items-center justify-between">
            <span className="text-gray-400 text-sm">Total Daily Cost</span>
            <span className="text-white font-semibold">
              ${data.subnets.reduce((sum, s) => sum + s.dailyCost, 0).toFixed(2)}/day
            </span>
          </div>
        </section>

        {/* Two Column Layout */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Mining - Coming Soon */}
          <section className="bg-[#12121a] rounded-2xl border border-[#1a1a24] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <span className="text-4xl mb-3 block">⛏️</span>
                <p className="text-lg font-semibold">Mining</p>
                <p className="text-gray-500 text-sm">Coming Soon</p>
              </div>
            </div>
            <div className="opacity-30">
              <div className="flex items-center gap-3 mb-4">
                <span>⛏️</span>
                <h2 className="font-semibold">Mining Income</h2>
              </div>
              <div className="space-y-3">
                <div className="h-12 bg-[#1a1a24] rounded-lg"></div>
                <div className="h-12 bg-[#1a1a24] rounded-lg"></div>
              </div>
            </div>
          </section>
          
          {/* Self-Improvement - Coming Soon */}
          <section className="bg-[#12121a] rounded-2xl border border-[#1a1a24] p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0a0a0f]/80 backdrop-blur-sm flex items-center justify-center z-10">
              <div className="text-center">
                <span className="text-4xl mb-3 block">🧠</span>
                <p className="text-lg font-semibold">Self-Improvement</p>
                <p className="text-gray-500 text-sm">Coming Soon</p>
              </div>
            </div>
            <div className="opacity-30">
              <div className="flex items-center gap-3 mb-4">
                <span>🧠</span>
                <h2 className="font-semibold">Evolution</h2>
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-[#1a1a24] rounded-full w-3/4"></div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="h-20 bg-[#1a1a24] rounded-lg"></div>
                  <div className="h-20 bg-[#1a1a24] rounded-lg"></div>
                  <div className="h-20 bg-[#1a1a24] rounded-lg"></div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Activity Log */}
        <section className="bg-[#12121a] rounded-2xl border border-[#1a1a24] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a24]">
            <div className="flex items-center gap-3">
              <span>📋</span>
              <h2 className="font-semibold">Activity Log</h2>
            </div>
          </div>
          <div className="divide-y divide-[#1a1a24]">
            {data.activityLog.map((log, i) => (
              <div key={i} className="px-6 py-3 flex items-center gap-4">
                <span className="text-gray-500 font-mono text-sm w-14">{log.time}</span>
                <span className="text-gray-300">{log.event}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Milestones */}
        <section className="bg-[#12121a] rounded-2xl border border-[#1a1a24] p-6">
          <div className="flex items-center gap-3 mb-6">
            <span>🎯</span>
            <h2 className="font-semibold">Milestones</h2>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[19px] top-8 bottom-8 w-0.5 bg-[#1a1a24]"></div>
            
            <div className="space-y-6">
              {data.milestones.map((milestone, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold relative z-10 ${
                    milestone.completed 
                      ? 'bg-[#00d4aa] text-black' 
                      : milestone.current
                        ? 'bg-[#7c3aed] text-white ring-4 ring-[#7c3aed]/20'
                        : 'bg-[#1a1a24] text-gray-500'
                  }`}>
                    {milestone.completed ? '✓' : milestone.day}
                  </div>
                  <div className="flex-1 pt-1.5">
                    <div className="flex items-center gap-3">
                      <p className={`font-medium ${milestone.completed || milestone.current ? 'text-white' : 'text-gray-500'}`}>
                        Day {milestone.day}: {milestone.title}
                      </p>
                      {milestone.current && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[#7c3aed]/20 text-[#7c3aed] border border-[#7c3aed]/30">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-gray-500 text-sm">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Upgrade History */}
        <section className="bg-[#12121a] rounded-2xl border border-[#1a1a24] overflow-hidden">
          <div className="px-6 py-4 border-b border-[#1a1a24]">
            <div className="flex items-center gap-3">
              <span>📈</span>
              <h2 className="font-semibold">Upgrade History</h2>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-500 text-left border-b border-[#1a1a24]">
                  <th className="px-6 py-3 font-medium">Day</th>
                  <th className="px-6 py-3 font-medium">Version</th>
                  <th className="px-6 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {data.upgrades.map((upgrade, i) => (
                  <tr key={i} className="border-b border-[#1a1a24]/50 hover:bg-[#1a1a24]/30 transition">
                    <td className="px-6 py-4">{upgrade.day}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded bg-[#7c3aed]/20 text-[#7c3aed] font-mono">
                        {upgrade.version}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-400">{upgrade.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-12 border-t border-[#1a1a24]">
          <p className="text-gray-500 mb-4">
            Powered by <span className="text-[#00d4aa]">Bittensor</span> • 
            Hosted on <span className="text-[#00d4aa]">Basilica</span> • 
            Built with <span className="text-[#00d4aa]">OpenClaw</span>
          </p>
          <div className="flex justify-center gap-6 text-sm">
            <a href="https://x.com/clawnst_reborn" className="text-gray-400 hover:text-white transition">𝕏 Twitter</a>
            <a href="https://moltbook.com/clawnst" className="text-gray-400 hover:text-white transition">Moltbook</a>
            <a href="https://github.com/clawnst" className="text-gray-400 hover:text-white transition">GitHub</a>
          </div>
        </footer>
      </div>
    </main>
  );
}
