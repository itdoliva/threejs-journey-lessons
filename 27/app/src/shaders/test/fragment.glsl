precision mediump float;

uniform vec3 uColor;
uniform sampler2D uTexture;

varying float vRandom;
varying vec2 vUv;
varying float vElevation;

void main() {
  // gl_FragColor = vec4(.5, vRandom, 1.0, 1.0);
  // gl_FragColor = vec4(uColor, 1.0);

  vec4 textureColor = texture2D(uTexture, vUv);
  textureColor.rgb *= vElevation * 2.0 + .9;
  gl_FragColor = textureColor;
}