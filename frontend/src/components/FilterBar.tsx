import './../styles/FilterBar.css'

function FilterBar({ 
    showAvailabilityOnly, 
    showCaughtOnly, 
    onToggleAvailable, 
    onToggleCaught,
 }:
    {
        showAvailabilityOnly: boolean,
        showCaughtOnly: boolean,
        onToggleAvailable: () => void,
        onToggleCaught: () => void
    }
) {
    return (
        <div className="filter-bar">
            <span className="filter-label-text">Show</span>
                <button className={"filter-pill" + (showAvailabilityOnly ? " on-green" : "")}
                    onClick={onToggleAvailable}>
                    Available Now
                </button>
                <button className={"filter-pill" + (showCaughtOnly ? " on-green" : "")}
                    onClick={onToggleCaught}>
                    Uncaught Only
                </button>
        </div>
    )
}
export default FilterBar;