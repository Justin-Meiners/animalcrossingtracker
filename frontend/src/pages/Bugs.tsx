import CritterGrid from "../components/CritterGrid.tsx"
import fish from "../../../backend/data/bugs.json"
import FilterBar from "../components/FilterBar"
import CritterInfo from "../components/CritterInfo.tsx"
import { isAvailableNow } from "../tools/Availability.ts"
import { useState, useMemo } from "react"
function Bugs() {
    const [caughtFish, setCaughtFish] = useState<Set<number>>(new Set());
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);
    const [selectFish, setSelectFish] = useState<number | null>(null);

    const toggleSelectFish = (id: number) => {
        setSelectFish(prev => prev === id ? null : id);
    };

    const toggleCaught = (id: number) => {
        setCaughtFish(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    }
    const filteredFish = useMemo(() => {
        fish.sort((a, b) => a.name.localeCompare(b.name));
        return fish.filter(f => {
            if (showAvailabilityOnly && !isAvailableNow(f.northern.times_by_month)) {
                return false;
            }
            if (showUncaughtOnly && caughtFish.has(f.id)) {
                return false;
            }
            return true;
        });
    }, [caughtFish, showAvailabilityOnly, showUncaughtOnly]);

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
                    caughtCritters={caughtFish}
                    selected={selectFish ?? -1}
                    onToggleSelect={toggleSelectFish}
                />
                <CritterInfo
                    critter={selectFish !== null ? filteredFish.find(f => f.id === selectFish) : null}
                    hemisphere="northern"
                    caught={selectFish !== null ? caughtFish.has(selectFish) : false}
                    onToggleCaught={() => { if (selectFish !== null) toggleCaught(selectFish); }}
                />
            </div>

            
        </>
    )
}
export default Bugs;