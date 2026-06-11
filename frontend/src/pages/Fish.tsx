import CritterCard from "../components/CritterCard"
import fish from "../../../backend/data/fish.json"
import FilterBar from "../components/FilterBar"
import { useState } from "react"
function Fish() {
    const [showAvailabilityOnly, setShowAvailabilityOnly] = useState(false);
    const [showCaughtOnly, setShowCaughtOnly] = useState(false);

    

    return (
        <>
            <FilterBar 
                showAvailabilityOnly={showAvailabilityOnly}
                showCaughtOnly={showCaughtOnly}
                onToggleAvailable={() => setShowAvailabilityOnly(!showAvailabilityOnly)}
                onToggleCaught={() => setShowCaughtOnly(!showCaughtOnly)}
            />
            {fish.map((f) => (
                <CritterCard key={f.id} {...f} />
            ))}
        </>
    )
}
export default Fish