import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { UserManagement } from "./UserManagement";

function App() {
  return (
    <Theme style={{ width: "100%" }}>
      <UserManagement />
    </Theme>
  );
}

export default App;
