import './../styles/FilterBar.css'
import { useHemisphere } from '../context/HemisphereContext'

function FilterBar({
    showAvailabilityOnly,
    showUncaughtOnly,
    onToggleAvailable,
    onToggleCaught,
 }:
    {
        showAvailabilityOnly: boolean,
        showUncaughtOnly: boolean,
        onToggleAvailable: () => void,
        onToggleCaught: () => void
    }
) {
    const { hemisphere, toggleHemisphere } = useHemisphere();

    return (
        <div className="filter-bar">
            <span className="filter-label-text">Show</span>
                <button className={"filter-pill" + (showAvailabilityOnly ? " on-green" : "")}
                    onClick={onToggleAvailable}>
                    Available Now
                </button>
                <button className={"filter-pill" + (showUncaughtOnly ? " on-green" : "")}
                    onClick={onToggleCaught}>
                    Uncaught Only
                </button>
            <span className="filter-divider" />
            <span className="filter-label-text">Hemisphere</span>
                <button className={"filter-pill" + (hemisphere === 'northern' ? " on-green" : "")}
                    onClick={() => hemisphere !== 'northern' && toggleHemisphere()}>
                    N
                </button>
                <button className={"filter-pill" + (hemisphere === 'southern' ? " on-green" : "")}
                    onClick={() => hemisphere !== 'southern' && toggleHemisphere()}>
                    S
                </button>
        </div>
    )
}
export default FilterBar;