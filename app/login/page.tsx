"use client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button, TextField, Text, Link } from "@radix-ui/themes";
import { Spinner } from "@radix-ui/themes";
import { useState } from "react";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>();
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  async function loginFunc() {
    setIsLoading(true);
    if (!email || !password) return setIsLoading(false);
    const data = {
      email: email,
      password: password,
    };
    try {
      setIsLoading(true);
      const res = await axios.post("/api/auth/login", data);

      const cdata = res.data;
      if (cdata.message) {
        router.push("/admin");
      } else if (cdata.error) {
        setIsLoading(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      console.error(error.response?.data?.error || "An error occurred");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="px-4 mx-auto w-[95%] sm:w-[50%] lg:w-[35%] space-y-4 mb-10">
        <div></div>
        <div>
          <Text as="div" size="6" weight="bold">
            Gain access
          </Text>
        </div>
        <div>
          <div className="text-right">
            <span>
              <b>Email: </b>
              {process.env.NEXT_PUBLIC_ADMIN_EMAIL}
            </span>
            <br />
            <span>
              <b>Password: </b>
              {process.env.NEXT_PUBLIC_ADMIN_PASS}
            </span>
          </div>
        </div>

        <div>
          <label>
            <p>Email</p>
            <TextField.Root
              variant="surface"
              type="email"
              size="3"
              placeholder="example@example.com"
              style={{ width: "100%" }}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
        </div>

        <div>
          <label>
            <p>Password</p>
            <TextField.Root
              variant="surface"
              type="password"
              size="3"
              placeholder="example@example.com"
              style={{ width: "100%" }}
              onChange={(e) => setPassword(e.target.value)}
            />
          </label>
        </div>

        {isLoading ? (
          <Button
            loading
            variant="solid"
            size="3"
            className="w-full"
            style={{ width: "100%" }}
          ></Button>
        ) : (
          <Button
            variant="solid"
            size="3"
            style={{ width: "100%" }}
            onClick={loginFunc}
            className="cursor-pointer"
          >
            Login
          </Button>
        )}

        <div className="mt-4 text-center">
          {/* <Link>Back home</Link> */}
          {/* <Button variant="surface" style={{ width: "100%" }} > */}
          <Button variant="surface" size="3" style={{ width: "100%" }}>
            Back home
          </Button>
        </div>
      </div>
    </div>
  );
}
