// Mock data for the entire QR For All ecosystem

export const dashboardStats = {
  totalScans: { value: '2.4M', change: '+18.3%', period: 'vs last month' },
  activeQRs: { value: '12,847', change: '+342', period: 'this week' },
  conversionRate: { value: '34.7%', change: '+4.2%', period: 'vs last month' },
  aiGenerations: { value: '8,291', change: '+67%', period: 'vs last month' },
}

export const scanTrends = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Total Scans',
      data: [120000, 145000, 178000, 190000, 225000, 260000, 280000, 310000, 295000, 340000, 380000, 420000],
      borderColor: '#6c5ce7',
      backgroundColor: 'rgba(108, 92, 231, 0.1)',
      fill: true,
      tension: 0.4,
    },
    {
      label: 'Unique Users',
      data: [80000, 95000, 110000, 125000, 148000, 170000, 185000, 200000, 192000, 220000, 250000, 275000],
      borderColor: '#00cec9',
      backgroundColor: 'rgba(0, 206, 201, 0.08)',
      fill: true,
      tension: 0.4,
    },
  ],
}

export const deviceBreakdown = {
  labels: ['iOS', 'Android', 'Desktop', 'Tablet', 'Other'],
  datasets: [
    {
      data: [42, 35, 15, 6, 2],
      backgroundColor: [
        'rgba(108, 92, 231, 0.8)',
        'rgba(0, 206, 201, 0.8)',
        'rgba(253, 121, 168, 0.8)',
        'rgba(253, 203, 110, 0.8)',
        'rgba(255, 255, 255, 0.2)',
      ],
      borderWidth: 0,
    },
  ],
}

export const locationData = [
  { city: 'New York', country: 'US', scans: 184200, trend: '+12%' },
  { city: 'London', country: 'UK', scans: 156800, trend: '+8%' },
  { city: 'Tokyo', country: 'JP', scans: 142100, trend: '+22%' },
  { city: 'Berlin', country: 'DE', scans: 98400, trend: '+15%' },
  { city: 'Sydney', country: 'AU', scans: 87600, trend: '+5%' },
  { city: 'São Paulo', country: 'BR', scans: 76300, trend: '+31%' },
  { city: 'Mumbai', country: 'IN', scans: 71800, trend: '+28%' },
  { city: 'Toronto', country: 'CA', scans: 64500, trend: '+9%' },
]

export const hourlyHeatmap = {
  labels: ['12am', '3am', '6am', '9am', '12pm', '3pm', '6pm', '9pm'],
  datasets: [
    {
      label: 'Mon',
      data: [12, 5, 18, 85, 120, 95, 78, 45],
      backgroundColor: 'rgba(108, 92, 231, 0.7)',
    },
    {
      label: 'Tue',
      data: [10, 4, 20, 90, 130, 110, 82, 50],
      backgroundColor: 'rgba(0, 206, 201, 0.7)',
    },
    {
      label: 'Wed',
      data: [14, 6, 22, 95, 135, 105, 86, 48],
      backgroundColor: 'rgba(253, 121, 168, 0.7)',
    },
    {
      label: 'Thu',
      data: [11, 5, 19, 88, 125, 100, 80, 52],
      backgroundColor: 'rgba(253, 203, 110, 0.7)',
    },
    {
      label: 'Fri',
      data: [15, 8, 25, 92, 140, 115, 90, 65],
      backgroundColor: 'rgba(0, 184, 148, 0.7)',
    },
  ],
}

