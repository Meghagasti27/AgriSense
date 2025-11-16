import heroimage from '/hero-image.png'
import { Button } from "@/components/ui/button"

function HeroSection() {
    return (
        <div className='flex justify-between mx-auto px-10 md:px-15 gap-2 mt-15'>
            <div className='w-full h-[60vh] flex items-center justify-center my-2 '>
                <div className="flex flex-col gap-5">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
                        Grow crops that are built to succeed
                    </h1>

                    <p className="text-md md:text-lg text-slate-600 leading-relaxed">
                        A powerful AI advisor that recommends the best crops for you.
                    </p>

                    <div className="flex gap-4 pt-4 pl-4">
                        <Button className='bg-green-500 hover:bg-green-400 text-white px-8 py-6 rounded-lg font-semibold transition-colors shadow-lg shadow-green-300'>
                            Learn More
                        </Button>
                        <Button className='bg-black hover:bg-gray-800 text-white px-8 py-6 rounded-lg font-semibold transition-colors shadow-lg shadow-green-300'>
                            Get Started
                        </Button>
                    </div>
                </div>
            </div>
            <div className='hidden md:flex w-full h-[60vh] items-center justify-center my-2'>
                <img src={heroimage} alt="hero-image" className='w-130 h-auto drop-shadow-[0_0_100px_rgba(34,197,94,0.8)]'/>
            </div>
        </div>
    )
}

export default HeroSection