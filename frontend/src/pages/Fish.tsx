import CritterCard from "../components/CritterCard"
import fish from "../../../backend/data/fish.json"
function Fish() {
    return (
        <>
            {fish.map((f) => (
                <CritterCard key={f.id} {...f} />
            ))}
        </>
    )
}
export default Fish