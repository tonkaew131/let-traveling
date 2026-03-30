/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import type { UIMessage } from 'ai'

interface Activity {
    time: string
    name: string
    description: string
    location: string
    duration: string
    cost: number
    category: string
}

interface DayPlan {
    day: number
    date: string
    title: string
    weather: {
        condition: string
        highTemp: number
        lowTemp: number
    }
    activities: Array<Activity>
}

function extractAllTripData(messages: Array<UIMessage>) {
    const flights: Array<any> = []
    const hotels: Array<any> = []
    const dayPlanByDay: Record<number, DayPlan> = {}
    const summaries: Array<any> = []

    for (const msg of messages) {
        for (const part of msg.parts) {
            if (
                part.type.startsWith('tool-') &&
                'output' in part &&
                part.state === 'output-available'
            ) {
                const toolName = part.type.replace('tool-', '')
                const output = part.output as any
                if (toolName === 'searchFlights') flights.push(output)
                if (toolName === 'searchHotels') hotels.push(output)
                if (toolName === 'createDayPlan') {
                    if (typeof output?.day === 'number') {
                        dayPlanByDay[output.day] = output as DayPlan
                    }
                }
                if (toolName === 'generateTripSummary') summaries.push(output)
            }
        }
    }

    return {
        flights,
        hotels,
        dayPlans: Object.values(dayPlanByDay).sort((a, b) => a.day - b.day),
        summaries,
    }
}

