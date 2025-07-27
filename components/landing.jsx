
import React, { useState, useEffect } from 'react';
import { ChefHat, Utensils, Coffee, Pizza, Apple, Cookie, Soup, IceCream, Star, Zap, Shield, Clock, Users, Heart, Truck, Award, Package, Store, Handshake } from 'lucide-react';

const SupplyChainLanding = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const foodIcons = [
    { Icon: Pizza, delay: '0s', color: 'text-orange-400' },
    { Icon: Coffee, delay: '0.2s', color: 'text-amber-600' },
    { Icon: Apple, delay: '0.4s', color: 'text-red-400' },
    { Icon: Cookie, delay: '0.6s', color: 'text-yellow-500' },
    { Icon: Soup, delay: '0.8s', color: 'text-green-400' },
    { Icon: IceCream, delay: '1s', color: 'text-pink-400' },
  ];

  const features = [
    {
      icon: Package,
      title: "We have Our ML Model",
      description: "We know Distance matters..So here we have out ML model for showing you the nearest supplier you have",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: Truck,
      title: "Wastage Estimation and Order Prediction Using LLM",
      description: "Worried about how much to order we are here with our LLM Model that will guide you with quantity estimations.",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Handshake,
      title: "Compare with different sellers",
      description: "We provide you with a platfrom where you can compare pricing with different sellers",
      color: "from-purple-400 to-indigo-500"
    },
    {
      icon: Store,
      title: "Vendor Support",
      description: "Dedicated support team helping street vendors grow their business with expert guidance.",
      color: "from-orange-400 to-red-500"
    }
  ];

  // Calculate transform values for zoom effect
  const getTransformStyle = () => {
    const scale = Math.max(0.8, 1 - scrollY * 0.0003);
    const translateY = scrollY * 0.1;
    return {
      transform: `scale(${scale}) translateY(${translateY}px)`,
      transformOrigin: 'center center'
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-emerald-100 to-cyan-200 relative overflow-hidden">
      {/* Enhanced Background Design */}
      <div className="absolute inset-0">
        {/* Main gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-teal-100/30 via-emerald-200/40 to-cyan-100/30"></div>
        
        {/* Geometric patterns */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-teal-200/40 to-emerald-300/40 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-cyan-200/30 to-teal-300/30 rounded-full blur-2xl"></div>
          <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-200/40 to-cyan-300/40 rounded-full blur-xl"></div>
          <div className="absolute bottom-40 right-10 w-36 h-36 bg-gradient-to-r from-teal-300/30 to-emerald-200/30 rounded-full blur-xl"></div>
        </div>

        {/* Additional Shape Designs */}
        <div className="absolute inset-0">
          {/* Triangular shapes */}
          <div className="absolute top-20 left-1/3 w-0 h-0 border-l-[40px] border-r-[40px] border-b-[70px] border-l-transparent border-r-transparent border-b-teal-200/30 rotate-12"></div>
          <div className="absolute bottom-32 right-1/3 w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-b-emerald-300/25 -rotate-45"></div>
          
          {/* Square shapes */}
          <div className="absolute top-1/3 right-12 w-16 h-16 bg-gradient-to-br from-cyan-200/30 to-teal-300/20 rotate-45 rounded-lg"></div>
          <div className="absolute bottom-1/4 left-16 w-12 h-12 bg-gradient-to-br from-emerald-300/25 to-cyan-200/20 rotate-12 rounded-md"></div>
          
          {/* Hexagonal shapes */}
          <div className="absolute top-1/2 left-8 w-20 h-20 bg-teal-200/20 transform rotate-30" style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
          }}></div>
          <div className="absolute top-16 right-1/4 w-14 h-14 bg-emerald-300/25 transform -rotate-15" style={{
            clipPath: 'polygon(30% 0%, 70% 0%, 100% 50%, 70% 100%, 30% 100%, 0% 50%)'
          }}></div>
          
          {/* Diamond shapes */}
          <div className="absolute bottom-16 left-1/2 w-10 h-10 bg-gradient-to-r from-cyan-300/30 to-teal-200/25 transform rotate-45"></div>
          <div className="absolute top-3/4 right-20 w-8 h-8 bg-gradient-to-r from-emerald-200/35 to-cyan-300/20 transform rotate-45"></div>
          
          {/* Circular ring shapes */}
          <div className="absolute top-40 left-20 w-24 h-24 border-4 border-teal-300/25 rounded-full"></div>
          <div className="absolute bottom-40 right-32 w-16 h-16 border-3 border-emerald-200/30 rounded-full"></div>
          
          {/* Wave-like curved shapes */}
          <div className="absolute top-1/4 left-1/2 w-32 h-8 bg-gradient-to-r from-transparent via-cyan-200/20 to-transparent rounded-full transform -rotate-12"></div>
          <div className="absolute bottom-1/3 right-1/2 w-28 h-6 bg-gradient-to-r from-transparent via-emerald-300/25 to-transparent rounded-full transform rotate-45"></div>
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(20,184,166,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(20,184,166,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>

        {/* Animated particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-teal-400 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${Math.random() * 4 + 2}px`,
              height: `${Math.random() * 4 + 2}px`,
              opacity: Math.random() * 0.3 + 0.1,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>

      {/* Hero Section with Zoom Effect */}
      <section className="relative min-h-screen flex items-center justify-center px-4" style={getTransformStyle()}>
        <div className="text-center z-10 max-w-4xl mx-auto">
          {/* Floating Food Icons */}
          <div className="absolute inset-0 pointer-events-none">
            {foodIcons.map(({ Icon, delay, color }, index) => (
              <div
                key={index}
                className={`absolute ${color}`}
                style={{
                  left: `${15 + (index * 12)}%`,
                  top: `${20 + Math.sin(index) * 30}%`,
                  animation: `bounce 3s infinite ${delay}, float 6s ease-in-out infinite ${delay}`
                }}
              >
                <Icon size={40 + Math.random() * 20} />
              </div>
            ))}
          </div>

          {/* Main Logo Animation */}
          <div className="mb-8 relative">
            <div className="inline-flex items-center justify-center w-32 h-32 rounded-full bg-gradient-to-r from-emerald-400 to-teal-400 shadow-2xl mb-6">
              <ChefHat className="w-16 h-16 text-white animate-bounce" />
            </div>
          </div>

          {/* Enhanced Title with Better Highlighting */}
          <div className="relative mb-6">
            {/* Multiple layered backgrounds for better highlighting */}
            <div className="absolute inset-0 -m-12">
              {/* Main highlight background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-teal-100/30 to-white/20 rounded-3xl blur-2xl"></div>
              
              {/* Secondary glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-200/25 via-cyan-200/35 to-teal-200/25 rounded-3xl blur-xl"></div>
              
              {/* Inner highlight */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent rounded-3xl blur-sm"></div>
              
              {/* Enhanced sparkle effects */}
              <div className="absolute top-2 right-6 w-4 h-4 bg-teal-400/80 rounded-full animate-ping"></div>
              <div className="absolute bottom-3 left-8 w-3 h-3 bg-emerald-400/80 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute top-8 left-1/3 w-3 h-3 bg-cyan-400/80 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              <div className="absolute bottom-4 right-1/4 w-4 h-4 bg-teal-500/80 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
              <div className="absolute top-1/2 left-6 w-2 h-2 bg-emerald-500/80 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
              
              {/* Border highlight */}
              <div className="absolute inset-4 border-2 border-teal-300/30 rounded-2xl animate-pulse"></div>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-teal-700 via-emerald-600 to-[#213A57] bg-clip-text text-transparent drop-shadow-lg cinzel-bold">
              Food Chain
            </h1>
          </div>

          {/* Animated Subtitle */}
          <p className="text-xl md:text-2xl text-slate-700 mb-12 font-light tracking-wide">
            Connecting suppliers with street vendors
            <br />
            <span className="text-lg text-teal-600 italic">Empowering local food businesses</span>
          </p>

          {/* Changed Button Color to Green */}
          <div className="relative">
            <button
              onClick={() => window.location.href = '/login'}
              className="relative px-12 py-6 bg-gradient-to-r from-emerald-500 via-[#213A57] to-teal-500 rounded-full text-white font-bold text-xl shadow-2xl animate-bounce"
              style={{ animationDuration: '2s' }}
            >
              <div className="flex items-center space-x-3 text-white">
                <Package className="w-6 h-6 animate-spin text-white" style={{ animationDuration: '3s' }} />
                <span className="text-white">Get Started</span>
                <Store className="w-6 h-6 animate-pulse text-white" />
              </div>
            </button>
          </div>

         
         
        </div>
      </section>

      {/* Features Section with Dark Theme */}
      <section className="py-20 px-4 relative bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 overflow-hidden">
        {/* Dark Background Elements */}
        <div className="absolute inset-0">
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/50 via-gray-800/60 to-slate-900/50"></div>
          
          {/* Dark geometric patterns */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-teal-500/20 to-emerald-500/20 rounded-full blur-xl"></div>
            <div className="absolute top-40 right-20 w-48 h-48 bg-gradient-to-r from-cyan-500/15 to-teal-500/15 rounded-full blur-2xl"></div>
            <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 rounded-full blur-xl"></div>
            <div className="absolute bottom-40 right-10 w-36 h-36 bg-gradient-to-r from-teal-500/15 to-emerald-500/15 rounded-full blur-xl"></div>
          </div>

          {/* Dark grid pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="w-full h-full" style={{
              backgroundImage: `
                linear-gradient(rgba(20, 184, 165, 0.63) 1px, transparent 1px),
                linear-gradient(90deg, rgba(1, 79, 69, 0.6) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}></div>
          </div>

          {/* Dark animated particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-teal-400/30 animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
                opacity: Math.random() * 0.5 + 0.1,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${Math.random() * 4 + 3}s`
              }}
            />
          ))}
        </div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-6">
              Why Choose Our Platform?
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Experience seamless supply chain management designed specifically for street food vendors
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-teal-400/50 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl shadow-lg hover:bg-white/15"
              >
                {/* Icon with Gradient Background */}
                <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-teal-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-xl`}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Image and Info Section */}
      <section className="py-20 px-4 relative bg-gradient-to-br from-teal-50 via-emerald-100 to-cyan-200">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left side - Image placeholder */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/60 to-white/40 backdrop-blur-sm rounded-3xl p-8 border border-teal-200/50">
                <div className="aspect-square bg-gradient-to-br from-teal-200/40 to-emerald-300/40 rounded-2xl overflow-hidden relative">
                  <img 
                    src="/stall.png" 
                    alt="Food Chain" 
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </div>

                {/* Decorative elements */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-full opacity-60"></div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-full opacity-40"></div>
              </div>
            </div>

            {/* Right side - Information */}
            <div className="space-y-8">
              <div>
                <h2 className="text-4xl font-bold text-slate-800 mb-6">
                  Bridging the Gap Between 
                  <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent"> Suppliers & Street Vendors</span>
                </h2>
                <p className="text-slate-700 text-lg leading-relaxed">
                  Our platform connects raw material suppliers directly with street food vendors, 
                  eliminating middlemen and ensuring fair prices for quality ingredients. 
                  We're revolutionizing the street food supply chain across India.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-teal-400 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Handshake className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Direct Partnerships</h3>
                    <p className="text-slate-600">Connect directly with verified suppliers and build lasting business relationships</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Quality Assured</h3>
                    <p className="text-slate-600">All suppliers are verified and materials undergo quality checks before delivery</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-slate-800 mb-2">Smart Logistics</h3>
                    <p className="text-slate-600">Optimized delivery routes and inventory management for efficient operations</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Attractive Animated Footer */}
      <footer className="relative bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 py-16 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-600/10 via-emerald-500/15 to-cyan-600/10"></div>
          
          {/* Floating orbs */}
          <div className="absolute top-10 left-10 w-24 h-24 bg-gradient-to-r from-teal-400/20 to-emerald-400/20 rounded-full blur-xl animate-pulse" style={{ animationDuration: '3s' }}></div>
          <div className="absolute bottom-10 right-20 w-32 h-32 bg-gradient-to-r from-cyan-400/15 to-teal-400/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '4s', animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/3 w-20 h-20 bg-gradient-to-r from-emerald-400/25 to-cyan-400/25 rounded-full blur-lg animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }}></div>
          
          {/* Animated lines */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-teal-400/50 to-transparent animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          
          {/* Moving particles */}
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-teal-400/40 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 6 + 2}px`,
                height: `${Math.random() * 6 + 2}px`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 4 + 3}s`
              }}
            />
          ))}
        </div>

        {/* Main Footer Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Team Name with Spectacular Effects */}
          <div className="relative mb-8">
            {/* Glowing background */}
            <div className="absolute inset-0 -m-8">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 via-emerald-400/30 to-cyan-500/20 rounded-3xl blur-2xl animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent rounded-3xl blur-sm animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* Sparkle effects around the text */}
            <div className="absolute -top-4 -left-4 w-3 h-3 bg-teal-400 rounded-full animate-ping"></div>
            <div className="absolute -top-2 right-8 w-2 h-2 bg-emerald-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute -bottom-3 left-12 w-4 h-4 bg-cyan-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
            <div className="absolute -bottom-4 -right-6 w-3 h-3 bg-teal-500 rounded-full animate-ping" style={{ animationDelay: '1.5s' }}></div>
            <div className="absolute top-1/2 -left-8 w-2 h-2 bg-emerald-500 rounded-full animate-ping" style={{ animationDelay: '2s' }}></div>
            <div className="absolute top-1/3 -right-4 w-2 h-2 bg-cyan-500 rounded-full animate-ping" style={{ animationDelay: '2.5s' }}></div>
            
            {/* Main text */}
            <h3 className="text-2xl font-light text-gray-300 mb-2 animate-pulse">Made with ❤️ by</h3>
            <h2 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent animate-shimmer relative">
              Team Zenith
              {/* Underline effect */}
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 rounded-full animate-pulse"></div>
            </h2>
          </div>

          {/* Animated Icons */}
          <div className="flex justify-center space-x-8 mb-8">
            <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-emerald-700 rounded-full flex items-center justify-center animate-bounce shadow-lg">
              <Star className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '3s' }} />
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{ animationDelay: '0.2s' }}>
              <Zap className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full flex items-center justify-center animate-bounce shadow-lg" style={{ animationDelay: '0.4s' }}>
              <Heart className="w-6 h-6 text-white animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          {/* Footer Message */}
          <p className="text-gray-400 text-lg font-light animate-fade-in-up">
            Empowering the future of street food supply chains
          </p>
          
          {/* Year */}
          <div className="mt-6 text-gray-500 text-sm animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            © 2025 Food Chain Platform
          </div>
        </div>

        {/* Bottom Border Animation */}
        <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-teal-500/0 via-emerald-400/60 to-teal-500/0 animate-pulse"></div>
      </footer>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
        }
        
        .animate-shimmer {
          background-size: 200% 200%;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
      `}</style>
    </div>
  );
};

export default SupplyChainLanding;