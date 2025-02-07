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
    const [axis, setAxis] = useState<string>('x');
    const [duration, setDuration] = useState<number>(5);
    const [speed, setSpeed] = useState<number>(1);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isRecording, setIsRecording] = useState<boolean>(false);
    const [videoFormat, setVideoFormat] = useState<string>("mp4");

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const type = file.name.split('.').pop()?.toLowerCase() || '';
            setModelData({ url, type });
        }
    };

    useEffect(() => {
        if (canvasRef.current) {
            canvasRef.current.style.width = '100%';
            canvasRef.current.style.height = '100%';
        }
    })

    const handleButtonClick = () => {
        inputRef.current?.click();
    };

    const toggleRotation = () => {
        setIsRotating((prev) => !prev);
    };

    const handleAxisChange = (event: any) => {
        setAxis(event.target.value);
    };

    const handleVideoFormatChange = (event: any) => {
        setVideoFormat(event.target.value);
    };

    const handleDurationChange = (event: any) => {
        setDuration(event.target.value);
    };

    const handleSpeedChange = (event: any) => {
        setSpeed(event.target.value);
    };

    const createRecord = async () => {
        if (!canvasRef.current || !modelData) return;
      
        try {
          const stream = canvasRef.current.captureStream(30);
          const options = { mimeType: `video/${videoFormat}; codecs=vp9` };
          const recorder = new MediaRecorder(stream, options);
          const chunks: Blob[] = [];
      
          recorder.ondataavailable = (event) => {
            if (event.data.size > 0) chunks.push(event.data);
          };
      
          recorder.onstop = () => {
            const blob = new Blob(chunks, { type: `video/${videoFormat}` });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `recording-${Date.now()}.${videoFormat}`;
            a.click();
            URL.revokeObjectURL(url);
            setIsRecording(false);
          };
      
          // Start recording with time slice
          recorder.start(100); // Collect data every 100ms
          setIsRecording(true);
          
          setTimeout(() => {
            recorder.stop();
            stream.getTracks().forEach(track => track.stop());
          }, duration * 1000);
      
        } catch (error) {
          console.error('Recording failed:', error);
          setIsRecording(false);
        }
    };

    return (
        <div className="flex flex-row h-[80vh] w-full rounded-xl overflow-hidden shadow-2xl">
            {/* Sidebar */}
            <div className="w-64 p-6 bg-gradient-to-b from-gray-800 to-gray-900 border-r border-gray-700 flex flex-col gap-6">
                <button
                    onClick={handleButtonClick}
                    className="px-6 py-3 bg-gradient-to-r from-blue-700 to-red-600 rounded-lg text-white
                          font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg
                          hover:shadow-xl active:scale-95"
                >
                    📁 Upload Model
                </button>

                <button
                    onClick={toggleRotation}
                    className="px-6 py-3 bg-gradient-to-r from-blue-700 to-red-600 rounded-lg text-white
                         font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg
                         hover:shadow-xl active:scale-95"
                >
                    {isRotating ? "⏹ Stop Rotation" : "🔃 Rotate Model"}
                </button>

                <div className="mt-4">
                    <label className="block text-white">Rotation speed :</label>
                    <input
                        type="range"
                        min="1"
                        max="10"
                        value={speed}
                        onChange={handleSpeedChange}
                        className="mt-2 w-full"
                    />
                    <span className="text-white">{speed}</span>
                </div>

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
                            <span className="ml-2 text-white">X</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="y"
                                checked={axis === 'y'}
                                onChange={handleAxisChange}
                                className="form-radio text-white"
                            />
                            <span className="ml-2 text-white">Y</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="z"
                                checked={axis === 'z'}
                                onChange={handleAxisChange}
                                className="form-radio text-white"
                            />
                            <span className="ml-2 text-white">Z</span>
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
                disabled={!modelData}
                className={`px-6 py-3 bg-gradient-to-r from-blue-700 to-red-600 rounded-lg text-white
                    font-semibold hover:scale-105 transform transition-all duration-200 shadow-lg
                    hover:shadow-xl active:scale-95 mt-4 ${!modelData ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                📹 Create Record
                </button>

                <div className="absolute top-2 right-2 text-red-700 text-2xl">
                {isRecording ? '🔴 Recording' : ''}
                </div>

                <div className="mt-4">
                    <label className="block text-white">Choose Video format:</label>
                    <div className="flex space-x-4 mt-2">
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="mp4"
                                checked={videoFormat === 'mp4'}
                                onChange={handleVideoFormatChange}
                                className="form-radio text-white"
                            />
                            <span className="ml-2 text-white">MP4</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input
                                type="radio"
                                value="webm"
                                checked={videoFormat === 'webm'}
                                onChange={handleVideoFormatChange}
                                className="form-radio text-white"
                            />
                            <span className="ml-2 text-white">WEBM</span>
                        </label>
                    </div>
                </div>

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
                ref={canvasRef}
                camera={{ position: [2, 2, 2] }}
                className="rounded-r-xl"
                gl={{ preserveDrawingBuffer: true }}
                frameloop={isRecording ? "always" : "demand"} // Force continuous rendering during recording
                >
                    <ambientLight intensity={0.5} />
                    {modelData && <Model {...modelData} isRotating={isRotating} speed={speed} axis={axis} />}
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

const Model: React.FC<{ url: string; type: string; isRotating: boolean; speed: number; axis: string }> = ({ url, type, isRotating, speed, axis }) => {
    // @ts-ignore
    const [scene, setScene] = useState<THREE.Group | null>(null);
    // @ts-ignore
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
        if (!modelRef.current) return;

        let animationId: number;
        const animate = () => {
          if (isRotating && modelRef.current) {
            switch (axis) {
              case 'x': modelRef.current.rotation.x += 0.01 * speed; break;
              case 'y': modelRef.current.rotation.y += 0.01 * speed; break;
              case 'z': modelRef.current.rotation.z += 0.01 * speed; break;
            }
          }
          animationId = requestAnimationFrame(animate);
        };

        animate();

        return () => cancelAnimationFrame(animationId);
    }, [isRotating, speed, axis]);

    // @ts-ignore
    return scene ? <primitive object={scene} ref={modelRef} /> : null;
};

export default ModelLoader;