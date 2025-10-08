import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { auth, googleProvider } from "../lib/firebase";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { FcGoogle } from "react-icons/fc";
import bgBanner from "../assets/images/chatloginbg.webp";
import modelImg from "../assets/images/modelimg.webp";
import modelImgWhite from "../assets/images/modelimgwhite.webp";

type FormData = {
    name: string;
    email: string;
    password: string;
};

const LoginSignup = ({ className, ...props }: React.ComponentProps<"div">) => {
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
        <>
            <div className="grid grid-cols-12 border bg-size-[100%_auto] min-h-screen" style={{ backgroundImage: `url(${bgBanner})` }}>
                <div className="col-span-12 md:col-span-8 flex items-end justify-center">
                    <img
                        // src={modelImg}
                        src={modelImgWhite}
                        alt="Model Image"
                        className="w-[45%]"
                    />
                </div>
                <div className="col-span-12 md:col-span-4">
                    <div className={cn("flex flex-col gap-6 h-full bg-white/95", className)} {...props}>
                        <Card className="my-auto w-[90%] mx-auto border-0 shadow-none">
                            <CardHeader className="text-center">
                                <CardTitle className="text-xl">Logo</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="grid gap-6">
                                        <div className="grid gap-6">
                                            {!isLogin && <div className="grid gap-3">
                                                <Label htmlFor="name">Name</Label>
                                                <Input
                                                    id="name"
                                                    type="text"
                                                    placeholder="John Doe"
                                                    {...register("name", { required: "Name is required" })}
                                                />
                                                {errors.name && <p style={{ color: "red" }}>{errors.name.message}</p>}
                                            </div>}
                                            <div className="grid gap-3">
                                                <Label htmlFor="email">Email</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    placeholder="m@example.com"
                                                    {...register("email", { required: "Email is required" })}
                                                />
                                                {errors.email && <p style={{ color: "red" }}>{errors.email.message}</p>}
                                            </div>
                                            <div className="grid gap-3">
                                                <div className="flex items-center">
                                                    <Label htmlFor="password">Password</Label>
                                                    <a
                                                        href="#"
                                                        className="ml-auto text-sm underline-offset-4 hover:underline"
                                                    >
                                                        Forgot your password?
                                                    </a>
                                                </div>
                                                <Input
                                                    id="password"
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
                                            </div>
                                            <Button type="submit" className="w-full">
                                                {isLogin ? "Login" : "Sign Up"}
                                            </Button>
                                            {error && <p style={{ color: "red" }}>{error}</p>}
                                        </div>
                                        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
                                            <span className="bg-card text-muted-foreground relative z-10 px-2">
                                                Or
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-4">
                                            <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                                                <FcGoogle />
                                                Login with Google
                                            </Button>
                                        </div>
                                        <div className="text-center text-sm">
                                            {isLogin ? (
                                                <>Don't have an account?
                                                    <span
                                                        className="underline underline-offset-4 ms-1 cursor-pointer"
                                                        onClick={() => setIsLogin(!isLogin)}>
                                                        Sign up
                                                    </span>
                                                </>
                                            ) : (
                                                <>Already have an account?
                                                    <span
                                                        className="underline underline-offset-4 ms-1 cursor-pointer"
                                                        onClick={() => setIsLogin(!isLogin)}>
                                                        Login
                                                    </span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                </div>
            </div>


            {/* <div style={{ maxWidth: "400px", margin: "0 auto", padding: "2rem" }}>
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

                
                <button
                    onClick={handleGoogleLogin}
                >
                    Continue with Google
                </button>

                <p onClick={() => setIsLogin(!isLogin)}>
                    {isLogin ? "Don't have an account? Sign up" : "Already have an account? Login"}
                </p>

            </div> */}
        </>
    );
}

export default LoginSignup;