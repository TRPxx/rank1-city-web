'use client';

import Image from 'next/image';
import { useState } from 'react';

/**
 * ItemImage Component
 * Optimized component for displaying game item images
 * 
 * Features:
 * - Next.js Image Optimization (WebP, Lazy Loading, Resize)
 * - Fallback to placeholder if image not found
 * - Loading state
 * - Error handling
 * 
 * @param {string} itemName - Item name (e.g., "water", "bread")
 * @param {number} size - Size in pixels (default: 64)
 * @param {string} className - Additional CSS classes
 */
export default function ItemImage({
    itemName,
    size = 64,
    className = '',
    showLabel = false,
    priority = false
}) {
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);

    // Normalize item name (lowercase, remove spaces)
    const normalizedName = itemName?.toLowerCase().replace(/\s+/g, '_') || 'unknown';
    const imagePath = `/items/${normalizedName}.png`;
    const fallbackPath = '/items/placeholder.png';

    return (
        <div className={`relative inline-block ${className}`}>
            <div
                className="relative overflow-hidden rounded-md bg-gray-800/50 border border-gray-700/50"
                style={{ width: size, height: size }}
            >
                <Image
                    src={error ? fallbackPath : imagePath}
                    alt={itemName || 'Item'}
                    width={size}
                    height={size}
                    className="object-contain"
                    loading={priority ? undefined : 'lazy'}
                    priority={priority}
                    onLoad={() => setLoading(false)}
                    onError={() => {
                        setError(true);
                        setLoading(false);
                    }}
                    unoptimized={false} // Enable Next.js optimization
                />

                {/* Loading Spinner */}
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50">
                        <div className="w-6 h-6 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
                    </div>
                )}
            </div>

            {/* Item Label (Optional) */}
            {showLabel && (
                <p className="mt-1 text-xs text-center text-gray-400 truncate">
                    {itemName}
                </p>
            )}
        </div>
    );
}

/**
 * Usage Examples:
 * 
 * Basic:
 * <ItemImage itemName="water" />
 * 
 * Custom size:
 * <ItemImage itemName="bread" size={128} />
 * 
 * With label:
 * <ItemImage itemName="weapon_pistol" showLabel />
 * 
 * Priority loading (above the fold):
 * <ItemImage itemName="money" priority />
 */
