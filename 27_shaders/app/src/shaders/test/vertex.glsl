uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat4 modelMatrix;

uniform float uTime;

attribute vec3 position;
attribute vec2 uv;
attribute float aRandom;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;


void main() {
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);


  float elevation = sin((modelPosition.x - uTime * .4) * 10.0) * 0.1;
  elevation +=  sin((modelPosition.y - uTime) * 20.0) * 0.005;

  // Scale elevation based on x position (reduce on the left)
  // clamp((modelPosition.x - uMinX) / (uMaxX - uMinX), 0.0, 1.0)
  float xFactor = clamp((position.x + .5) / 1.0 + .1, 0.0, 1.0);
  elevation *= xFactor;

  modelPosition.z += elevation;

  modelPosition.y += elevation * 0.1;
  modelPosition.x += elevation * .1;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  
  vElevation = elevation;
  vUv = uv;
}