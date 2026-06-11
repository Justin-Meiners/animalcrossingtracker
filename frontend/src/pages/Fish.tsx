import CritterGrid from "../components/CritterGrid.tsx"
import fish from "../../../backend/data/fish.json"
import FilterBar from "../components/FilterBar"
import { isAvailableNow } from "../tools/Availability.ts"
import { useState, useMemo } from "react"
function Fish() {
    const [caughtFish, setCaughtFish] = useState<Set<number>>(new Set());
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);

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
            <CritterGrid
                critters={filteredFish}
                caughtCritters={caughtFish}
                onToggleCaught={toggleCaught}
            />
        </>
    )
}
export default Fish