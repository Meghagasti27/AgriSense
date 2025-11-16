import { Sprout, CloudRain, TrendingUp } from 'lucide-react';
import { Card } from '@/components/ui/card';

const problems = [
    {
        icon: Sprout,
        title: 'Poor crop selection',
        description: 'Leads to yieldloss and low profits',
        color: 'from-slate-600 to-slate-700'
    },
    {
        icon: CloudRain,
        title: 'Weather is unpredictable',
        description: 'Ruins crops you just planted',
        color: 'from-blue-600 to-blue-700'
    },
    {
        icon: TrendingUp,
        title: 'Market demand fluctuates',
        description: 'Trends are hard to anticipate',
        color: 'from-indigo-600 to-indigo-700'
    }
];
function Slides() {
    return (
        <div className='w-full mt-4'>
            <div className='text-4xl sm:text-5xl md:text-5xl font-bold text-slate-900 leading-tight text-center py-10'>
                What AgriSense helps you overcome ?
            </div>
            {/* Problem Cards Grid */}
            <div className="grid md:grid-cols-3 gap-4 p-10 max-w-7xl mx-auto">
                {problems.map((problem, index) => (
                    <Card
                        key={index}
                        className="bg-white rounded-2xl p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-slate-200 flex flex-col items-center justify-center py-10 shadow-xl shadow-green-200"
                    >
                        {/* Icon Container */}
                        <div className={`w-20 h-20 bg-linear-to-br ${problem.color} rounded-2xl flex items-center justify-center mb-2 shadow-lg`}>
                            <problem.icon className="w-10 h-10 text-white" strokeWidth={2} />
                        </div>

                        {/* Content */}
                        <h3 className="text-2xl font-bold text-slate-900 mb-3 ">
                            {problem.title}
                        </h3>
                        <p className="text-lg text-slate-600 leading-relaxed ">
                            {problem.description}
                        </p>
                    </Card>
                ))}
            </div>
        </div>
    )
}

export default Slides