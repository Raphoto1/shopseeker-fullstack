//imports propios
import Register from "@/components/user/Register";
import Login from "@/components/user/Login";
export default function auth() {
    return (
        <>
            <div className="flex justify-around p-5">
                <div>
                    <Register/>
                </div>
                <div>
                    <Login/>
                </div>
            </div>
        </>
    );
}