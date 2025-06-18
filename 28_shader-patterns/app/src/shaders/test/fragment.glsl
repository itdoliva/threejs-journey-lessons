#define M_PI 3.1415926535897932384626433832795
varying vec2 vUv;

float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78233))) * 43758.5453123);
}

vec2 rotate(vec2 uv, float rotation, vec2 mid) {
    float x = uv.x - mid.x;
    float y = uv.y - mid.y;
    return vec2(
        cos(rotation) * x + sin(rotation) * y + mid.x,
        cos(rotation) * y - sin(rotation) * x + mid.y
    );
}

vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}

vec2 fade(vec2 t) {return t*t*t*(t*(t*6.0-15.0)+10.0);}

float cnoise(vec2 P){
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, 289.0); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;
  vec4 i = permute(permute(ix) + iy);
  vec4 gx = 2.0 * fract(i * 0.0243902439) - 1.0; // 1/41 = 0.024...
  vec4 gy = abs(gx) - 0.5;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;
  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);
  vec4 norm = 1.79284291400159 - 0.85373472095314 * 
    vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11));
  g00 *= norm.x;
  g01 *= norm.y;
  g10 *= norm.z;
  g11 *= norm.w;
  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));
  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

void main()
{
    // float strength = length(vUv - .5);
    // float strength = .015 / distance(vUv, vec2(.5));

    // float outerCircle = pow(distance(vUv, vec2(.5)), 2.1);
    // float innerCircle = pow(.5 - distance(vUv, vec2(.5)), 2.);
    // float strength = max(outerCircle, innerCircle);

    // vec2 uvWaved = vec2(
    //     vUv.x + sin(vUv.y * 100.) * .1,
    //     vUv.y + sin(vUv.x * 100.) * .1
    // );


    // float strength = 1.0 - step(.01, abs(distance(uvWaved, vec2(.5)) - .25));
    // float strength = 1.0 - abs(distance(vUv, vec2(.5)) - .25);
    // float strength = 1.0 - abs(distance(uvWaved, vec2(.5)) - .25);

    // float angle = atan(vUv.x - .5, vUv.y - .5);
    // float normAngle = (M_PI + angle) / (M_PI * 2.);
    // float offsetAngle = -M_PI + normAngle;
    // float strength = mod(20.0 * offsetAngle, 1.0);
    // float strength = sin(normAngle * 200.);

    // float angle = atan(vUv.x -.5, vUv.y - .5);
    // float normAngle = (M_PI + angle) / (2. * M_PI);
    // float sinusoid = sin(normAngle * 200.);

    // float radius = .25 + sinusoid * .02;
    // float circle = 1.0 - step(.01, abs(distance(vUv, vec2(.5)) - radius));

    // float strength = circle;

    float strength = step(.95, sin(cnoise(vUv * 10.) * 20.));

    vec3 blackColor = vec3(0.);
    vec3 uvColor = vec3(vUv, .5);
    vec3 mixedColor = mix(blackColor, uvColor, strength);

    gl_FragColor = vec4(mixedColor, 1.);
}