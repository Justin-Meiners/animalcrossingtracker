import "./../styles/CritterCard.css"
import { isAvailableNow } from '../tools/Availability.ts';
import { type Critter } from '../types/Critter.ts';
function CritterCard( { critter, caught, selected, hemisphere, onToggleSelect }: { critter: Critter, caught: boolean, selected: boolean, hemisphere: 'northern' | 'southern', onToggleSelect: () => void } ) {
    const times = critter[hemisphere]?.times_by_month ?? critter.northern.times_by_month;
    const available = isAvailableNow(times);

    return (
        <div className={"critter-card" + (selected ? " selected" : (caught ? " caught" : "") + (!available ? " unavailable" : ""))} onClick={onToggleSelect}>
            { available &&  (<div className="available-dot" /> )}

            <img src={critter.image_url} alt={critter.name} className="critter-image" />
            <span className="critter-name">{critter.name}</span>
            <span className="critter-price">{critter.sell_nook}🛎️</span>
        </div>
    )
}

export default CritterCard;