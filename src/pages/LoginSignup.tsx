import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth, googleProvider } from "../lib/firebase";

type FormData = {
    name: string;
    email: string;
    password: string;
};

const LoginSignup = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
    const [isLogin, setIsLogin] = useState(true);
    const [error, setError] = useState("");

    const onSubmit = async (data: FormData) => {
        setError("");
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, data.email, data.password);
            } else {
                const { user } = await createUserWithEmailAndPassword(auth, data.email, data.password);

                // Set displayName in Firebase Auth
                if (data.name) {
                    await updateProfile(user, { displayName: data.name });
                }
            }
        } catch (err: any) {
            setError(err.message);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
            <h2>{isLogin ? "Login" : "Sign Up"}</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
                {!isLogin && <input
                    type="text"
                    placeholder="Name"
                    {...register("name", { required: "Name is required" })}
                />}
                {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}

                <input
                    type="email"
                    placeholder="Email"
                    {...register("email", { required: "Email is required" })}
                />
                {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}

                <input
                    type="password"
                    placeholder="Password"
                    {...register("password", {
                        required: "Password is required",
                        minLength: { value: 6, message: "Min length is 6" }
                    })}
                />
                {errors.password && (
                    <p style={{ color: "red" }}>{errors.password.message}</p>
                )}

                <button type="submit">{isLogin ? "Login" : "Sign Up"}</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}

            {/* Google Sign-in */}
            <button
                onClick={handleGoogleLogin}
            >
                Continue with Google
            </button>

            <p onClick={() => setIsLogin(!isLogin)}>
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
            </p>

        </div>
    );
}

export default LoginSignup;