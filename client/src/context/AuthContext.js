import {
    createContext,
    useEffect,
    useState
} from "react";

import API from "../api/axios";

export const AuthContext = createContext();

export default function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        const loadUser = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {

                const response = await API.get("/auth/me");

                setUser(response.data.user);

            } catch (error) {

                console.error("Authentication failed");

                localStorage.removeItem("token");

                setUser(null);

            } finally {

                setLoading(false);

            }

        };

        loadUser();

    }, []);


    return (

        <AuthContext.Provider
            value={{
                user,
                setUser,
                loading
            }}
        >
            {children}
        </AuthContext.Provider>

    );
}