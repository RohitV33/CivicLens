export const statusMeta = {
  pending: { label: 'Pending', color: 'text-warning', bg: 'bg-warning/10', dot: 'bg-warning' },
  in_review: { label: 'In review', color: 'text-primary dark:text-primary-dark', bg: 'bg-primary/10', dot: 'bg-primary' },
  resolved: { label: 'Resolved', color: 'text-success', bg: 'bg-success/10', dot: 'bg-success' },
  rejected: { label: 'Rejected', color: 'text-danger', bg: 'bg-danger/10', dot: 'bg-danger' },
}

export const severityMeta = {
  low: { label: 'Low', color: 'text-success', bg: 'bg-success/10' },
  medium: { label: 'Medium', color: 'text-warning', bg: 'bg-warning/10' },
  high: { label: 'High', color: 'text-danger', bg: 'bg-danger/10' },
}

export const reports = []


export const stats = {
  totalReports: 18420,
  resolvedReports: 14032,
  activeCitizens: 6210,
  avgResolutionHours: 46,
}

export const leaderboard = [
  { rank: 1, name: 'Ananya Gupta', points: 3120, reports: 84, avatarColor: '#2563EB' },
  { rank: 2, name: 'Rohit Sharma', points: 2870, reports: 76, avatarColor: '#22C55E' },
  { rank: 3, name: 'Karan Mehta', points: 2415, reports: 61, avatarColor: '#F59E0B' },
  { rank: 4, name: 'Priya Singh', points: 2103, reports: 58, avatarColor: '#EF4444' },
  { rank: 5, name: 'Sameer Khan', points: 1876, reports: 49, avatarColor: '#8B5CF6' },
]

export const timeline = [
  { id: 1, title: 'Report submitted', description: 'Citizen submitted report with AI-detected classification.', time: '21 Jul, 9:14 AM', status: 'done' },
  { id: 2, title: 'Verified by AI', description: 'Pothole detected with 96% confidence, severity marked high.', time: '21 Jul, 9:14 AM', status: 'done' },
  { id: 3, title: 'Assigned to department', description: 'Routed to Public Works Dept., Zone 3.', time: '21 Jul, 11:30 AM', status: 'done' },
  { id: 4, title: 'Field inspection scheduled', description: 'Inspector assigned, visit scheduled within 48 hours.', time: '22 Jul, 4:00 PM', status: 'active' },
  { id: 5, title: 'Resolved', description: 'Awaiting repair confirmation and photo evidence.', time: 'Pending', status: 'upcoming' },
]

export const achievements = [
  { id: 1, label: 'First Report', icon: 'Flag', earned: true },
  { id: 2, label: '10 Reports', icon: 'Layers', earned: true },
  { id: 3, label: 'Community Voice', icon: 'Megaphone', earned: true },
  { id: 4, label: '50 Upvotes', icon: 'ThumbsUp', earned: true },
  { id: 5, label: 'Streak: 7 Days', icon: 'Flame', earned: false },
  { id: 6, label: 'Top Contributor', icon: 'Trophy', earned: false },
]

export const activity = [
  { id: 1, text: 'Your report CL-10245 moved to In Review', time: '2h ago' },
  { id: 2, text: 'Streetlight report CL-10243 was resolved', time: '1d ago' },
  { id: 3, text: 'You earned the "Community Voice" badge', time: '3d ago' },
  { id: 4, text: 'Report CL-10241 was rejected — duplicate entry', time: '5d ago' },
]
