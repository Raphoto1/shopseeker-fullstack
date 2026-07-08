//imports propios
import DesignManager from "@/components/design/DesignManager";

export default async function updateDesignUser({ params }) {
    const { id } = await params;
    return (
        <div className='min-h-screen bg-gradient-to-br from-base-100 to-base-200 py-12 px-4'>
            <DesignManager uId={id} />
        </div>
    );
}