export const qrCodes = [
  {
    id: 'qr-001',
    name: 'Product Launch Campaign',
    url: 'https://link.yourbrand.com/launch-2026',
    scans: 45280,
    status: 'active',
    created: '2026-01-15',
    style: 'Cyberpunk Neon',
    versions: [
      { v: 5, url: 'https://link.yourbrand.com/launch-2026', date: '2026-03-10', by: 'Shahi', tag: 'current' },
      { v: 4, url: 'https://link.yourbrand.com/launch-preview', date: '2026-03-01', by: 'Shahi', tag: '' },
      { v: 3, url: 'https://yourbrand.com/launch-beta', date: '2026-02-15', by: 'Admin', tag: '' },
      { v: 2, url: 'https://staging.yourbrand.com/launch', date: '2026-02-01', by: 'Admin', tag: '' },
      { v: 1, url: 'https://dev.yourbrand.com/launch', date: '2026-01-15', by: 'System', tag: 'initial' },
    ],
    auditTrail: [
      { time: '2026-03-10 14:22', action: 'URL updated to v5', user: 'Shahi' },
      { time: '2026-03-10 14:20', action: 'Approved by governance team', user: 'Admin' },
      { time: '2026-03-01 09:15', action: 'URL updated to v4', user: 'Shahi' },
      { time: '2026-02-15 11:00', action: 'URL updated to v3', user: 'Admin' },
      { time: '2026-01-15 08:30', action: 'QR code created', user: 'System' },
    ],
  },
  {
    id: 'qr-002',
    name: 'Restaurant Menu',
    url: 'https://link.yourbrand.com/menu',
    scans: 128740,
    status: 'active',
    created: '2025-11-20',
    style: 'Watercolor Bloom',
    versions: [
      { v: 12, url: 'https://link.yourbrand.com/menu', date: '2026-03-14', by: 'Shahi', tag: 'current' },
    ],
    auditTrail: [
      { time: '2026-03-14 16:00', action: 'Menu items updated for spring', user: 'Shahi' },
    ],
  },
  {
    id: 'qr-003',
    name: 'Event Registration',
    url: 'https://link.yourbrand.com/event-2026',
    scans: 8920,
    status: 'active',
    created: '2026-02-28',
    style: 'Geometric Abstract',
    versions: [
      { v: 2, url: 'https://link.yourbrand.com/event-2026', date: '2026-03-05', by: 'Shahi', tag: 'current' },
    ],
    auditTrail: [],
  },
  {
    id: 'qr-004',
    name: 'Legacy Campaign Q4',
    url: 'https://link.yourbrand.com/q4-sale',
    scans: 234100,
    status: 'expired',
    created: '2025-10-01',
    style: 'Classic Minimal',
    versions: [],
    auditTrail: [],
  },
  {
    id: 'qr-005',
    name: 'Feedback Survey',
    url: 'https://link.yourbrand.com/feedback',
    scans: 12450,
    status: 'active',
    created: '2026-03-01',
    style: 'AI Galaxy',
    versions: [],
    auditTrail: [],
  },
]

export const aiStyles = [
  { name: 'Cyberpunk Neon', category: 'Futuristic', colors: ['#6c5ce7', '#00cec9', '#e84393'] },
  { name: 'Watercolor Bloom', category: 'Artistic', colors: ['#fd79a8', '#fdcb6e', '#74b9ff'] },
  { name: 'Geometric Abstract', category: 'Modern', colors: ['#636e72', '#2d3436', '#dfe6e9'] },
  { name: 'Sakura Dream', category: 'Nature', colors: ['#fab1a0', '#ffeaa7', '#a29bfe'] },
  { name: 'AI Galaxy', category: 'Sci-Fi', colors: ['#0c0c1d', '#6c5ce7', '#00cec9'] },
  { name: 'Art Deco Gold', category: 'Luxury', colors: ['#fdcb6e', '#2d3436', '#636e72'] },
  { name: 'Ocean Depths', category: 'Nature', colors: ['#0984e3', '#00cec9', '#74b9ff'] },
  { name: 'Retro Wave', category: 'Vintage', colors: ['#e84393', '#fd79a8', '#6c5ce7'] },
  { name: 'Black & White', category: 'Classic', colors: ['#000000', '#ffffff', '#e0e0e0'] },
  // 5 Girl-oriented styles
  { name: 'Pastel Unicorn', category: 'Fantasy', colors: ['#ff9ff3', '#feca57', '#48dbfb'] },
  { name: 'Fairy Dust', category: 'Magical', colors: ['#ffa502', '#eccc68', '#ff7f50'] },
  { name: 'Mermaid Scales', category: 'Fantasy', colors: ['#1dd1a1', '#0abde3', '#5f27cd'] },
  { name: 'Rose Gold Elegance', category: 'Luxury', colors: ['#B76E79', '#C0C0C0', '#ffd32a'] },
  { name: 'Cotton Candy Sky', category: 'Nature', colors: ['#ffcccc', '#ccffff', '#ccccff'] },
  // 5 Boy-oriented styles
  { name: 'Mechanical Gears', category: 'Industrial', colors: ['#7f8fa6', '#2f3640', '#e1b12c'] },
  { name: 'Space Explorer', category: 'Sci-Fi', colors: ['#192a56', '#487eb0', '#fbc531'] },
  { name: 'Dragon Fire', category: 'Fantasy', colors: ['#c23616', '#e84118', '#fbc531'] },
  { name: 'Dark Knight', category: 'Action', colors: ['#2f3542', '#57606f', '#ffffff'] },
  { name: 'Pixel Gamer', category: 'Retro', colors: ['#4cd137', '#0097e6', '#e84118'] },
]

