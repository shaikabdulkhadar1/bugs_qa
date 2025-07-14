
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LucideIcon } from 'lucide-react';

interface Feature {
  id: string;
  icon: LucideIcon;
  title: string;
  description: string;
  color: string;
  badge: string;
}

interface FeatureCardProps {
  feature: Feature;
  isHovered: boolean;
}

const FeatureCard = ({ feature, isHovered }: FeatureCardProps) => {
  const { icon: Icon, title, description, color, badge } = feature;

  return (
    <motion.div
      whileHover={{ 
        y: -10,
        rotateX: 5,
        rotateY: 5,
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20 
      }}
      style={{ 
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
    >
      <Card className="relative h-full bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700 backdrop-blur-sm overflow-hidden group">
        {/* Animated background gradient */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
          animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Glowing border effect */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${color} opacity-20 blur-xl`}
          animate={isHovered ? { opacity: 0.3 } : { opacity: 0 }}
          transition={{ duration: 0.3 }}
        />

        <CardHeader className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <motion.div
              className={`p-3 rounded-lg bg-gradient-to-r ${color} shadow-lg`}
              whileHover={{ scale: 1.1, rotateZ: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Icon className="w-6 h-6 text-white" />
            </motion.div>
            <Badge variant="secondary" className="bg-slate-700/50 text-slate-300 border-slate-600">
              {badge}
            </Badge>
          </div>
          
          <CardTitle className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-400 group-hover:to-purple-400 transition-all duration-300">
            {title}
          </CardTitle>
        </CardHeader>

        <CardContent className="relative z-10">
          <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </CardDescription>
          
          {/* Interactive particles */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-60"
                style={{
                  left: `${20 + i * 15}%`,
                  top: `${30 + i * 10}%`,
                }}
                animate={isHovered ? {
                  y: [-5, -15, -5],
                  opacity: [0, 0.6, 0],
                  scale: [0, 1.2, 0]
                } : {}}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: isHovered ? Infinity : 0,
                  ease: "easeInOut"
                }}
              />
            ))}
          </div>
        </CardContent>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-5 skew-x-12 translate-x-full group-hover:translate-x-[-100%] transition-all duration-1000 ease-out"
          style={{ width: '50%' }}
        />
      </Card>
    </motion.div>
  );
};

export default FeatureCard;
