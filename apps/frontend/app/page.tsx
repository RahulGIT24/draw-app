import React from 'react';
import { Button } from './components/ui/Button';
import { DotBackground } from './components/ui/DotBackground';
import { AnimatedTooltip } from './components/ui/animated-tooltip';
import { Paintbrush, Palette, Users, Zap } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

type Creator = {
    id: number;
    name: string;
    designation: string;
    image: string;
    link: string;
};

export default function Home() {
    const creatorInfo: Creator[] = [{
        id: 1,
        name: "Rahul",
        designation: "Creator",
        image: "https://avatars.githubusercontent.com/u/103873656?v=4",
        link: "https://github.com/RahulGIT24"
    }];

    const features = [
        {
            icon: <Paintbrush className="w-8 h-8" />,
            title: "Real-time Drawing",
            description: "Draw and collaborate in real-time with others"
        },
        {
            icon: <Palette className="w-8 h-8" />,
            title: "Rich Tools",
            description: "Professional drawing tools and brushes"
        },
        {
            icon: <Users className="w-8 h-8" />,
            title: "Collaboration",
            description: "Work together on the same canvas"
        },
        {
            icon: <Zap className="w-8 h-8" />,
            title: "Lightning Fast",
            description: "Smooth performance with instant updates"
        }
    ];

    return (
        <>
            {/* Navigation */}
            <div className="absolute top-0 w-full z-20">
                <div className="bg-black/20 backdrop-blur-md border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
                        <div className="flex items-center space-x-3">
                            <Paintbrush className='w-8 h-8 text-white'/>
                            <span className="text-2xl font-bold text-white">DrawApp</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link href={'/signin'}>
                                <Button
                                    text="Sign In"
                                    classname="bg-white/10 text-white border border-white/20 hover:bg-white/20 backdrop-blur-sm"
                                />
                            </Link>
                            <Link href={'/signup'}>
                                <Button
                                    text="Join Now"
                                    classname="bg-gradient-to-r from-red-500 to-red-600 text-white border-transparent hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25"
                                />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="min-h-screen flex flex-col">
                {/* Hero Section */}
                <div className="flex-1 flex flex-col justify-center items-center px-6 pt-20">
                    <div className="text-center space-y-8 max-w-6xl">
                        <h1 className="text-6xl md:text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-red-500 to-purple-500 animate-pulse">
                            Unleash Creativity
                        </h1>
                        <h2 className="text-3xl md:text-5xl font-semibold text-white/90">
                            By Drawing on Canvas
                        </h2>
                        <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                            Experience the future of collaborative drawing with real-time synchronization,
                            professional tools, and seamless teamwork.
                        </p>

                        <div className="flex justify-center space-x-6 pt-8">
                            <Link href={"/signup"}>
                                <Button
                                    text="Start Drawing"
                                    classname="bg-gradient-to-r from-red-500 to-purple-600 text-white px-8 py-4 text-lg shadow-xl shadow-red-500/25 hover:shadow-red-500/40"
                                />
                            </Link>
                        </div>
                    </div>

                    {/* Video Showcase */}
                    <div className="mt-16 relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-purple-500/20 rounded-3xl blur-xl transform scale-105"></div>
                        <div className="relative bg-black/30 backdrop-blur-sm rounded-3xl p-4 border border-white/10">
                            <video
                                width="1000"
                                height="600"
                                autoPlay
                                loop
                                muted
                                className="rounded-2xl shadow-2xl transform hover:scale-[1.02] transition-all duration-500"
                                style={{
                                    filter: 'brightness(1.1) contrast(1.1)',
                                }}
                            >
                                <source src="https://drive.google.com/file/d/1aFRmJl6alDgQW59cIgLUHlHPExxBCUMZ/view?usp=sharing" type="video/webm" />
                                Your browser does not support the video tag.
                            </video>
                            <div className="absolute top-8 left-8 bg-black/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                    <span className="text-white text-sm font-semibold">Live Demo</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Features Grid */}
                    <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 transform hover:scale-105 group"
                            >
                                <div className="text-red-500 mb-4 group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                                <p className="text-gray-300 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>

                    {/* Creator Section */}
                    <div className="mt-24 mb-16 text-center flex justify-center items-center flex-col">
                        <p className="text-gray-300 text-lg mb-6">Created with ❤️ by</p>
                        <AnimatedTooltip items={creatorInfo} />
                    </div>
                </div>
            </div>
        </>
    );
}