export const abTests = [
  {
    id: 'ab-001',
    name: 'Product Launch QR Style Test',
    status: 'running',
    startDate: '2026-03-01',
    totalScans: 12840,
    variantA: {
      name: 'Cyberpunk Neon',
      scans: 6720,
      conversions: 2340,
      rate: 34.8,
    },
    variantB: {
      name: 'Watercolor Bloom',
      scans: 6120,
      conversions: 1890,
      rate: 30.9,
    },
    confidence: 92,
    winner: 'A',
  },
  {
    id: 'ab-002',
    name: 'Menu QR Engagement Test',
    status: 'running',
    startDate: '2026-03-08',
    totalScans: 4560,
    variantA: {
      name: 'Geometric Abstract',
      scans: 2280,
      conversions: 680,
      rate: 29.8,
    },
    variantB: {
      name: 'Sakura Dream',
      scans: 2280,
      conversions: 750,
      rate: 32.9,
    },
    confidence: 78,
    winner: 'B',
  },
  {
    id: 'ab-003',
    name: 'Event QR Brand Awareness',
    status: 'completed',
    startDate: '2026-02-01',
    totalScans: 28900,
    variantA: {
      name: 'AI Galaxy',
      scans: 14800,
      conversions: 5920,
      rate: 40.0,
    },
    variantB: {
      name: 'Retro Wave',
      scans: 14100,
      conversions: 4510,
      rate: 32.0,
    },
    confidence: 99,
    winner: 'A',
  },
]

export const sentimentData = {
  positive: 68,
  neutral: 22,
  negative: 10,
  insights: [
    { text: 'Users are 3.2x more likely to complete actions after scanning AI-styled QR codes', type: 'positive' },
    { text: 'Peak engagement occurs Tuesday–Thursday between 11am–2pm local time', type: 'neutral' },
    { text: 'QR codes with branded domains see 47% higher trust scores', type: 'positive' },
    { text: '12% of users report difficulty scanning from certain angles in low-light', type: 'negative' },
  ],
}

export const predictiveInsights = [
  {
    title: 'Optimal Scan Location',
    prediction: 'Shopping malls in the NYC metro area will generate 23% more scans next month',
    confidence: 87,
    action: 'Deploy 15 additional QR placements in Hudson Yards and Times Square',
  },
  {
    title: 'Peak Engagement Window',
    prediction: 'Tuesday 11:30 AM – 1:15 PM will be the highest-converting window next week',
    confidence: 94,
    action: 'Schedule push notifications to activate QR campaigns during this window',
  },
  {
    title: 'Style Performance',
    prediction: 'Cyberpunk Neon style will outperform all others by 18% in the tech audience segment',
    confidence: 81,
    action: 'Switch default QR style for tech-focused campaigns to Cyberpunk Neon',
  },
]

export const themes = [
  { id: 'theme-dark', name: 'Dark', color: '#6c5ce7' },
  { id: 'theme-light', name: 'Light', color: '#f0f0f8' },
  { id: 'theme-midnight', name: 'Midnight', color: '#1e272e' },
  { id: 'theme-ocean', name: 'Ocean', color: '#0984e3' },
  { id: 'theme-forest', name: 'Forest', color: '#2ecc71' },
  { id: 'theme-sunset', name: 'Sunset', color: '#ff7675' },
  { id: 'theme-dracula', name: 'Dracula', color: '#bd93f9' },
  { id: 'theme-solarized', name: 'Solar', color: '#859900' },
  { id: 'theme-nord', name: 'Nord', color: '#88c0d0' },
  { id: 'theme-neon', name: 'Neon', color: '#39ff14' },
  { id: 'theme-cyber', name: 'Cyberpunk', color: '#fcee0a' },
  { id: 'theme-ruby', name: 'Ruby', color: '#e0115f' },
  { id: 'theme-amethyst', name: 'Amethyst', color: '#9b59b6' },
  { id: 'theme-amber', name: 'Amber', color: '#ffbf00' },
  { id: 'theme-emerald', name: 'Emerald', color: '#50c878' },
  { id: 'theme-sapphire', name: 'Sapphire', color: '#0f52ba' },
  { id: 'theme-monochrome', name: 'Mono', color: '#808080' },
  { id: 'theme-rose', name: 'Rose Gold', color: '#b76e79' },
  { id: 'theme-deepsea', name: 'Deep Sea', color: '#004b49' },
  { id: 'theme-lavender', name: 'Lavender', color: '#e6e6fa' },
  { id: 'theme-volcano', name: 'Volcano', color: '#ff4d4d' },
  { id: 'theme-mint', name: 'Mint', color: '#98ff98' },
  { id: 'theme-slate', name: 'Slate', color: '#708090' },
  { id: 'theme-luxury', name: 'Luxury', color: '#d4af37' },
  { id: 'theme-galaxy', name: 'Galaxy', color: '#2c3e50' },
  { id: 'theme-poison', name: 'Poison', color: '#adff2f' },
  { id: 'theme-fire', name: 'Fire', color: '#ff4500' },
  { id: 'theme-ice', name: 'Ice', color: '#afeeee' },
  { id: 'theme-candy', name: 'Candy', color: '#ff69b4' },
  { id: 'theme-carbon', name: 'Carbon', color: '#333333' },
  { id: 'theme-goldleaf', name: 'Gold Leaf', color: '#ffd700' }
];
