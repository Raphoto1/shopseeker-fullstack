import { connect, connection } from "mongoose";

const mongoDbPass = process.env.MONGODB_URI;

const conn = {
    isConnected: false,
};

export async function dbConnect() {
    if (conn.isConnected) {
        return;
    }
    const db = await connect(`${mongoDbPass}`);
    conn.isConnected = db.connections[0].readyState;
};
connection.on("connected", () => { console.log("mongoDb Connected") });
connection.on("error", (err) => { console.log(`mongoDb ERROR: ${err.message}`) });