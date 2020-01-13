import app from "./app";
import * as dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log('🚀 Server listening on port ' + PORT+" 🚀");
})

process.on('SIGINT', function() {
    console.log("Caught interrupt signal");
    process.exit();
});