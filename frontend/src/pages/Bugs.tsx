import CritterGrid from "../components/CritterGrid.tsx"
import FilterBar from "../components/FilterBar"
import CritterInfo from "../components/CritterInfo.tsx"
import { isAvailableNow } from "../tools/Availability.ts"
import { useCritters } from "../hooks/useCritters"
import { useCatches } from "../context/CatchContext"
import { useHemisphere } from "../context/HemisphereContext"
import { useState, useMemo, useRef, useEffect } from "react"

function Bugs() {
    const { critters: bugs, loading, error } = useCritters("bug");
    const { isCaught, toggleCaught } = useCatches();
    const { hemisphere } = useHemisphere();
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showUncaughtOnly, setShowUncaughtOnly] = useState(false);
    const [selectBug, setSelectBug] = useState<number | null>(null);
    const [exitingId, setExitingId] = useState<number | null>(null);
    const infoRef = useRef<HTMLDivElement>(null);

    const toggleSelectBug = (id: number) => {
        if (selectBug === id) {
            setExitingId(id);
            setSelectBug(null);
        } else {
            setExitingId(null);
            setSelectBug(id);
        }
    };

    useEffect(() => {
        if (selectBug !== null && window.innerWidth <= 580) {
            infoRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    }, [selectBug]);

    const displayId = selectBug ?? exitingId;
    const isExiting = selectBug === null && exitingId !== null;

    const caughtSet = useMemo(
        () => new Set(bugs.filter(b => isCaught('bug', b.id)).map(b => b.id)),
        [bugs, isCaught]
    );

    const filteredBugs = useMemo(() => {
        return bugs.filter(b => {
            const times = b[hemisphere]?.times_by_month;
            if (showAvailabilityOnly && (!times || !isAvailableNow(times))) return false;
            if (showUncaughtOnly && isCaught('bug', b.id)) return false;
            return true;
        });
    }, [bugs, hemisphere, showAvailabilityOnly, showUncaughtOnly, isCaught]);

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
            <div className={"fish-content" + (displayId !== null ? " has-selection" : "")}>
                <CritterGrid
                    critters={filteredBugs}
                    caughtCritters={caughtSet}
                    selected={selectBug ?? -1}
                    hemisphere={hemisphere}
                    onToggleSelect={toggleSelectBug}
                />
                {displayId !== null && (
                    <div
                        ref={infoRef}
                        className={"critter-info-wrapper" + (isExiting ? " is-exiting" : "")}
                        onAnimationEnd={() => { if (isExiting) setExitingId(null); }}
                    >
                        <CritterInfo
                            critter={filteredBugs.find(b => b.id === displayId)}
                            hemisphere={hemisphere}
                            caught={isCaught('bug', displayId)}
                            onToggleCaught={() => toggleCaught('bug', displayId)}
                        />
                    </div>
                )}
            </div>
        </>
    )
}
export default Bugs
