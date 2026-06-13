import { Link } from 'react-router-dom'
import { useCritters } from '../hooks/useCritters'
import { useHemisphere } from '../context/HemisphereContext'
import { isAvailableNow } from '../tools/Availability'
import type { Critter } from '../types/Critter'
import '../styles/Home.css'

const month = new Date().getMonth() + 1;
const nextMonth = month === 12 ? 1 : month + 1;
const prevMonth = month === 1 ? 12 : month - 1;

function inMonth(c: Critter, hemisphere: 'northern' | 'southern', m: number): boolean {
    return c[hemisphere]?.times_by_month[m.toString()] != null;
}

function Home() {
    const { hemisphere } = useHemisphere();
    const { critters: fish } = useCritters('fish');
    const { critters: bugs } = useCritters('bug');
    const { critters: sea } = useCritters('sea');

    const allCritters = [...fish, ...bugs, ...sea];

    const fishNow = fish.filter(f => isAvailableNow(f[hemisphere]?.times_by_month ?? f.northern.times_by_month)).length;
    const bugsNow = bugs.filter(b => isAvailableNow(b[hemisphere]?.times_by_month ?? b.northern.times_by_month)).length;

    const leaving = allCritters.filter(c => inMonth(c, hemisphere, month) && !inMonth(c, hemisphere, nextMonth));
    const arriving = allCritters.filter(c => inMonth(c, hemisphere, month) && !inMonth(c, hemisphere, prevMonth));

    const monthName = new Date().toLocaleString('default', { month: 'long' });

    return (
        <div className="home">
            <section className="hero">
                <h1 className="hero-title">Welcome to Critter Tracker</h1>
                <p className="hero-sub">
                    Track every fish, bug, and sea creature on your island. See what's available
                    right now, what's leaving soon, and complete your Critterpedia.
                </p>
                <div className="hero-actions">
                    <Link to="/fish" className="hero-btn blue">
                        <img src="https://dodo.ac/np/images/thumb/3/3c/Fish_NH_Icon.png/80px-Fish_NH_Icon.png" alt="" className="hero-btn-icon" />
                        Browse Fish
                    </Link>
                    <Link to="/bugs" className="hero-btn green">
                        <img src="https://dodo.ac/np/images/thumb/8/8e/Bug_NH_Icon.png/80px-Bug_NH_Icon.png" alt="" className="hero-btn-icon" />
                        Browse Bugs
                    </Link>
                    <Link to="/sea" className="hero-btn blue">
                        <img src="https://dodo.ac/np/images/thumb/f/ff/Sea_Creature_NH_Icon.png/80px-Sea_Creature_NH_Icon.png" alt="" className="hero-btn-icon" />
                        Browse Sea
                    </Link>
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
