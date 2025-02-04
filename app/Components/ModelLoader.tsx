"use client";

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
// @ts-ignore
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// @ts-ignore
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

const ModelLoader: React.FC = () => {
    const [modelData, setModelData] = useState<{ url: string; type: string } | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [bgColor, setBgColor] = useState('#1f2937');
    const [isRotating, setIsRotating] = useState<boolean>(false);
    const [axis, setAxis] = useState('x');
    const [duration, setDuration] = useState(5);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const type = file.name.split('.').pop()?.toLowerCase() || '';
            setModelData({ url, type });
        }
    };

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    const toggleRotation = () => {
        setIsRotating((prev) => !prev);
    };

    const handleAxisChange = (event : any) => {
        setAxis(event.target.value);
    };

    const handleDurationChange = (event : any) => {
        setDuration(event.target.value);
    };

    const createRecord = () => {

    }
    
    return (
        <div className="flex flex-row h-[80vh] w-full rounded-xl overflow-hidden shadow-2xl">
            {/* Sidebar */}
            <div className="w-64 p-6 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 flex flex-col gap-6">
                <button
                    onClick={handleButtonClick}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white
                             font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg
                             hover:shadow-xl active:scale-95"
                >
                    📁 Upload Model
                </button>

                <button
                    onClick={toggleRotation}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white
                            font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg
                            hover:shadow-xl active:scale-95"
                >
                    {isRotating ? "⏹ Stop Rotation" : "🔃 Rotate Model"}
                </button>

                <div className="mt-4">
                    <label className="block text-white">Choose Axis:</label>
                    <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="x"
                                checked={axis === 'x'}
                                onChange={handleAxisChange}
                                className="form-radio text-white"
                            />
                            <span className="ml-2 text-white">X-Axis</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="y"
                                checked={axis === 'y'}
                                onChange={handleAxisChange}
                                className="form-radio text-white"
                            />
                            <span className="ml-2 text-white">Y-Axis</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="z"
                                checked={axis === 'z'}
                                onChange={handleAxisChange}
                                className="form-radio text-white"
                            />
                            <span className="ml-2 text-white">Z-Axis</span>
                        </label>
                    </div>
                </div>

                <div className="mt-4">
                    <label className="block text-white">Video Duration (seconds):</label>
                    <input
                        type="range"
                        min="1"
                        max="60"
                        value={duration}
                        onChange={handleDurationChange}
                        className="mt-2 w-full"
                    />
                    <span className="text-white">{duration} seconds</span>
                </div>

                <button
                    onClick={createRecord}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white
                            font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg
                            hover:shadow-xl active:scale-95 mt-4"
                >
                    📹 Create Record
                </button>

                <input
                    ref={inputRef}
                    type="file"
                    accept=".glb,.fbx"
                    className="hidden"
                    onChange={handleFileChange}
                />

                <div className="mt-4">
                    <label className="text-gray-300 text-sm mb-2 block">Canvas Color</label>
                    <input
                        type="color"
                        value={bgColor}
                        onChange={(e) => setBgColor(e.target.value)}
                        className="w-full h-10 rounded-lg cursor-pointer"
                    />
                </div>

                <div className="text-gray-400 text-sm mt-auto">
                    <p className="border-t border-gray-700 pt-4">
                        Supported formats: GLB, FBX
                    </p>
                </div>
            </div>

            {/* Canvas Container */}
            <div className="flex-1 relative" style={{ backgroundColor: bgColor }}>
                <Canvas
                    camera={{ position: [2, 2, 2] }}
                    className="rounded-r-xl"
                >
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} />
                    {modelData && <Model {...modelData} isRotating={isRotating} />}
                    <OrbitControls
                        makeDefault
                        enableDamping
                        dampingFactor={0.05}
                    />
                </Canvas>

                {!modelData && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-gray-400 text-lg animate-pulse">
                            👆 Upload a model to begin
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Model: React.FC<{ url: string; type: string; isRotating: boolean }> = ({ url, type, isRotating }) => {
    const [scene, setScene] = useState<THREE.Group | null>(null);
    const modelRef = useRef<THREE.Group>(null);

    useEffect(() => {
        let isMounted = true;
        const loader = type === 'glb' ? new GLTFLoader() : new FBXLoader();

        const loadModel = async () => {
            try {
                if (type === 'glb') {
                    const gltf = await loader.loadAsync(url);
                    if (isMounted) setScene(gltf.scene);
                } else if (type === 'fbx') {
                    const fbx = await loader.loadAsync(url);
                    if (isMounted) setScene(fbx);
                }
            } catch (error) {
                console.error('Error loading model:', error);
            }
        };

        loadModel();

        return () => {
            isMounted = false;
            URL.revokeObjectURL(url);
        };
    }, [url, type]);

    // Handle continuous rotation
    useEffect(() => {
        if (!isRotating || !modelRef.current) return;

        let frameId: number;
        const animate = () => {
            if (modelRef.current) {
                modelRef.current.rotation.y += 0.01; // Adjust speed as needed
            }
            frameId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(frameId);
    }, [isRotating]);

    return scene ? <primitive object={scene} ref={modelRef} /> : null;
};

export default ModelLoader;