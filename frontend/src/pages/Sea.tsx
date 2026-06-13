import CritterGrid from "../components/CritterGrid.tsx"
import FilterBar from "../components/FilterBar"
import CritterInfo from "../components/CritterInfo.tsx"
import { isAvailableNow } from "../tools/Availability.ts"
import { useCritters } from "../hooks/useCritters"
import { useCatches } from "../context/CatchContext"
import { useState, useMemo } from "react"

function Sea() {
    const { critters: sea, loading, error } = useCritters("sea");
    const { isCaught, toggleCaught } = useCatches();
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);
    const [selectSea, setSelectSea] = useState<number | null>(null);

    const toggleSelectSea = (id: number) => {
        setSelectSea(prev => prev === id ? null : id);
    };

    const caughtSet = useMemo(
        () => new Set(sea.filter(s => isCaught('sea', s.id)).map(s => s.id)),
        [sea, isCaught]
    );

    const filteredSea = useMemo(() => {
        return sea.filter(s => {
            if (showAvailabilityOnly && !isAvailableNow(s.northern.times_by_month)) return false;
            if (showUncaughtOnly && isCaught('sea', s.id)) return false;
            return true;
        });
    }, [sea, showAvailabilityOnly, showUncaughtOnly, isCaught]);

    if (loading) return <p className="page-status">Loading sea creatures...</p>;
    if (error) return <p className="page-status error">Couldn't load sea creatures: {error}</p>;

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
                    critters={filteredSea}
                    caughtCritters={caughtSet}
                    selected={selectSea ?? -1}
                    onToggleSelect={toggleSelectSea}
                />
                <CritterInfo
                    critter={selectSea !== null ? filteredSea.find(s => s.id === selectSea) : null}
                    hemisphere="northern"
                    caught={selectSea !== null ? isCaught('sea', selectSea) : false}
                    onToggleCaught={() => { if (selectSea !== null) toggleCaught('sea', selectSea); }}
                />
            </div>
        </>
    )
}

export default Sea
