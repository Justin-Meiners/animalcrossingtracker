import CritterGrid from "../components/CritterGrid.tsx"
import FilterBar from "../components/FilterBar"
import CritterInfo from "../components/CritterInfo.tsx"
import { isAvailableNow } from "../tools/Availability.ts"
import { useCritters } from "../hooks/useCritters"
import { useCatches } from "../context/CatchContext"
import { useHemisphere } from "../context/HemisphereContext"
import { useState, useMemo, useRef, useEffect } from "react"

function Fish() {
    const { critters: fish, loading, error } = useCritters("fish");
    const { isCaught, toggleCaught } = useCatches();
    const { hemisphere } = useHemisphere();
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);
    const [selectFish, setSelectFish] = useState<number | null>(null);
    const [exitingId, setExitingId] = useState<number | null>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    const toggleSelectFish = (id: number) => {
        if (selectFish === id) {
            setExitingId(id);
            setSelectFish(null);
        } else {
            setExitingId(null);
            setSelectFish(id);
        }
    };

    useEffect(() => {
        if (selectFish !== null && window.innerWidth <= 580) {
            infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectFish]);

    const displayId = selectFish ?? exitingId;
    const isExiting = selectFish === null && exitingId !== null;

    const caughtSet = useMemo(
        () => new Set(fish.filter(f => isCaught('fish', f.id)).map(f => f.id)),
        [fish, isCaught]
    );

    const filteredFish = useMemo(() => {
        return fish.filter(f => {
            const times = f[hemisphere]?.times_by_month;
            if (showAvailabilityOnly && (!times || !isAvailableNow(times))) return false;
            if (showUncaughtOnly && isCaught('fish', f.id)) return false;
            return true;
        });
    }, [fish, hemisphere, showAvailabilityOnly, showUncaughtOnly, isCaught]);

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
            <div className={"fish-content" + (displayId !== null ? " has-selection" : "")}>
                <CritterGrid
                    critters={filteredFish}
                    caughtCritters={caughtSet}
                    selected={selectFish ?? -1}
                    hemisphere={hemisphere}
                    onToggleSelect={toggleSelectFish}
                />
                {displayId !== null && (
                    <div
                        ref={infoRef}
                        className={"critter-info-wrapper" + (isExiting ? " is-exiting" : "")}
                        onAnimationEnd={() => { if (isExiting) setExitingId(null); }}
                    >
                        <CritterInfo
                            critter={filteredFish.find(f => f.id === displayId)}
                            hemisphere={hemisphere}
                            caught={isCaught('fish', displayId)}
                            onToggleCaught={() => toggleCaught('fish', displayId)}
                        />
                    </div>
                )}
            </div>
        </>
    )
}
export default Fish
