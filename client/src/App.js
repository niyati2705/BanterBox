import { Route } from "react-router-dom";
import "./Style.css";
import Homepage from "./pages/Homepage";
import Chatpage from "./pages/Chatpage";

function App() {
  return (

    <div className="App">
      <Route path = '/' component={Homepage} exact/>
      <Route path = '/chats' component={Chatpage}/>
    </div>
  );
}

export default App;
