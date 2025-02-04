"use client";

import React from 'react';
import ModelLoader from "@/app/Components/ModelLoader.client";

export default function Home() {
    return (
        <div className="min-h-screen w-full bg-gray-900 select-none">
            <main className="h-full flex flex-col">
                <div className="flex flex-col items-center p-8 space-y-4">
                    <h1 className="text-3xl font-bold text-white mb-8">
                        3D Model Loader & Recorder
                    </h1>
                    <div className="w-full max-w-7xl flex-1">
                        <ModelLoader />
                    </div>
                </div>
            </main>
        </div>
    );
}