import CritterGrid from "../components/CritterGrid.tsx"
import FilterBar from "../components/FilterBar"
import CritterInfo from "../components/CritterInfo.tsx"
import { isAvailableNow } from "../tools/Availability.ts"
import { useCritters } from "../hooks/useCritters"
import { useCatches } from "../context/CatchContext"
import { useHemisphere } from "../context/HemisphereContext"
import { useState, useMemo, useRef, useEffect } from "react"

function Sea() {
    const { critters: sea, loading, error } = useCritters("sea");
    const { isCaught, toggleCaught } = useCatches();
    const { hemisphere } = useHemisphere();
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);
    const [selectSea, setSelectSea] = useState<number | null>(null);
    const [exitingId, setExitingId] = useState<number | null>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    const toggleSelectSea = (id: number) => {
        if (selectSea === id) {
            setExitingId(id);
            setSelectSea(null);
        } else {
            setExitingId(null);
            setSelectSea(id);
        }
    };

    useEffect(() => {
        if (selectSea !== null && window.innerWidth <= 580) {
            infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectSea]);

    const displayId = selectSea ?? exitingId;
    const isExiting = selectSea === null && exitingId !== null;

    const caughtSet = useMemo(
        () => new Set(sea.filter(s => isCaught('sea', s.id)).map(s => s.id)),
        [sea, isCaught]
    );

    const filteredSea = useMemo(() => {
        return sea.filter(s => {
            const times = s[hemisphere]?.times_by_month;
            if (showAvailabilityOnly && (!times || !isAvailableNow(times))) return false;
            if (showUncaughtOnly && isCaught('sea', s.id)) return false;
            return true;
        });
    }, [sea, hemisphere, showAvailabilityOnly, showUncaughtOnly, isCaught]);

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
            <div className={"fish-content" + (displayId !== null ? " has-selection" : "")}>
                <CritterGrid
                    critters={filteredSea}
                    caughtCritters={caughtSet}
                    selected={selectSea ?? -1}
                    hemisphere={hemisphere}
                    onToggleSelect={toggleSelectSea}
                />
                {displayId !== null && (
                    <div
                        ref={infoRef}
                        className={"critter-info-wrapper" + (isExiting ? " is-exiting" : "")}
                        onAnimationEnd={() => { if (isExiting) setExitingId(null); }}
                    >
                        <CritterInfo
                            critter={filteredSea.find(s => s.id === displayId)}
                            hemisphere={hemisphere}
                            caught={isCaught('sea', displayId)}
                            onToggleCaught={() => toggleCaught('sea', displayId)}
                        />
                    </div>
                )}
            </div>
        </>
    )
}

export default Sea
