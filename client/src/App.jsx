import { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignInPage from "./pages/SignInPage";
import { ChatContext } from "./context/ChatProvider";

const App = () => {
    const { user } = useContext(ChatContext);

    return (
        <Routes>
            <Route path="/" element={user ? <Home /> : <Navigate to='/signin' />} />
            <Route path="/signin" element={!user ? <SignInPage /> : <Navigate to='/' />} />
        </Routes>
    );
};

export default App;