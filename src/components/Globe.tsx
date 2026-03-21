import { useEffect, useRef } from "react";
import createGlobe from "cobe";
import { useTheme } from "./ThemeProvider";

const Globe = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let phi = 0;
    const isDark = theme === "dark";

    const globe = createGlobe(canvas, {
      devicePixelRatio: 2,
      width: 800 * 2,
      height: 800 * 2,
      phi: 0,
      theta: 0.25,
      dark: isDark ? 1 : 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: isDark ? 6 : 2,
      baseColor: isDark ? [0.15, 0.2, 0.25] : [0.9, 0.92, 0.95],
      markerColor: [0.3, 0.85, 0.7],
      glowColor: isDark ? [0.08, 0.15, 0.18] : [0.85, 0.88, 0.92],
      markers: [
        { location: [19.4326, -99.1332], size: 0.06 }, // Mexico City
        { location: [37.7749, -122.4194], size: 0.04 }, // SF
        { location: [51.5074, -0.1278], size: 0.04 }, // London
        { location: [35.6762, 139.6503], size: 0.04 }, // Tokyo
        { location: [1.3521, 103.8198], size: 0.04 }, // Singapore
      ],
      onRender: (state) => {
        state.phi = phi;
        phi += 0.003;
      },
    });

    return () => globe.destroy();
  }, [theme]);

  return (
    <div className="fixed inset-0 z-0 flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        className="opacity-20 max-w-[800px] max-h-[800px] w-full h-full"
        style={{ width: 800, height: 800 }}
      />
    </div>
  );
};

export default Globe;
