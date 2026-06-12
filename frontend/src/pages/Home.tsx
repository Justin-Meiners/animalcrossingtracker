import { Link } from 'react-router-dom'
import fish from '../../../backend/data/fish.json'
import bugs from '../../../backend/data/bugs.json'
import { isAvailableNow } from '../tools/Availability'
import type { Critter } from '../types/Critter'
import '../styles/Home.css'

const month = new Date().getMonth() + 1;
const nextMonth = month === 12 ? 1 : month + 1;
const prevMonth = month === 1 ? 12 : month - 1;

function inMonth(c: Critter, m: number): boolean {
    return c.northern.times_by_month[m.toString()] != null;
}

function Home() {
    const allCritters = [...(fish as Critter[]), ...(bugs as Critter[])];

    const fishNow = (fish as Critter[]).filter(f => isAvailableNow(f.northern.times_by_month)).length;
    const bugsNow = (bugs as Critter[]).filter(b => isAvailableNow(b.northern.times_by_month)).length;

    const leaving = allCritters.filter(c => inMonth(c, month) && !inMonth(c, nextMonth));
    const arriving = allCritters.filter(c => inMonth(c, month) && !inMonth(c, prevMonth));

    const monthName = new Date().toLocaleString('default', { month: 'long' });

    return (
        <div className="home">
            <section className="hero">
                <h1 className="hero-title">Welcome to Critter Tracker</h1>
                <p className="hero-sub">
                    Track every fish and bug on your island. See what's available
                    right now, what's leaving soon, and complete your Critterpedia.
                </p>
                <div className="hero-actions">
                    <Link to="/fish" className="hero-btn blue">🐟 Browse Fish</Link>
                    <Link to="/bugs" className="hero-btn green">🦋 Browse Bugs</Link>
                </div>
            </section>

            <section className="stat-row">
                <div className="stat-card">
                    <span className="stat-number">{fishNow}</span>
                    <span className="stat-label">Fish available now</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{bugsNow}</span>
                    <span className="stat-label">Bugs available now</span>
                </div>
                <div className="stat-card">
                    <span className="stat-number">{leaving.length}</span>
                    <span className="stat-label">Leaving after {monthName}</span>
                </div>
            </section>

            <section className="callout-col">
                {arriving.length > 0 && (
                    <div className="callout callout-blue">
                        <div className="callout-title">New in {monthName}</div>
                        {arriving.slice(0, 5).map(c => c.name).join(', ')}
                        {arriving.length > 5 && ` and ${arriving.length - 5} more`} just arrived!
                    </div>
                )}
                {leaving.length > 0 && (
                    <div className="callout callout-coral">
                        <div className="callout-title">Leaving end of {monthName}</div>
                        {leaving.slice(0, 5).map(c => c.name).join(', ')}
                        {leaving.length > 5 && ` and ${leaving.length - 5} more`} — catch them now!
                    </div>
                )}
            </section>
        </div>
    );
}

export default Home;