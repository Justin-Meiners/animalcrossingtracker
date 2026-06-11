import "./../styles/CritterCard.css"
import { isAvailableNow } from '../tools/Availability.ts';
import { type Critter } from '../types/Critter.ts';
function CritterCard( { critter, caught, onToggleCaught }: { critter: Critter, caught: boolean, onToggleCaught: () => void } ) {
    const available = isAvailableNow(critter.northern.times_by_month);

    return (
        <div className={"critter-card" + (caught ? " caught" : "") + (!available ? " unavailable" : "")} onClick={onToggleCaught}>
            { available &&  (<div className="available-dot" /> )}

            <img src={critter.image_url} alt={critter.name} className="critter-image" />
            <span className="critter-name">{critter.name}</span>
            <span className="critter-price">{critter.sell_nook}🛎️</span>
        </div>
    )
}

export default CritterCard;