export async function exportTripPDF(messages: Array<UIMessage>) {
    const { flights, hotels, dayPlans, summaries } =
        extractAllTripData(messages)
    const summary = summaries[summaries.length - 1]
    const flight = flights[flights.length - 1]
    const hotel = hotels[hotels.length - 1]

    const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Google+Sans:ital,opsz,wght@0,17..18,400..700;1,17..18,400..700&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'DM Sans', 'Google Sans', sans-serif; color: #1a1a1a; padding: 40px; max-width: 800px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #516FA2; }
    .header h1 { font-size: 28px; color: #516FA2; margin-bottom: 4px; }
    .header p { font-size: 14px; color: #666; }
    .summary-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 32px; }
    .summary-item { background: #f5f5f0; padding: 12px; border-radius: 8px; text-align: center; }
    .summary-item label { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #666; display: block; }
    .summary-item span { font-size: 16px; font-weight: 600; color: #1a1a1a; display: block; margin-top: 4px; }
    .section { margin-bottom: 28px; }
    .section h2 { font-size: 18px; color: #516FA2; margin-bottom: 12px; padding-bottom: 6px; border-bottom: 1px solid #e0e0d8; }
    .flight-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
    .flight-label { font-size: 10px; text-transform: uppercase; color: #666; }
    .flight-info { font-size: 14px; font-weight: 500; }
    .hotel-info { padding: 16px; background: #f5f5f0; border-radius: 8px; }
    .hotel-info h3 { font-size: 16px; margin-bottom: 4px; }
    .hotel-info p { font-size: 13px; color: #666; }
    .hotel-amenities { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .hotel-amenities span { background: white; padding: 3px 8px; border-radius: 4px; font-size: 11px; border: 1px solid #ddd; }
    .day-plan { margin-bottom: 24px; page-break-inside: avoid; }
    .day-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
    .day-number { width: 36px; height: 36px; background: #516FA2; color: white; display: flex; align-items: center; justify-content: center; border-radius: 8px; font-weight: 700; font-size: 14px; }
    .day-title h3 { font-size: 15px; }
    .day-title p { font-size: 12px; color: #666; }
    .activity { display: flex; gap: 12px; padding: 8px 0; border-bottom: 1px solid #f0f0e8; }
    .activity-time { width: 70px; font-size: 12px; font-weight: 600; color: #516FA2; flex-shrink: 0; padding-top: 2px; }
    .activity-content h4 { font-size: 13px; font-weight: 600; }
    .activity-content p { font-size: 12px; color: #666; margin-top: 2px; }
    .activity-meta { display: flex; gap: 12px; margin-top: 4px; font-size: 11px; color: #999; }
    .day-total { text-align: right; font-size: 13px; font-weight: 600; padding-top: 8px; color: #516FA2; }
    .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e0e0d8; font-size: 11px; color: #999; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${summary?.destination || 'Trip'}, ${summary?.country || ''}</h1>
    <p>${summary?.summary || ''}</p>
  </div>

  ${
      summary
          ? `
  <div class="summary-grid">
    <div class="summary-item">
      <label>Duration</label>
      <span>${dayPlans.length} days</span>
    </div>
    <div class="summary-item">
      <label>Dates</label>
      <span>${new Date(summary.startDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })} - ${new Date(summary.endDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
    </div>
    <div class="summary-item">
      <label>Travelers</label>
      <span>${summary.travelers}</span>
    </div>
    <div class="summary-item">
      <label>Budget</label>
      <span>$${summary.totalBudget?.toLocaleString()}</span>
    </div>
  </div>
  `
          : ''
  }

  ${
      flight
          ? `
  <div class="section">
    <h2>Flights</h2>
    <div class="flight-row">
      <div><span class="flight-label">Outbound</span><br/><span class="flight-info">${flight.outbound.departure} → ${flight.outbound.arrival}</span></div>
      <div style="text-align: center;"><span class="flight-label">${flight.outbound.airline}</span><br/><span class="flight-info">${flight.outbound.flightNumber}</span></div>
      <div style="text-align: right;"><span class="flight-label">Duration</span><br/><span class="flight-info">${flight.outbound.duration}</span></div>
    </div>
    <div class="flight-row">
      <div><span class="flight-label">Return</span><br/><span class="flight-info">${flight.return.departure} → ${flight.return.arrival}</span></div>
      <div style="text-align: center;"><span class="flight-label">${flight.return.airline}</span><br/><span class="flight-info">${flight.return.flightNumber}</span></div>
      <div style="text-align: right;"><span class="flight-label">Duration</span><br/><span class="flight-info">${flight.return.duration}</span></div>
    </div>
    <div style="text-align: right; margin-top: 8px; font-weight: 600;">Total: $${flight.totalPrice?.toLocaleString()}</div>
  </div>
  `
          : ''
  }

  ${
      hotel
          ? `
  <div class="section">
    <h2>Accommodation</h2>
    <div class="hotel-info">
      <h3>${hotel.name}</h3>
      <p>${hotel.location} · Rating: ${hotel.rating?.toFixed(1)}/5</p>
      <p>Check-in: ${new Date(hotel.checkIn).toLocaleDateString()} · Check-out: ${new Date(hotel.checkOut).toLocaleDateString()}</p>
      <div class="hotel-amenities">${(hotel.amenities || []).map((a: string) => `<span>${a}</span>`).join('')}</div>
      <p style="margin-top: 10px; font-weight: 600; color: #516FA2;">$${(hotel.pricePerNight as number).toFixed(2)}/night · Total: $${(hotel.totalPrice as number).toFixed(2)}</p>
    </div>
  </div>
  `
          : ''
  }

  <div class="section">
    <h2>Daily Itinerary</h2>
    ${dayPlans
        .map(
            (plan) => `
    <div class="day-plan">
      <div class="day-header">
        <div class="day-number">${plan.day}</div>
        <div class="day-title">
          <h3>${plan.title}</h3>
          <p>${new Date(plan.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} ${plan?.weather ? `· ${plan.weather.condition} · ${plan.weather.highTemp}°/${plan.weather.lowTemp}°` : ''}</p>
        </div>
      </div>
      ${plan.activities
          .map(
              (a) => `
      <div class="activity">
        <div class="activity-time">${a.time}</div>
        <div class="activity-content">
          <h4>${a.name}</h4>
          <p>${a.description}</p>
          <div class="activity-meta">
            <span>${a.location}</span>
            <span>${a.duration}</span>
            ${a.cost > 0 ? `<span>$${a.cost}</span>` : ''}
          </div>
        </div>
      </div>
      `,
          )
          .join('')}
      <div class="day-total">Day total: $${plan.activities.reduce((s: number, a: Activity) => s + a.cost, 0)}</div>
    </div>
    `,
        )
        .join('')}
  </div>

  <div class="footer">
    Generated by Let's traveling - Agentic Travel Planner · ${new Date().toLocaleDateString()}
  </div>
</body>
</html>`

    // Open in new window for printing
    const printWindow = window.open('', '_blank')
    if (printWindow) {
        printWindow.document.write(html)
        printWindow.document.close()
        setTimeout(() => {
            printWindow.print()
        }, 500)
    }
}
