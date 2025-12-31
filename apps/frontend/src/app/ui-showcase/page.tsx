"use client";

import { ModernCard } from "@/components/ui/modern-card";
import { ModernButton } from "@/components/ui/modern-button";
import { ModernInput } from "@/components/ui/modern-input";
import { ModernBadge } from "@/components/ui/modern-badge";

export default function UIShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-8">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl mb-6">
            <span className="text-4xl font-bold text-white">O</span>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Optiq Modern UI Showcase
          </h1>
          <p className="text-xl text-gray-600">Experience the new design system</p>
        </div>

        {/* Components Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Cards Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modern Cards</h2>
            
            <ModernCard variant="default">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Default Card</h3>
              <p className="text-gray-600">Clean white background with subtle shadow and hover effect.</p>
            </ModernCard>

            <ModernCard variant="glass">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Glassmorphism Card</h3>
              <p className="text-gray-600">Frosted glass effect with backdrop blur for modern depth.</p>
            </ModernCard>

            <ModernCard variant="gradient">
              <h3 className="text-lg font-semibold text-white mb-2">Gradient Card</h3>
              <p className="text-white/90">Bold gradient background for premium feel and emphasis.</p>
            </ModernCard>
          </div>

          {/* Buttons Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modern Buttons</h2>
            
            <ModernCard variant="default">
              <div className="space-y-4">
                <ModernButton variant="primary" size="lg" className="w-full">
                  Primary Button
                </ModernButton>
                
                <ModernButton variant="secondary" size="lg" className="w-full">
                  Secondary Button
                </ModernButton>
                
                <ModernButton variant="ghost" size="lg" className="w-full">
                  Ghost Button
                </ModernButton>
                
                <ModernButton variant="gradient" size="lg" className="w-full">
                  Gradient Button
                </ModernButton>
                
                <ModernButton variant="primary" size="lg" loading className="w-full">
                  Loading State
                </ModernButton>
              </div>
            </ModernCard>
          </div>

          {/* Inputs Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modern Inputs</h2>
            
            <ModernCard variant="glass">
              <div className="space-y-4">
                <ModernInput
                  label="Email Address"
                  type="email"
                  placeholder="you@example.com"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  }
                />
                
                <ModernInput
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  helperText="Must be at least 8 characters"
                  icon={
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  }
                />
                
                <ModernInput
                  label="Error State"
                  type="text"
                  error="This field is required"
                  placeholder="Enter something..."
                />
              </div>
            </ModernCard>
          </div>

          {/* Badges Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Modern Badges</h2>
            
            <ModernCard variant="default">
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <ModernBadge variant="success">Success</ModernBadge>
                  <ModernBadge variant="warning">Warning</ModernBadge>
                  <ModernBadge variant="error">Error</ModernBadge>
                  <ModernBadge variant="info">Info</ModernBadge>
                  <ModernBadge variant="default">Default</ModernBadge>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <ModernBadge variant="success" size="sm">Small</ModernBadge>
                  <ModernBadge variant="info" size="md">Medium</ModernBadge>
                  <ModernBadge variant="error" size="lg">Large</ModernBadge>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <ModernBadge variant="success" pulse>Live</ModernBadge>
                  <ModernBadge variant="info" pulse>Active</ModernBadge>
                </div>
              </div>
            </ModernCard>
          </div>
        </div>

        {/* Color Palette */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Color Palette</h2>
          <ModernCard variant="glass">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {[
                { name: "Blue 600", color: "#3b82f6" },
                { name: "Purple 600", color: "#8b5cf6" },
                { name: "Pink 600", color: "#ec4899" },
                { name: "Green 600", color: "#10b981" },
                { name: "Orange 600", color: "#f59e0b" },
                { name: "Red 600", color: "#ef4444" },
                { name: "Gray 900", color: "#111827" },
                { name: "Gray 100", color: "#f3f4f6" },
              ].map((color) => (
                <div key={color.name} className="text-center">
                  <div
                    className="w-full h-20 rounded-xl shadow-md mb-2"
                    style={{ backgroundColor: color.color }}
                  ></div>
                  <p className="text-xs font-semibold text-gray-700">{color.name}</p>
                  <p className="text-xs text-gray-500">{color.color}</p>
                </div>
              ))}
            </div>
          </ModernCard>
        </div>

        {/* Typography */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Typography</h2>
          <ModernCard variant="default">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold text-gray-900">Heading 1 - 4xl</h1>
              <h2 className="text-3xl font-bold text-gray-900">Heading 2 - 3xl</h2>
              <h3 className="text-2xl font-bold text-gray-900">Heading 3 - 2xl</h3>
              <h4 className="text-xl font-semibold text-gray-900">Heading 4 - xl</h4>
              <p className="text-base text-gray-700">Body text - base (16px)</p>
              <p className="text-sm text-gray-600">Small text - sm (14px)</p>
              <p className="text-xs text-gray-500">Extra small - xs (12px)</p>
            </div>
          </ModernCard>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <ModernCard variant="gradient">
            <h3 className="text-2xl font-bold text-white mb-2">🎨 Modern Design System</h3>
            <p className="text-white/90 mb-4">
              Built with glassmorphism, gradients, and smooth animations
            </p>
            <div className="flex justify-center gap-4">
              <ModernBadge variant="success">WCAG AA</ModernBadge>
              <ModernBadge variant="info">8px Grid</ModernBadge>
              <ModernBadge variant="default">Mobile First</ModernBadge>
            </div>
          </ModernCard>
        </div>
      </div>
    </div>
  );
}
