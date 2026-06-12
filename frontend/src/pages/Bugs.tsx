import CritterGrid from "../components/CritterGrid.tsx"
import FilterBar from "../components/FilterBar"
import CritterInfo from "../components/CritterInfo.tsx"
import { isAvailableNow } from "../tools/Availability.ts"
import { useCritters } from "../hooks/useCritters"
import { useCatches } from "../context/CatchContext"
import { useState, useMemo } from "react"

function Bugs() {
    const { critters: bugs, loading, error } = useCritters("bug");
    const { isCaught, toggleCaught } = useCatches();
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);
    const [selectBug, setSelectBug] = useState<number | null>(null);

    const toggleSelectBug = (id: number) => {
        setSelectBug(prev => prev === id ? null : id);
    };

    const caughtSet = useMemo(
        () => new Set(bugs.filter(b => isCaught('bug', b.id)).map(b => b.id)),
        [bugs, isCaught]
    );

    const filteredBugs = useMemo(() => {
        return bugs.filter(b => {
            if (showAvailabilityOnly && !isAvailableNow(b.northern.times_by_month)) return false;
            if (showUncaughtOnly && isCaught('bug', b.id)) return false;
            return true;
        });
    }, [bugs, showAvailabilityOnly, showUncaughtOnly, isCaught]);

    if (loading) return <p className="page-status">Loading bugs...</p>;
    if (error) return <p className="page-status error">Couldn't load bugs: {error}</p>;

    return (
        <>
            <FilterBar
                showAvailabilityOnly={showAvailabilityOnly}
                showUncaughtOnly={showUncaughtOnly}
                onToggleAvailable={() => setShowAvailabilityOnly(!showAvailabilityOnly)}
                onToggleCaught={() => setShowUncaughtOnly(!showUncaughtOnly)}
            />
            <div className="fish-content">
                <CritterGrid
                    critters={filteredBugs}
                    caughtCritters={caughtSet}
                    selected={selectBug ?? -1}
                    onToggleSelect={toggleSelectBug}
                />
                <CritterInfo
                    critter={selectBug !== null ? filteredBugs.find(b => b.id === selectBug) : null}
                    hemisphere="northern"
                    caught={selectBug !== null ? isCaught('bug', selectBug) : false}
                    onToggleCaught={() => { if (selectBug !== null) toggleCaught('bug', selectBug); }}
                />
            </div>
        </>
    )
}
export default Bugs