import * as THREE from 'three';

//Satellite animation
// Create an array of times for the keyframes (in seconds)
var times2 = [0, 15];

// Create an array of values for the position.y track (in meters)
var positionValues2 = [ -30, -100, -100, 150, 150, -40 ];

// Create a position.x track with linear interpolation
var positionTrack2 = new THREE.KeyframeTrack('.position', times2 ,positionValues2 ,THREE.InterpolateSmooth);

// set up rotation about x axis
var xAxis = new THREE.Vector3( 0.5, 0, 0 );
var qInitial = new THREE.Quaternion().setFromAxisAngle( xAxis, 0 );
var qFinal = new THREE.Quaternion().setFromAxisAngle( xAxis, Math.PI );
var quaternionKF2 = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 10, 15 ], [ qInitial.x, qInitial.y, qInitial.z, qInitial.w, qFinal.x, qFinal.y, qFinal.z, qFinal.w, qInitial.x, qInitial.y, qInitial.z, qInitial.w ] );

export const satelliteAnimation = new THREE.AnimationClip('satellite', -1 ,[positionTrack2, quaternionKF2]); 

// Radar animation
// set up rotation about x axis
var times3 = [0];
var yAxis = new THREE.Vector3( 0, 1, 0 );
var qInitial2 = new THREE.Quaternion().setFromAxisAngle( yAxis, 0 );
var qFinal2 = new THREE.Quaternion().setFromAxisAngle( yAxis, Math.PI);
var qFinal3 = new THREE.Quaternion().setFromAxisAngle( yAxis, Math.PI*2);
var positionValues3 = [ -18.5, 0.5, -72];
var positionTrack3 = new THREE.KeyframeTrack('.position', times3, positionValues3 ,THREE.InterpolateSmooth);
var quaternionKF3 = new THREE.QuaternionKeyframeTrack( '.quaternion', [ 0, 2, 4 ], [  qInitial2.x, qInitial2.y, qInitial2.z, qInitial2.w, qFinal2.x, qFinal2.y, qFinal2.z, qFinal2.w, qFinal3.x, qFinal3.y, qFinal3.z, qFinal3.w ] );

export const radarAnimation = new THREE.AnimationClip('radar', -1 ,[positionTrack3, quaternionKF3], THREE.NormalBlending); 




