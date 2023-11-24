//imports propios
import Register from "@/components/user/Register";
import Login from "@/components/user/Login";
export default function auth() {
    return (
        <>
            <div>
                <Register/>
            </div>
            <div>
                <Login/>
            </div>
        </>
    );
}