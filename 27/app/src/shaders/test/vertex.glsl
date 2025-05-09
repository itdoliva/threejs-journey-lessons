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

  float elevation = sin((modelPosition.x - uTime * .2) * 10.0) * 0.1;
  elevation +=  sin((modelPosition.y - uTime * .2) * 10.0) * 0.1;

  modelPosition.z += elevation;

  vec4 viewPosition = viewMatrix * modelPosition;
  vec4 projectedPosition = projectionMatrix * viewPosition;

  gl_Position = projectedPosition;
  
  vElevation = elevation;
  vUv = uv;
}