//imports propios
import DesignManager from "@/components/design/DesignManager";

export default function updateDesignUser({ params }) {
    const {id}=params
    return (
        <div>
            <DesignManager uId={ id} />
        </div>
    );
}