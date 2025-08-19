import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { useEffect, useState } from "react"
import { useLoginUserMutation, useRegisterUserMutation } from "@/redux/features/api/authApi"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const Login = () => {
    const [signupInput, setSignupInput] = useState({
        name: "",
        email: "",
        password: ""
    });
    const [loginInput, setLoginInput] = useState({
        email: "",
        password: ""
    });

    const [
        registerUser, {
            data: registerData,
            error: registerError,
            isLoading: registerIsLoading,
            isSuccess: registerIsSuccess
        }] = useRegisterUserMutation();

    const [
        loginUser, {
            data: loginData,
            error: loginError,
            isLoading: loginIsLoading,
            isSuccess: loginIsSuccess
        }] = useLoginUserMutation();

    const navigate = useNavigate();

    const onChangeHandler = (e, type) => {
        if (type === "signup") {
            setSignupInput({
                ...signupInput,
                [e.target.name]: e.target.value,
            })
        } else {
            setLoginInput({
                ...loginInput,
                [e.target.name]: e.target.value,
            })
        }
    };

    const submitHandler = async (e, type) => {
        e.preventDefault();
        const inputData = type === "signup" ? signupInput : loginInput;
        const action = type === "signup" ? registerUser : loginUser;

        await action(inputData);
    }

    useEffect(() => {
        if (registerIsSuccess && registerData) {
            toast.success(registerData.message || "Signup successful");
            setSignupInput({ name: "", email: "", password: "" });
        }

        if (registerError) {
            console.log("Signup error:", registerError);
            toast.error(registerError?.data?.message || "Signup failed");
        }

        if (loginError) {
            console.log("Login error:", loginError);
            toast.error(loginError?.data?.message || "Login failed");
        }

        if (loginIsSuccess && loginData) {
            toast.success(loginData.message || "Login successful");
            setLoginInput({ email: "", password: "" });
            navigate("/");
        }
    }, [
        loginIsLoading,
        registerIsLoading,
        loginIsSuccess,
        registerIsSuccess,
        loginData,
        registerData,
        loginError,
        registerError,
    ]);


    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-cyan-950/70 px-4">
            <div className="flex w-full max-w-sm flex-col gap-6">
                <Tabs defaultValue="login">
                    <TabsList>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                        <TabsTrigger value="login">Login</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signup">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign Up</CardTitle>
                                <CardDescription>
                                    Create a new account to upgrade your skills
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        onChange={(e) => onChangeHandler(e, "signup")}
                                        name="name" value={signupInput.name}
                                        id="name"
                                        type="text"
                                        placeholder="e.g Abdullah Rahmani"
                                        required={true}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        onChange={(e) => onChangeHandler(e, "signup")} name="email" value={signupInput.email} id="email" type="email" placeholder="e.g abdullah@gmail.com" required={true} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="password">Password</Label>
                                    <Input onChange={(e) => onChangeHandler(e, "signup")} name="password" value={signupInput.password} id="password" type="password" placeholder="e.g abdullah@123" required={true} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={registerIsLoading} onClick={(e) => submitHandler(e, "signup")}>{registerIsLoading ? "Signing Up..." : "Sign Up"}</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="login">
                        <Card>
                            <CardHeader>
                                <CardTitle>Login</CardTitle>
                                <CardDescription>
                                    Login to your success's acadami
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="emailLogin">Email</Label>
                                    <Input onChange={(e) => onChangeHandler(e, "login")} name="email" value={loginInput.email} id="emailLogin" type="email" placeholder="Enter your email" required={true} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="passwordLogin">Password</Label>
                                    <Input onChange={(e) => onChangeHandler(e, "login")} name="password" value={loginInput.password} id="passwordLogin" type="password" placeholder="Enter your password" required={true} />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button disabled={loginIsLoading} onClick={(e) => submitHandler(e, "login")}>{loginIsLoading ? "Logingin..." : "Login"}</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Login;