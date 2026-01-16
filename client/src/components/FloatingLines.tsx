import { useEffect, useRef } from 'react';
import {
  Scene,
  OrthographicCamera,
  WebGLRenderer,
  PlaneGeometry,
  Mesh,
  ShaderMaterial,
  Vector3,
  Vector2,
  Clock
} from 'three';

const vertexShader = `
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragmentShader = `
precision highp float;

uniform float iTime;
uniform vec3 iResolution;
uniform float uAnimationSpeed;
uniform float uLightMode; // 0: dark mode, 1: light mode

uniform bool uEnableTop;
uniform bool uEnableMiddle;
uniform bool uEnableBottom;

uniform int uTopLineCount;
uniform int uMiddleLineCount;
uniform int uBottomLineCount;

uniform float uTopLineDistance;
uniform float uMiddleLineDistance;
uniform float uBottomLineDistance;

uniform vec3 uTopWavePosition;
uniform vec3 uMiddleWavePosition;
uniform vec3 uBottomWavePosition;

uniform vec2 uMouse;
uniform bool uInteractive;
uniform float uBendRadius;
uniform float uBendStrength;
uniform float uBendInfluence;

uniform bool uParallax;
uniform float uParallaxStrength;
uniform vec2 uParallaxOffset;

uniform vec3 uLineGradient[8];
uniform int uLineGradientCount;

const vec3 DARK_BLACK = vec3(0.0);
const vec3 DARK_PINK  = vec3(233.0, 71.0, 245.0) / 255.0;
const vec3 DARK_BLUE  = vec3(47.0,  75.0, 162.0) / 255.0;

const vec3 LIGHT_BLACK = vec3(1.0);
const vec3 LIGHT_PINK  = vec3(255.0, 200.0, 255.0) / 255.0;
const vec3 LIGHT_BLUE  = vec3(200.0, 220.0, 255.0) / 255.0;

mat2 rotate(float r) {
  return mat2(cos(r), sin(r), -sin(r), cos(r));
}

vec3 getBackgroundColor(vec2 uv, float lightMode) {
  vec3 black = mix(DARK_BLACK, LIGHT_BLACK, lightMode);
  vec3 blue = mix(DARK_BLUE, LIGHT_BLUE, lightMode);
  vec3 pink = mix(DARK_PINK, LIGHT_PINK, lightMode);
  
  vec3 col = vec3(0.0);
  float y = sin(uv.x - 0.2) * 0.3 - 0.1;
  float m = uv.y - y;

  col += mix(blue, black, smoothstep(0.0, 1.0, abs(m)));
  col += mix(pink, black, smoothstep(0.0, 1.0, abs(m - 0.8)));
  return col * 0.5;
}

vec3 getLineColor(float t, vec3 baseColor, float lightMode) {
  if (uLineGradientCount <= 0) {
    return baseColor;
  }

  vec3 gradientColor;
  
  if (uLineGradientCount == 1) {
    gradientColor = uLineGradient[0];
  } else {
    float clampedT = clamp(t, 0.0, 0.9999);
    float scaled = clampedT * float(uLineGradientCount - 1);
    int idx = int(floor(scaled));
    float f = fract(scaled);
    int idx2 = min(idx + 1, uLineGradientCount - 1);

    vec3 c1 = uLineGradient[idx];
    vec3 c2 = uLineGradient[idx2];
    
    gradientColor = mix(c1, c2, f);
  }
  
  // Adjust brightness for light mode
  return gradientColor * mix(0.5, 0.8, lightMode);
}

