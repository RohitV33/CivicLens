export function getSLAStatus(createdAt, slaHours = 48, status = 'PENDING') {
  if (status === 'RESOLVED' || status === 'REJECTED') {
    return { isOverdue: false, text: 'Completed', color: 'emerald' }
  }

  const createdTime = new Date(createdAt).getTime()
  const slaDurationMs = (slaHours || 48) * 60 * 60 * 1000
  const deadlineTime = createdTime + slaDurationMs
  const now = Date.now()
  const diffMs = deadlineTime - now

  if (diffMs <= 0) {
    const overdueHours = Math.floor(Math.abs(diffMs) / (1000 * 60 * 60))
    return {
      isOverdue: true,
      hoursLeft: 0,
      text: `SLA OVERDUE (${overdueHours}h late)`,
      color: 'rose',
    }
  }

  const hoursLeft = Math.floor(diffMs / (1000 * 60 * 60))
  const minutesLeft = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  return {
    isOverdue: false,
    hoursLeft,
    text: `SLA: ${hoursLeft}h ${minutesLeft}m left`,
    color: hoursLeft < 12 ? 'amber' : 'blue',
  }
}
