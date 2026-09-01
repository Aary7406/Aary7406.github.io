import{j as E}from"./vendor-animation-BdJVjJPr.js";import{r}from"./vendor-router-DK12iaxc.js";import{C as F,L as D,S as L,O as G,W,a as H,V as z,P as j,M as k}from"./vendor-three-0ITt8PtG.js";const O=({text:m="Aary.Hinge"})=>{const a=r.useRef(null),p=r.useRef(null),v=r.useRef(null),x=r.useRef(null),f=r.useRef({x:.5,y:.5}),g=r.useRef({x:.5,y:.5}),s=r.useRef(null),b=r.useRef(!0),[S,y]=r.useState(!1);r.useEffect(()=>{new FontFace("Kisthe","url(/Fonts/Kisthe-BF69030b51234d0.otf)").load().then(e=>{document.fonts.add(e),y(!0)}).catch(()=>{y(!0)})},[]);const h=r.useCallback((t,e,o)=>{const u=document.createElement("canvas"),i=u.getContext("2d"),n=Math.min(window.devicePixelRatio,2);u.width=e*n,u.height=o*n,i.scale(n,n),i.clearRect(0,0,e,o);const c=Math.min(e*.18,200);i.font=`${c}px "Kisthe", "Space Grotesk", system-ui, sans-serif`,i.textAlign="center",i.textBaseline="middle";const l=i.createLinearGradient(0,o*.3,e,o*.7);l.addColorStop(0,"#7dd3fc"),l.addColorStop(.5,"#f0abfc"),l.addColorStop(1,"#bef264"),i.fillStyle=l,i.fillText(t,e/2,o/2);const d=new F(u);return d.minFilter=D,d.magFilter=D,d.needsUpdate=!0,d},[]),T=`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,C=`
    precision highp float;
    
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform vec2 uResolution;
    uniform float uPixelSize;
    uniform float uDistortionStrength;
    
    varying vec2 vUv;
    
    // Hash function for noise
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    // 2D noise
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    void main() {
      vec2 uv = vUv;
      
      // Aspect ratio correction
      vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
      
      // Mouse influence calculation
      vec2 mousePos = uMouse;
      vec2 toMouse = (uv - mousePos) * aspect;
      float dist = length(toMouse);
      float influence = smoothstep(0.25, 0.0, dist);
      
      // Dynamic pixel grid - gets coarser near mouse
      float basePixelSize = uPixelSize;
      float dynamicPixelSize = basePixelSize * (1.0 + influence * 2.0);
      vec2 pixelGrid = uResolution / dynamicPixelSize;
      vec2 pixelatedUv = floor(uv * pixelGrid) / pixelGrid;
      
      // Wave distortion radiating from mouse
      float wave = sin(dist * 25.0 - uTime * 3.0) * 0.5 + 0.5;
      float distortionAmount = influence * uDistortionStrength * wave;
      
      // Direction-based displacement
      vec2 dir = normalize(toMouse + 0.001);
      vec2 displacement = dir * distortionAmount * 0.04;
      
      // Add noise-based jitter for organic feel
      float n = noise(pixelatedUv * 50.0 + uTime * 0.5);
      displacement += (vec2(n) - 0.5) * influence * 0.015;
      
      // Final UV with pixelation + displacement
      vec2 finalUv = mix(uv, pixelatedUv, influence * 0.7) + displacement;
      
      // RGB chromatic aberration - shifts based on distortion
      float rgbShift = distortionAmount * 0.008;
      float r = texture2D(uTexture, finalUv + vec2(rgbShift, 0.0)).r;
      float g = texture2D(uTexture, finalUv).g;
      float b = texture2D(uTexture, finalUv - vec2(rgbShift, 0.0)).b;
      float a = texture2D(uTexture, finalUv).a;
      
      // Sample original alpha for visibility
      float originalAlpha = texture2D(uTexture, uv).a;
      float finalAlpha = max(a, originalAlpha * 0.5);
      
      // Glitch line effect near mouse
      float glitchLine = step(0.98, fract(uv.y * 50.0 + uTime * 2.0)) * influence * 0.3;
      
      // Color output with glitch
      vec3 color = vec3(r, g, b);
      color += glitchLine * vec3(0.5, 0.8, 1.0);
      
      // Ensure we have visible alpha
      gl_FragColor = vec4(color, finalAlpha);
    }
  `,w=r.useCallback(t=>{if(!a.current)return;const e=a.current.getBoundingClientRect();g.current={x:(t.clientX-e.left)/e.width,y:1-(t.clientY-e.top)/e.height}},[]),R=r.useCallback(()=>{if(!p.current||!v.current||!a.current)return;const t=a.current.clientWidth,e=a.current.clientHeight;p.current.setSize(t,e),v.current.uniforms.uResolution.value.set(t,e),s.current&&s.current.dispose(),s.current=h(m,t,e),v.current.uniforms.uTexture.value=s.current},[m,h]);return r.useEffect(()=>{if(!a.current||!S)return;const t=a.current,e=t.clientWidth,o=t.clientHeight,u=new L,i=new G(-1,1,1,-1,0,1),n=new W({antialias:!0,alpha:!0,premultipliedAlpha:!1,powerPreference:"high-performance"});n.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.setSize(e,o),n.setClearColor(0,0),t.appendChild(n.domElement),p.current=n,s.current=h(m,e,o);const c=new H({vertexShader:T,fragmentShader:C,uniforms:{uTexture:{value:s.current},uTime:{value:0},uMouse:{value:new z(.5,.5)},uResolution:{value:new z(e,o)},uPixelSize:{value:8},uDistortionStrength:{value:1}},transparent:!0,depthTest:!1,depthWrite:!1});v.current=c;const l=new j(2,2),d=new k(l,c);u.add(d);const A=Date.now(),M=()=>{x.current=requestAnimationFrame(M),b.current&&(f.current.x+=(g.current.x-f.current.x)*.1,f.current.y+=(g.current.y-f.current.y)*.1,c.uniforms.uTime.value=(Date.now()-A)*.001,c.uniforms.uMouse.value.set(f.current.x,f.current.y),n.render(u,i))};M();const P=new IntersectionObserver(([U])=>{b.current=U.isIntersecting},{threshold:.05});return P.observe(t),window.addEventListener("mousemove",w,{passive:!0}),window.addEventListener("resize",R,{passive:!0}),()=>{P.disconnect(),x.current&&cancelAnimationFrame(x.current),window.removeEventListener("mousemove",w),window.removeEventListener("resize",R),l.dispose(),c.dispose(),s.current&&s.current.dispose(),n.dispose(),t&&n.domElement.parentNode===t&&t.removeChild(n.domElement)}},[m,S,h,w,R,T,C]),E.jsx("div",{ref:a,className:"w-full h-64 md:h-80 lg:h-96 relative",style:{minHeight:"280px"},"aria-label":m,role:"heading","aria-level":"1"})};export{O as default};