float wave(vec2 uv, float offset, vec2 screenUv, vec2 mouseUv, bool shouldBend) {
  float time = iTime * uAnimationSpeed;

  float x_offset   = offset;
  float x_movement = time * 0.1;
  float amp        = sin(offset + time * 0.2) * 0.3;
  float y          = sin(uv.x + x_offset + x_movement) * amp;

  if (shouldBend) {
    vec2 d = screenUv - mouseUv;
    float influence = exp(-dot(d, d) * uBendRadius);
    float bendOffset = (mouseUv.y - screenUv.y) * influence * uBendStrength * uBendInfluence;
    y += bendOffset;
  }

  float m = uv.y - y;
  return 0.0175 / max(abs(m) + 0.01, 1e-3) + 0.01;
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy;
  vec2 baseUv = (2.0 * fragCoord - iResolution.xy) / iResolution.y;
  baseUv.y *= -1.0;
  
  if (uParallax) {
    baseUv += uParallaxOffset;
  }

  vec3 col = vec3(0.0);
  vec3 bg = uLineGradientCount > 0 ? vec3(0.0) : getBackgroundColor(baseUv, uLightMode);

  vec2 mouseUv = vec2(0.0);
  if (uInteractive) {
    mouseUv = (2.0 * uMouse - iResolution.xy) / iResolution.y;
    mouseUv.y *= -1.0;
  }
  
  // Bottom waves
  if (uEnableBottom) {
    for (int i = 0; i < uBottomLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(uBottomLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, bg, uLightMode);
      
      float angle = uBottomWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(uBottomLineDistance * fi + uBottomWavePosition.x, uBottomWavePosition.y),
        1.5 + 0.2 * fi,
        baseUv,
        mouseUv,
        uInteractive
      ) * 0.2;
    }
  }

  // Middle waves
  if (uEnableMiddle) {
    for (int i = 0; i < uMiddleLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(uMiddleLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, bg, uLightMode);
      
      float angle = uMiddleWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      col += lineCol * wave(
        ruv + vec2(uMiddleLineDistance * fi + uMiddleWavePosition.x, uMiddleWavePosition.y),
        2.0 + 0.15 * fi,
        baseUv,
        mouseUv,
        uInteractive
      );
    }
  }

  // Top waves
  if (uEnableTop) {
    for (int i = 0; i < uTopLineCount; ++i) {
      float fi = float(i);
      float t = fi / max(float(uTopLineCount - 1), 1.0);
      vec3 lineCol = getLineColor(t, bg, uLightMode);
      
      float angle = uTopWavePosition.z * log(length(baseUv) + 1.0);
      vec2 ruv = baseUv * rotate(angle);
      ruv.x *= -1.0;
      col += lineCol * wave(
        ruv + vec2(uTopLineDistance * fi + uTopWavePosition.x, uTopWavePosition.y),
        1.0 + 0.2 * fi,
        baseUv,
        mouseUv,
        uInteractive
      ) * 0.1;
    }
  }

  // Alpha blending for better mixing
  float alpha = 0.8 + uLightMode * 0.1;
  gl_FragColor = vec4(col, alpha);
}
`;

const MAX_GRADIENT_STOPS = 8;

interface WavePosition {
  x: number;
  y: number;
  rotate: number;
}

interface FloatingLinesProps {
  linesGradient?: string[];
  enabledWaves?: Array<'top' | 'middle' | 'bottom'>;
  lineCount?: number | number[];
  lineDistance?: number | number[];
  topWavePosition?: WavePosition;
  middleWavePosition?: WavePosition;
  bottomWavePosition?: WavePosition;
  animationSpeed?: number;
  lightMode?: boolean;
  interactive?: boolean;
  bendRadius?: number;
  bendStrength?: number;
  mouseDamping?: number;
  parallax?: boolean;
  parallaxStrength?: number;
  mixBlendMode?: React.CSSProperties['mixBlendMode'];
  className?: string;
  style?: React.CSSProperties;
}

function hexToVec3(hex: string): Vector3 {
  let value = hex.trim();
  
  if (value.startsWith('#')) {
    value = value.slice(1);
  }
  
  let r = 255, g = 255, b = 255;
  
  if (value.length === 3) {
    r = parseInt(value[0] + value[0], 16);
    g = parseInt(value[1] + value[1], 16);
    b = parseInt(value[2] + value[2], 16);
  } else if (value.length === 6) {
    r = parseInt(value.slice(0, 2), 16);
    g = parseInt(value.slice(2, 4), 16);
    b = parseInt(value.slice(4, 6), 16);
  }
  
  return new Vector3(r / 255, g / 255, b / 255);
}

const FloatingLines: React.FC<FloatingLinesProps> = ({
  linesGradient,
  enabledWaves = ['top', 'middle', 'bottom'],
  lineCount = [6],
  lineDistance = [5],
  topWavePosition,
  middleWavePosition,
  bottomWavePosition = { x: 2.0, y: -0.7, rotate: -1 },
  animationSpeed = 1,
  lightMode = false,
  interactive = true,
  bendRadius = 5.0,
  bendStrength = -0.5,
  mouseDamping = 0.05,
  parallax = true,
  parallaxStrength = 0.2,
  mixBlendMode = 'screen',
  className = '',
  style = {},
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number>();
  const targetMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const currentMouseRef = useRef<Vector2>(new Vector2(-1000, -1000));
  const targetInfluenceRef = useRef<number>(0);
  const currentInfluenceRef = useRef<number>(0);
  const targetParallaxRef = useRef<Vector2>(new Vector2(0, 0));
  const currentParallaxRef = useRef<Vector2>(new Vector2(0, 0));

  const getLineCount = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineCount === 'number') return lineCount;
    const index = enabledWaves.indexOf(waveType);
    return index >= 0 ? (lineCount[index] ?? 6) : 0;
  };

  const getLineDistance = (waveType: 'top' | 'middle' | 'bottom'): number => {
    if (typeof lineDistance === 'number') return lineDistance;
    const index = enabledWaves.indexOf(waveType);
    return index >= 0 ? (lineDistance[index] ?? 5) : 0;
  };

  const topLineCount = getLineCount('top');
  const middleLineCount = getLineCount('middle');
  const bottomLineCount = getLineCount('bottom');

  const topLineDistance = getLineDistance('top') * 0.01;
  const middleLineDistance = getLineDistance('middle') * 0.01;
  const bottomLineDistance = getLineDistance('bottom') * 0.01;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Clear any existing canvas
    container.innerHTML = '';

    const scene = new Scene();
    const camera = new OrthographicCamera(-1, 1, 1, -1, 0, 1);
    camera.position.z = 1;

    const renderer = new WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new Vector3(1, 1, 1) },
      uAnimationSpeed: { value: animationSpeed },
      uLightMode: { value: lightMode ? 1.0 : 0.0 },

      uEnableTop: { value: enabledWaves.includes('top') },
      uEnableMiddle: { value: enabledWaves.includes('middle') },
      uEnableBottom: { value: enabledWaves.includes('bottom') },

      uTopLineCount: { value: topLineCount },
      uMiddleLineCount: { value: middleLineCount },
      uBottomLineCount: { value: bottomLineCount },

      uTopLineDistance: { value: topLineDistance },
      uMiddleLineDistance: { value: middleLineDistance },
      uBottomLineDistance: { value: bottomLineDistance },

      uTopWavePosition: {
        value: new Vector3(
          topWavePosition?.x ?? 10.0,
          topWavePosition?.y ?? 0.5,
          topWavePosition?.rotate ?? -0.4
        )
      },
      uMiddleWavePosition: {
        value: new Vector3(
          middleWavePosition?.x ?? 5.0,
          middleWavePosition?.y ?? 0.0,
          middleWavePosition?.rotate ?? 0.2
        )
      },
      uBottomWavePosition: {
        value: new Vector3(
          bottomWavePosition.x,
          bottomWavePosition.y,
          bottomWavePosition.rotate
        )
      },

      uMouse: { value: new Vector2(-1000, -1000) },
      uInteractive: { value: interactive },
      uBendRadius: { value: bendRadius },
      uBendStrength: { value: bendStrength },
      uBendInfluence: { value: 0 },

      uParallax: { value: parallax },
      uParallaxStrength: { value: parallaxStrength },
      uParallaxOffset: { value: new Vector2(0, 0) },

      uLineGradient: {
        value: Array.from({ length: MAX_GRADIENT_STOPS }, () => new Vector3(1, 1, 1))
      },
      uLineGradientCount: { value: 0 }
    };

    if (linesGradient && linesGradient.length > 0) {
      const stops = linesGradient.slice(0, MAX_GRADIENT_STOPS);
      uniforms.uLineGradientCount.value = stops.length;

      stops.forEach((hex, i) => {
        const color = hexToVec3(hex);
        uniforms.uLineGradient.value[i].set(color.x, color.y, color.z);
      });
    }

    const material = new ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false
    });

    const geometry = new PlaneGeometry(2, 2);
    const mesh = new Mesh(geometry, material);
    scene.add(mesh);

    const clock = new Clock();

    const resize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.iResolution.value.set(clientWidth, clientHeight, 1);
    };

    resize();
    window.addEventListener('resize', resize);

    let isPointerInside = false;
    
    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerInside) return;
      
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      targetMouseRef.current.set(x, rect.height - y);
      targetInfluenceRef.current = 1.0;

      if (parallax) {
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const offsetX = (x - centerX) / rect.width;
        const offsetY = -(y - centerY) / rect.height;
        targetParallaxRef.current.set(offsetX * parallaxStrength, offsetY * parallaxStrength);
      }
    };

    const handlePointerEnter = () => {
      isPointerInside = true;
    };

    const handlePointerLeave = () => {
      isPointerInside = false;
      targetInfluenceRef.current = 0.0;
    };

    if (interactive) {
      container.addEventListener('pointermove', handlePointerMove);
      container.addEventListener('pointerenter', handlePointerEnter);
      container.addEventListener('pointerleave', handlePointerLeave);
    }

    const update = (time: number) => {
      uniforms.iTime.value = clock.getElapsedTime();

      if (interactive) {
        currentMouseRef.current.lerp(targetMouseRef.current, mouseDamping);
        uniforms.uMouse.value.copy(currentMouseRef.current);

        currentInfluenceRef.current += (targetInfluenceRef.current - currentInfluenceRef.current) * mouseDamping;
        uniforms.uBendInfluence.value = currentInfluenceRef.current;
      }

      if (parallax) {
        currentParallaxRef.current.lerp(targetParallaxRef.current, mouseDamping);
        uniforms.uParallaxOffset.value.copy(currentParallaxRef.current);
      }

      renderer.render(scene, camera);
      animationFrameId.current = requestAnimationFrame(update);
    };
    animationFrameId.current = requestAnimationFrame(update);

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      
      window.removeEventListener('resize', resize);
      
      if (interactive) {
        container.removeEventListener('pointermove', handlePointerMove);
        container.removeEventListener('pointerenter', handlePointerEnter);
        container.removeEventListener('pointerleave', handlePointerLeave);
      }
      
      // Clean up Three.js resources
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [
    linesGradient,
    enabledWaves,
    lineCount,
    lineDistance,
    topWavePosition,
    middleWavePosition,
    bottomWavePosition,
    animationSpeed,
    lightMode,
    interactive,
    bendRadius,
    bendStrength,
    mouseDamping,
    parallax,
    parallaxStrength
  ]);

  return (
    <div
      ref={containerRef}
      className={`w-full h-full ${className}`}
      style={{
        mixBlendMode,
        position: 'relative',
        overflow: 'hidden',
        ...style
      }}
      {...rest}
    />
  );
};

export default FloatingLines;