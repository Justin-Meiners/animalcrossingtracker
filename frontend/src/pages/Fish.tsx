import CritterGrid from "../components/CritterGrid.tsx"
import FilterBar from "../components/FilterBar"
import CritterInfo from "../components/CritterInfo.tsx"
import { isAvailableNow } from "../tools/Availability.ts"
import { useCritters } from "../hooks/useCritters"
import { useCatches } from "../context/CatchContext"
import { useState, useMemo } from "react"

function Fish() {
    const { critters: fish, loading, error } = useCritters("fish");
    const { isCaught, toggleCaught } = useCatches();
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);
    const [selectFish, setSelectFish] = useState<number | null>(null);

    const toggleSelectFish = (id: number) => {
        setSelectFish(prev => prev === id ? null : id);
    };

    const caughtSet = useMemo(
        () => new Set(fish.filter(f => isCaught('fish', f.id)).map(f => f.id)),
        [fish, isCaught]
    );

    const filteredFish = useMemo(() => {
        return fish.filter(f => {
            if (showAvailabilityOnly && !isAvailableNow(f.northern.times_by_month)) return false;
            if (showUncaughtOnly && isCaught('fish', f.id)) return false;
            return true;
        });
    }, [fish, showAvailabilityOnly, showUncaughtOnly, isCaught]);

    if (loading) return <p className="page-status">Loading fish...</p>;
    if (error) return <p className="page-status error">Couldn't load fish: {error}</p>;

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
                    critters={filteredFish}
                    caughtCritters={caughtSet}
                    selected={selectFish ?? -1}
                    onToggleSelect={toggleSelectFish}
                />
                <CritterInfo
                    critter={selectFish !== null ? filteredFish.find(f => f.id === selectFish) : null}
                    hemisphere="northern"
                    caught={selectFish !== null ? isCaught('fish', selectFish) : false}
                    onToggleCaught={() => { if (selectFish !== null) toggleCaught('fish', selectFish); }}
                />
            </div>
        </>
    )
}
export default Fish