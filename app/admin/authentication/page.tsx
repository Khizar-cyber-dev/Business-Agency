import AuthForm from "../components/AuthForm";
import { auth, currentUser } from "@clerk/nextjs/server";
import { SignInButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import prisma from "@/lib/prismaDB";

export default async function Page() {
    const { userId } = await auth();

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress;
    if (email) {
        const dbUser = await prisma.user.findUnique({
            where: { email },
            select: { role: true }
        });
        
        if (dbUser && dbUser.role !== 'CLIENT') {
            redirect('/admin/dashboard');
        }
    }

    return (
        <main>
            <div className="fixed inset-0 -z-20 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]"></div>
                <div className="flex flex-row">
                    {/* Authentication Form for adming */}
                    <div className="w-[50%]">
                       { userId ? <AuthForm /> :
                        <div className="flex flex-col justify-center items-center h-screen p-8">
                            <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
                                <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Sign In</h1>
                                <SignInButton mode="modal">
                                    <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition">
                                        Sign In
                                    </button>
                                </SignInButton>
                            </div>
                        </div>
                       }
                    </div>
                    {/* Decorative Section */}
                    <div className="bg-[url('/admin-auth-img.jpg')] bg-cover bg-center w-[50%]">
                        <div className="h-full w-full flex flex-col justify-center items-center text-white p-8">
                            <h2 className="text-3xl font-bold mb-4">Welcome to Start a Business</h2>
                            <p className="mb-6 text-2xl font-bold text-center">
                                Create and manage your business with ease. Join us today and take the first step towards success!
                            </p>
                        </div>
                    </div>
                </div>

        </main>
    );
}