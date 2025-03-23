
import { motion } from "framer-motion";


// Skeleton Loading Component
const SkeletonLoader = () => (
<div className="w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-center">
    {[...Array(8)].map((_, index) => (
    <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
        <div className="w-full h-[300px] bg-gray-200 animate-pulse"></div>
        <div className="p-4">
        <div className="h-6 bg-gray-200 animate-pulse rounded mb-2"></div>
        <div className="h-4 bg-gray-200 animate-pulse rounded w-1/2"></div>
        </div>
    </motion.div>
    ))}
</div>
);

export default SkeletonLoader